import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import AuthService from "./auth-service";

export default class UserService {
  static instance: UserService;

  authService = new AuthService();

  constructor() {
    if (!UserService.instance) {
      UserService.instance = this;
    }
    return UserService.instance;
  }

  async getUserIdByUsername(username: string) {
    return new Promise<string>((resolve, reject) => {
      firebase
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get()
        .then(snapshot => {
          if (snapshot.docs.length == 0) {
            reject();
          } else {
            resolve(snapshot.docs[0].id);
          }
        });
    });
  }

  async updateUserInfo(type: string, value: string) {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.authService.currentUserId)
      .update({ [type]: value });
  }

  async updateEmail(email: string) {
    return firebase.auth().currentUser.updateEmail(email);
  }

  async updatePassword(password: string) {
    return firebase.auth().currentUser.updatePassword(password);
  }

  get authMethod() {
    return firebase.auth().currentUser.providerData[0].providerId;
  }

  async reauthenticate(email, password) {
    return firebase
      .auth()
      .currentUser.reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(email, password)
      );
  }
}
