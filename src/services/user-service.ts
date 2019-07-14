import * as firebase from "firebase/app";
import "firebase/firestore";

export default class UserService {
  static instance: UserService;

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
}
