import Video from './Video';

export default class Room {
  id: string;
  roomName: string;
  creationDate: Date;
  members: Array<String>;
  videos: Array<Video>;
  constructor(
    id: string,
    roomName: string,
    creationDate: Date,
    members: Array<String>,
    videos: Array<Video>
  ) {
    this.id = id;
    this.roomName = roomName;
    this.creationDate = creationDate;
    this.members = members;
    this.videos = videos;
  }
}