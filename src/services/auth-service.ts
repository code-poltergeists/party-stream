import User from '@/models/User';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
    if (AuthService.instance) {
      return AuthService.instance;
    } else {
      AuthService.instance = this;
      return this;
    }
  }

  async signUp(email: string, password: string, username: string, name: string, photoUrl: string): Promise<User> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(_ => {
      let user = new User();
      user.name = name;
      user.photoUrl = photoUrl;
      user.username = username;
      return user;
    });
  }

  async signIn(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async currentUser(): Promise<User | null> {
    if (!firebase.auth().currentUser) {
      return null;
    }
    return firebase.firestore().collection('users').doc(firebase.auth().currentUser!.uid).get().then(doc => {
      const data = doc.data()!;
      let user = new User();
      user.name = data.name;
      user.photoUrl = data.photoUrl;
      user.username = data.username;
      return user;
    });
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
      url: 'https://party-stream-1321f.firebaseapp.com/auth',
      handleCodeInApp: true,
    });
  }

  async finishLinkLogIn(email: string, link: string): Promise<any> {
    return firebase.auth().signInWithEmailLink(email, link);
  }

  async signInWithPhoneNumber(phoneNumber: string, appVerifier: any) {
    return firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
  }
}
