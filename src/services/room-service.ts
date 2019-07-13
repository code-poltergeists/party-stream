import * as firebase from "firebase/app";
import "firebase/firestore";
import AuthService from "./auth-service";
import Room from "@/models/Room";
import Video from "@/models/Video";
import "firebase/firestore";

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
      const roomsSnapshot = await firebase
        .firestore()
        .collection("rooms")
        .where("privacy", "==", 0)
        .get();
      let rooms: Array<Room> = [];
      for (let roomDoc of roomsSnapshot.docs) {
        const roomData = roomDoc.data();
        let room = new Room(
          roomData.id,
          roomData.roomName,
          roomData.creationDate,
          roomData.privacy,
          roomData.members,
          roomData.videos
        );
        room.id = roomDoc.id;
        room.members = roomData.members;
        let videos: Array<Video> = [];
        const videosSnapshot = await firebase
          .firestore()
          .collection("rooms")
          .doc(roomDoc.id)
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

  async createRoom(roomName: string, privacy: number) {
    return firebase
      .firestore()
      .collection("rooms")
      .add({
        roomName: roomName,
        privacy: privacy,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        members: [],
        videos: []
      });
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
}
