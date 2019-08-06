import * as firebase from "firebase/app";
import "firebase/firestore";
import AuthService from "./auth-service";
import "firebase/firestore";
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

  async sendMessage(chatId: string, text: string) {
    return firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        text: text,
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
}
