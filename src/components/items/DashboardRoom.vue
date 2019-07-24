<template>
  <div id="room" @click="redirectToRoom()">
    <div id="room-name">{{ room.roomName !== '' ? room.roomName : "no title yet :'(" }}</div>
    <div class="spacer"></div>
    <div id="thumbnail" :style="{backgroundImage: `url(${videoThumbnail})`}">
      <div id="thumbnail-overlay">
        <i class="far fa-play-circle"></i>
      </div>
    </div>
    <div class="spacer"></div>
    <div id="info">
      <div id="info-container">
        <i class="fab fa-youtube"></i>
        <div id="info-text">
          <div id="video-title">{{ videoTitle }}</div>
          <div id="time-and-people">
            <div id="time">{{ formatTime(elapsedTime) }} - {{ formatTime(totalTime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Room from "@/models/Room";
import TimeHelper from "../../helpers/time";
import VideoService from "../../services/video-service";

@Component
export default class DashboardRoom extends Vue {
  @Prop() private room!: Room;

  videoTitle = "";

  get videoThumbnail() {
    return this.room.videos[0] !== undefined &&
      this.room.videos[0].link !== undefined
      ? this.videoService.getVideoThumbnail(
          this.videoService.getVideoId(this.room.videos[0].link)
        )
      : "https://globalgamejam.org/sites/default/files/styles/game_sidebar__normal/public/game/featured_image/promo_5.png?itok=9dymM8JD";
  }

  videoService = new VideoService();

  elapsedTime: number | null = null;
  totalTime: number | null = null;

  progressTimer: any;

  mounted() {
    this.room.videos[0] !== undefined && this.room.videos[0].link !== undefined
      ? this.videoService
          .getVideoTitle(
            this.room.videos[0].link.replace(
              "https://www.youtube.com/watch?v=",
              ""
            )
          )
          .then(title => {
            this.videoTitle = title;
          })
          .catch(e => console.log(e))
      : (this.videoTitle = "nothing yet :'(");
    this.room.videos[0] !== undefined && this.room.videos[0].link !== undefined
      ? this.videoService
          .getVideoDuration(
            this.room.videos[0].link.replace(
              "https://www.youtube.com/watch?v=",
              ""
            )
          )
          .then(duration => {
            this.elapsedTime = 0;
            this.totalTime = TimeHelper.iso8601toNumber(duration);
          })
          .catch(e => console.log(e))
      : ((this.elapsedTime = 0), (this.totalTime = 0));
  }

  redirectToRoom() {
    this.$router.push({ name: "room", params: { id: this.room.id } });
  }

  get formatTime() {
    return TimeHelper.formatTime;
  }
}
</script>

<style scoped lang="scss">
#room {
  background-color: #29333c;
  border-radius: 50px;
  width: 500px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

#room:hover {
  cursor: pointer;
}

#room-name {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: center;
  margin: 10px 0;
}

.spacer {
  width: 100%;
  height: 2px;
  background-color: #e3e3e3;
}

#thumbnail {
  width: 100%;
  flex-grow: 2;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

#thumbnail-overlay {
  background-color: rgba(26, 35, 40, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > i {
    color: #e3e3e3;
    font-size: 100px;
  }
}

#info-container {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e3e3e3;
  width: 100%;
  margin: 10px 0;

  & > div {
    font-family: "Montserrat";
    margin-left: 20px;
    font-weight: 600;
  }

  & > i {
    font-size: 25px;
  }
}
</style>
