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
          roomData.creationDate,
          roomData.inviteCode,
          roomData.isMuted,
          roomData.isPlaying,
          roomData.members,
          roomData.privacy,
          roomData.roomName,
          roomData.time,
          roomData.videos,
          roomData.volume
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
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        inviteCode: (+new Date() * Math.random()).toString(36).substring(0, 6),
        isMuted: false,
        isPlaying: false,
        members: [],
        privacy: privacy,
        roomName: roomName,
        time: 0,
        volume: 100
      });
  }

  async joinRoom(code: string) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("rooms")
        .where("inviteCode", "==", code)
        .get()
        .then(snapshot => {
          if (snapshot.docs.length === 0) {
            reject();
          } else {
            console.log(snapshot.docs[0].data())
            this.addPeopleToRoom(snapshot.docs[0].id, [
              this.authService.currentUserId
            ]).then(() => {
              resolve();
            });
          }
        });
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

  async updateTime(roomId: string, value: number) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .update({
        "time": value
      })
  }

  async timeListener(roomId: string, callback: Function) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        callback(doc.data()!.time);
      });
  }

  async updateVolume(roomId: string, value: number) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .update({
        "volume": value
      })
  }

  async volumeListener(roomId: string, callback: Function) {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        callback(doc.data()!.volume);
      });
  }

  async addPeopleToRoom(roomId: string, users: Array<String>) {
    return firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .update({
        members: firebase.firestore.FieldValue.arrayUnion(...users)
      });
  }

  async isPrivate(roomId: string) {
    return new Promise<boolean>((resolve, reject) => {
      firebase.firestore().collection('rooms').doc(roomId).get().then(doc => {
        if (!doc.exists) {
          reject();
        } else {
          resolve(doc.data()!.privacy === 1);
        }
      });
    });
  }

  async getRoomInfo(roomId: string): Promise<Room> {
    return new Promise<Room>(async (resolve, reject) => {
      const roomSnapshot = await firebase
        .firestore()
        .collection("rooms")
        .doc(roomId)
        .get()
      const roomData = roomSnapshot.data();
      let room = new Room(
        roomData.id,
        roomData.creationDate,
        roomData.inviteCode,
        roomData.isMuted,
        roomData.isPlaying,
        roomData.members,
        roomData.privacy,
        roomData.roomName,
        roomData.time,
        roomData.videos,
        roomData.volume
      );
      room.id = roomSnapshot.id;
      let videos: Array<Video> = [];
      const videosSnapshot = await firebase
        .firestore()
        .collection("rooms")
        .doc(roomSnapshot.id)
        .collection("videos")
        .orderBy("date")
        .get()
      videosSnapshot.docs.forEach(videoDoc => {
        const videoData = videoDoc.data();
        let video = new Video();
        video.id = videoDoc.id;
        video.link = videoData.link;
        videos.push(video);
      });
      room.videos = videos;
      resolve(room);
    })
  }

  async addVideo(roomId: string, video: string, whoAdded: string, date: Date) {
    return firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("videos")
      .add({
        link: video,
        whoAdded: whoAdded,
        date: date
      })
  }
}

