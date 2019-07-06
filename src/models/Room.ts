import Video from './Video';

export default class Room {
  public id: string = '';
  public members: Array<String> = [];
  public videos: Array<Video> = [];
}