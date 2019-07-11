import * as firebase from "firebase/app";
import "firebase/firestore";
import AuthService from "./auth-service";
import Room from "@/models/Room";
import Video from "@/models/Video";
import 'firebase/firestore';
import { callbackify } from 'util';

export default class RoomService {
  static instance: RoomService;

  private authService = new AuthService();

  constructor() {
    if (!RoomService.instance) {
      RoomService.instance = this;
    }
    return RoomService.instance;
  }

  async getRoomsForCurrentUser(): Promise<Array<Room>> {
    return new Promise<Array<Room>>(async (resolve, reject) => {
      const userSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(this.authService.currentUserId)
        .get();
      if (!userSnapshot.exists || !userSnapshot.data()) {
        reject();
        console.log("oh no no user: " + this.authService.currentUserId);
      }
      const userData = userSnapshot.data()!;
      var rooms: Array<Room> = [];
      for (const roomId of userData.rooms) {
        const roomSnapshot = await firebase
          .firestore()
          .collection("rooms")
          .doc(roomId)
          .get();
        if (!roomSnapshot.exists || !roomSnapshot.data()) {
          reject();
          console.log("oh no no room: " + roomId);
        }
        const roomData = roomSnapshot.data()!;
        let room = new Room(
          roomData.id,
          roomData.roomName,
          roomData.creationDate,
          roomData.privacy,
          roomData.members,
          roomData.videos
        );
        room.id = roomSnapshot.id;
        room.members = roomData.members;
        let videos: Array<Video> = [];
        const videosSnapshot = await firebase
          .firestore()
          .collection("rooms")
          .doc(roomId)
          .collection("videos")
          .get();
        videosSnapshot.docs.forEach(videoDoc => {
          const videoData = videoDoc.data();
          let video = new Video();
          video.id = videoDoc.id;
          video.link = videoData.link;
          videos.push(video);
        });
        room.videos = videos;
        rooms.push(room);
      }
      resolve(rooms);
    });
  }

  async createRoom(
    roomName: string,
    privacy: number,
  ) {
    return firebase
      .firestore()
      .collection("rooms")
      .add({
        roomName: roomName,
        privacy: privacy,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        members: [],
        videos: []
      })
  } 

  async isPlayingListener(roomId: string, callback: Function) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        callback(doc.data()!.isPlaying);
      });
  }

  async isPlayingUpdater(roomId: string, value: boolean) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .update({
        "isPlaying": value
      });
  }

  async isMutedListener(roomId: string, callback: Function) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        callback(doc.data()!.isMuted);
      })
  }

  async isMutedUpdater(roomId: string, value: boolean) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .update({
        "isMuted": value
      });
  }
}