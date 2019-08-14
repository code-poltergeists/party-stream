import * as firebase from "firebase/app";
import "firebase/firestore";
import AuthService from "./auth-service";
import "firebase/storage";
import Message from "@/models/Message";

export default class ChatService {
  static instance: ChatService;

  private authService = new AuthService();

  constructor() {
    if (!ChatService.instance) {
      ChatService.instance = this;
    }
    return ChatService.instance;
  }

  async sendMessage(
    chatId: string,
    text: string,
    username: string,
    photoUrl: string
  ) {
    return firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        text: text,
        username: username,
        photoUrl: photoUrl,
        date: new Date(),
        userId: this.authService.currentUserId
      });
  }

  async listenForMessages(chatId: string, callback: Function) {
    return firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("date")
      .onSnapshot(snapshot => {
        callback(snapshot.docChanges());
      });
  }

  isSentByCurrentUser(message: Message) {
    return message.userId === this.authService.currentUserId;
  }

  isLastMessage(messages: Array<Message>, index: number) {
    return messages[index - 1]
      ? this.isSentByCurrentUser(messages[index - 1]) !==
          this.isSentByCurrentUser(messages[index])
      : true;
  }

  uploadPhoto(
    chatId: string,
    photoString: string,
    username: string,
    photoUrl: string
  ) {
    firebase
      .storage()
      .ref()
      .child("chatPictures/" + chatId + "/" + this.uuidv4() + ".png")
      .putString(photoString, "data_url")
      .then(task => {
        task.ref.getDownloadURL().then(downloadURL => {
          firebase
            .firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .add({
              attachment: downloadURL,
              username: username,
              photoUrl: photoUrl,
              date: new Date(),
              userId: this.authService.currentUserId
            });
        });
      });
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
