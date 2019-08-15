import User from "@/models/User";
import { BehaviorSubject } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import store from "../store";

export default class AuthService {
  static instance: AuthService;

  public isAuthenticated$ = new BehaviorSubject<boolean | null>(null);

  private subscription: firebase.Unsubscribe | null = null;

  constructor() {
    if (!this.subscription) {
      this.subscription = firebase.auth().onAuthStateChanged(user => {
        this.isAuthenticated$.next(user !== null && user !== undefined);
      });
    }
    if (!AuthService.instance) {
      AuthService.instance = this;
    }
    return AuthService.instance;
  }

  async signUp(
    email: string,
    password: string,
    username: string,
    phone: string,
    photoString: string
  ): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.finishSignUp(email, username, phone, photoString, user.user!.uid);
      });
  }

  async finishSignUp(
    email: string,
    username: string,
    phone: string,
    photoString: string,
    userId: string
  ) {
    if (photoString.startsWith("base")) {
      return firebase
        .storage()
        .ref()
        .child("profilePictures/" + userId + ".png")
        .putString(photoString, "data_url")
        .then(task => {
          return task.ref.getDownloadURL().then(downloadURL => {
            var map: any = {
              email: email,
              username: username,
              photoUrl: downloadURL
            };
            if (phone !== "") {
              map["phone"] = phone;
            }
            return firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .set(map);
          });
        });
    } else {
      var map: any = {
        email: email,
        username: username,
        photoUrl: photoString
      };
      if (phone !== "") {
        map["phone"] = phone;
      }
      return firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(map);
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async currentUser(): Promise<User | null> {
    if (!firebase.auth().currentUser) {
      return null;
    }
    return firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser!.uid)
      .get()
      .then(doc => {
        const data = doc.data()!;
        let user = new User();
        user.email = data.email;
        user.photoUrl = data.photoUrl;
        user.username = data.username;
        user.id = firebase.auth().currentUser!.uid;
        return user;
      });
  }

  get currentUserId(): string {
    return firebase.auth().currentUser!.uid;
  }

  get isAuthenticated(): boolean | null {
    return this.isAuthenticated$.value;
  }

  isLoginLink(link: string) {
    return firebase.auth().isSignInWithEmailLink(link);
  }

  async logOut(): Promise<any> {
    return firebase.auth().signOut();
  }

  async sendLogInLink(email: string): Promise<void> {
    return firebase.auth().sendSignInLinkToEmail(email, {
      url: "https://party-stream-1321f.firebaseapp.com/auth",
      handleCodeInApp: true
    });
  }

  async finishLinkLogIn(email: string, link: string): Promise<any> {
    return firebase.auth().signInWithEmailLink(email, link);
  }

  async signInWithPhoneNumber(phoneNumber: string, appVerifier: any) {
    return firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
  }

  async facebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");
    store.commit("restrictRouterForwarding", true);
    return firebase.auth().signInWithPopup(provider);
  }

  async googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    store.commit("restrictRouterForwarding", true);
    return firebase.auth().signInWithPopup(provider);
  }

  signout() {
    firebase.auth().signOut().then(_ => {
      window.location.reload();
    })
  }
}
