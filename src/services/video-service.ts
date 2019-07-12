import axios from "axios";

export default class VideoService {
  static instance: VideoService;

  constructor() {
    if (!VideoService.instance) {
      VideoService.instance = this;
    }
    return VideoService.instance;
  }

  async getVideoTitle(id: string) {
    return new Promise<string>((resolve, reject) => {
      axios
        .get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            id: id,
            part: "snippet",
            key: process.env.VUE_APP_youtubeKey
          }
        })
        .then(response => {
          resolve(response.data.items[0].snippet.title);
        })
        .catch(e => reject(e));
    });
  }

  async getVideoDuration(id: string) {
    return new Promise<string>((resolve, reject) => {
      axios
        .get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            id: id,
            part: "contentDetails",
            key: process.env.VUE_APP_youtubeKey
          }
        })
        .then(response => {
          resolve(response.data.items[0].contentDetails.duration);
        })
        .catch(e => reject(e));
    });
  }

  getVideoThumbnail(id: string) {
    return `https://img.youtube.com/vi/${id}/sddefault.jpg`;
  };
}
