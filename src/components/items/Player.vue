<template>
  <div id="player">
    <youtube
      video-id="dQw4w9WgXcQ"
      id="youtube"
      :playerVars="{controls: 0, disablekb: 1, modestbranding: 1}"
      ref="youtube"
      :fitParent="true"
    />
    <div @mouseover="onMouseOver" @mouseleave="onMouseLeave" @mousemove="onMouseMove">
      <div id="overlay">
        <div id="overlay-content" v-if="!isPlaying">
          <div id="video-title">{{ videoTitle }}</div>
          <div id="progress-and-text-container">
            <svg id="progress-container" width="600px" height="180px">
              <g>
                <circle
                  id="progress"
                  ref="progress"
                  cx="300"
                  cy="90"
                  r="75px"
                  fill="none"
                  stroke="none"
                />
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
            <div>Name</div>
          </div>
          <div id="controls">
            <div @click="play">Continue Playing</div>
          </div>
        </div>
      </div>
      <div id="no-clicks-on-iframe-because-somehow-pointer-events-none-is-not-working"></div>
      <div id="bar" v-if="shouldShow && isPlaying">
        <i
          id="playpause"
          @click="playpause"
          :class="{'fas': true, 'fa-pause': isPlaying, 'fa-play': !isPlaying}"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class Player extends Vue {
  isPlaying = false;
  shouldShow = false;

  timer: any;
  progressTimer: any;

  videoTitle = "";

  elapsedTime: number | null = null;
  totalTime: number | null = null;

  mounted() {
    axios
      .get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          id: "dQw4w9WgXcQ",
          part: "snippet",
          key: process.env.VUE_APP_youtubeKey
        }
      })
      .then(response => {
        this.videoTitle = response.data.items[0].snippet.title;
      })
      .catch(e => console.log(e));
    (this.player as any).getDuration().then((duration: number) => {
      this.elapsedTime = 0;
      this.totalTime = duration;
      this.setupProgress();
    });
  }

  formatTime(time: number | null) {
    if (time === null) {
      return "";
    }
    var formattedTime = "";
    if (time / 60 < 10) {
      formattedTime += 0;
    }
    formattedTime += Math.floor(time / 60);
    formattedTime += ":";
    const seconds = time - Math.floor(time / 60) * 60;
    if (seconds < 10) {
      formattedTime += 0;
    }
    formattedTime += seconds;
    return formattedTime;
  }

  get player() {
    return (this.$refs.youtube as any).player;
  }

  pause() {
    this.isPlaying = false;
    window.setTimeout(() => {
      this.player.pauseVideo();
      (this.player as any).getCurrentTime().then((time: number) => {
        this.elapsedTime = Math.floor(time);
        this.setupProgress();
      });
    }, 200);
  }

  play() {
    this.player.playVideo();
    window.setTimeout(() => {
      this.isPlaying = true;
    }, 200);
  }

  playpause() {
    this.isPlaying ? this.pause() : this.play();
  }

  onMouseOver() {
    this.shouldShow = true;
    this.timer = window.setTimeout(() => {
      this.shouldShow = false;
    }, 2000);
  }

  onMouseLeave() {
    window.clearTimeout(this.timer);
    this.shouldShow = false;
  }

  onMouseMove(event: any) {
    this.shouldShow = true;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.shouldShow = false;
    }, 2000);
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
}
</script>

<style scoped lang="scss">
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
}

#youtube {
  z-index: 9996;
}

#no-clicks-on-iframe-because-somehow-pointer-events-none-is-not-working {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9997;
}

#player {
  width: 100%;
  position: relative;
}

#bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 9999;
  background: linear-gradient(
    rgba(54, 168, 109, 0) 0%,
    rgba(54, 168, 109, 0.25) 100%
  );
  display: flex;
  align-items: center;
  z-index: 9999;
}

#playpause {
  color: white;
  font-size: 30px;
  margin-left: 10px;
  cursor: pointer;
}

#overlay-content {
  background-color: #1a2328;
  border: 2px solid #36a86d;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#video-title {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: center;
}

#progress-and-text-container {
  position: relative;
  margin: 20px 0;
}

#progress-container {
  display: block;
  margin: 0 auto;
}

#progress {
  fill: none;
  stroke-width: 12;
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
  font-size: 40px;
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
  font-size: 25px;
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
  font-size: 35px;
  cursor: pointer;
  margin-top: 50px;
}
</style>
