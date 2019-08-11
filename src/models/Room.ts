import Video from './Video';

export default class Room {
  id: string;
  creationDate: Date;
  inviteCode: number;
  isMuted: boolean;
  isPlaying: boolean;
  members: Array<String>;
  privacy: number;
  roomName: string;
  startTime: Date;
  time: number;
  videos: Array<Video>;
  volume: number;
  constructor(
    id: string,
    creationDate: Date,
    inviteCode: number,
    isMuted: boolean,
    isPlaying: boolean,
    members: Array<String>,
    privacy: number,
    roomName: string,
    startTime: Date,
    time: number,
    videos: Array<Video>,
    volume: number
  ) {
    this.id = id;
    this.creationDate = creationDate;
    this.inviteCode = inviteCode;
    this.isMuted = isMuted;
    this.isPlaying = isPlaying;
    this.members = members;
    this.roomName = roomName;
    this.privacy = privacy;
    this.startTime = startTime;
    this.time = time;
    this.videos = videos;
    this.volume = volume;
  }
}