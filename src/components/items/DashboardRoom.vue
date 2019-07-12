<template>
  <div id="room">
    <div id="video-title">{{ videoTitle }}</div>
    <div id="progress-and-text-container">
      <svg id="progress-container" width="400px" height="120px">
        <g>
          <circle id="progress" ref="progress" cx="200" cy="60" r="50px" fill="none" stroke="none" />
        </g>
      </svg>
      <div id="percent" ref="percent">
        <div>{{ formatTime(elapsedTime) }}</div>
        <div>{{ $t('of') }}</div>
        <div>{{ formatTime(totalTime) }}</div>
      </div>
    </div>
    <div id="provider">
      <i class="fab fa-youtube"></i>
      <div>YouTube</div>
    </div>
    <div id="added-by">
      <div>{{ $t('added-by') }}</div>
      <i class="fas fa-user-circle"></i>
      <div>{{ $t('name') }}</div>
    </div>
    <div id="controls">{{ $t('start-playing') }}</div>
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

  videoService = new VideoService();

  elapsedTime: number | null = null;
  totalTime: number | null = null;

  progressTimer: any;

  mounted() {
    this.videoService
      .getVideoTitle(
        this.room.videos[0].link.replace("https://www.youtube.com/watch?v=", "")
      )
      .then(title => {
        this.videoTitle = title;
      })
      .catch(e => console.log(e));
    this.videoService
      .getVideoDuration(
        this.room.videos[0].link.replace("https://www.youtube.com/watch?v=", "")
      )
      .then(duration => {
        this.elapsedTime = 0;
        this.totalTime = TimeHelper.iso8601toNumber(duration);
      })
      .catch(e => console.log(e));
    this.setupProgress();
  }

  setupProgress() {
    if (this.totalTime === null || this.elapsedTime === null) {
      return;
    }
    var circle = this.$refs.progress as any;
    var text = this.$refs.percent as any;
    var angle = 0;
    var percent = ((this.elapsedTime * 100) / this.totalTime) * 4.7;

    this.progressTimer = window.setInterval(() => {
      circle.setAttribute("stroke-dasharray", angle + ", 20000");
      circle.setAttribute("stroke", "#f8f8f8");
      if (angle >= percent) {
        window.clearInterval(this.progressTimer);
      }
      angle += 7;
    }, 30);
  }

  get formatTime() {
    return TimeHelper.formatTime;
  }
}
</script>

<style scoped lang="scss">
#room {
  background-color: #1a2328;
  border: 5px solid #36a86d;
  border-radius: 50px;
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

#video-title {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: center;
}

#progress-and-text-container {
  position: relative;
}

#progress-container {
  display: block;
  margin: 0 auto;
}

#progress {
  fill: none;
  stroke-width: 7;
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(-90deg);
}

#percent {
  font-family: "Montserrat";
  font-weight: 600;
  color: white;
  font-size: 15px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}

#percent div {
  flex: 0;
  margin: 0;
}

#provider {
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

#provider div:last-child {
  margin-left: 20px;
  font-family: "Montserrat";
  font-weight: 600;
}

#added-by {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
}

#added-by *:nth-child(2) {
  margin-left: 20px;
  font-size: 30px;
}

#added-by *:nth-child(3) {
  margin-left: 10px;
}

#controls {
  color: #36a86d;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  margin-top: 20px;
}

#time {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  margin-left: 10px;
}
</style>
