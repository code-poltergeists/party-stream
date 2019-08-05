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

  async getMessages(chatId: string): Promise<Array<Message>> {
    return new Promise<Array<Message>>((resolve, reject) => {
      firebase
        .firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .get()
        .then(snapshot => {
          resolve(
            snapshot.docs.map(doc => {
              const map = doc.data();
              map.id = doc.id;
              return Message.fromMap(map);
            })
          );
        });
    });
  }

  isSentByCurrentUser(message: Message) {
    return message.id === this.authService.currentUserId;
  }
}
