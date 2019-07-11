<template>
  <div id="player" ref="player">
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
            <div>{{ $t('name') }}</div>
          </div>
          <div id="controls">
            <div @click="play">{{ $t(firstTimePlaying ? 'start-playing' : 'continue-playing') }}</div>
          </div>
        </div>
      </div>
      <div id="no-clicks-on-iframe-because-somehow-pointer-events-none-is-not-working"></div>
      <div id="bar-container">
        <div id="progress-slider-container">
          <input
            id="progress-slider"
            class="slider"
            ref="progressSlider"
            type="range"
            value="100"
            min="0"
            max="100"
            @input="applyFill($event, 'progressSlider', true)"
          />
        </div>
        <div id="bar" v-if="true">
          <i
            id="playpause"
            @click="playpause"
            :class="{'fas': true, 'fa-pause': isPlaying, 'fa-play': !isPlaying}"
          ></i>
          <div
            id="time"
          >{{ this.formatTime(this.elapsedTime) }} - {{ this.formatTime(this.totalTime) }}</div>
          <i
            id="mute"
            @click="mute"
            :class="{'fas': true, 'fa-volume-mute': isMuted, 'fa-volume-up': !isMuted}"
          ></i>
          <div id="volume-slider-container">
            <input
              id="volume-slider"
              class="slider"
              ref="volumeSlider"
              type="range"
              value="100"
              min="0"
              max="100"
              @input="applyFill($event, 'volumeSlider', true)"
            />
          </div>
          <i
            id="fullscreen"
            @click="fullscreen"
            :class="{'fas': true, 'fa-expand': !isFullscreen, 'fa-compress': isFullscreen}"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import FullScreenHelper from '../../helpers/full-screen';

@Component
export default class Player extends Vue {
  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  shouldShow = false;

  timer: any;
  progressTimer: any;

  videoTitle = "";

  elapsedTime: number | null = null;
  totalTime: number | null = null;

  currentVolume = 100;

  firstTimePlaying = true;

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
      (this.$refs.progressSlider as any).max = duration;
    });
    window.setInterval(() => {
      if (this.isPlaying) {
        (this.player as any).getCurrentTime().then((time: number) => {
          this.elapsedTime = Math.floor(time);
          this.applyFill(time, "progressSlider", false);
        });
      }
    }, 1000);
    this.applyFill(100, "volumeSlider", true);
    this.applyFill(0, "progressSlider", false);
    FullScreenHelper.onFullscreenChange(() => {
      this.isFullscreen = !this.isFullscreen;
    })
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
      this.setupProgress();
    }, 200);
  }

  play() {
    this.player.playVideo();
    window.setTimeout(() => {
      this.isPlaying = true;
      this.firstTimePlaying = false;
    }, 200);
  }

  playpause() {
    this.isPlaying ? this.pause() : this.play();
  }

  mute() {
    if (this.isMuted) {
      (this.player as any).unMute();
      this.applyFill(this.currentVolume, "volumeSlider", true);
    } else {
      (this.player as any).mute();
      this.applyFill(0, "volumeSlider", false);
    }
    this.isMuted = !this.isMuted;
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

  applyFill(event: any, sliderName: string, saveValue: boolean) {
    const slider = this.$refs[sliderName] as any;
    let percentage = 0;
    if (event.target) {
      percentage =
        (100 * (slider.value - slider.min)) / (slider.max - slider.min);
      if (sliderName === "volumeSlider") {
        (this.player as any).setVolume(event.target.value);
        if (saveValue) {
          this.currentVolume = event.target.value;
        }
      } else if (sliderName === "progressSlider") {
        if (saveValue) {
          (this.player as any).seekTo(event.target.value);
        }
      }
    } else {
      percentage = (100 * (event - slider.min)) / (slider.max - slider.min);
      slider.value = event;
      if (sliderName === "volumeSlider") {
        (this.player as any).setVolume(event);
        if (saveValue) {
          this.currentVolume = event;
        }
      } else if (sliderName === "progressSlider") {
        if (saveValue) {
          (this.player as any).seekTo(event);
        }
      }
    }
    slider.style.background = `linear-gradient(90deg, rgba(26, 188, 156, 0) 0%, #1abc9c ${percentage}%, #d7dcdf ${percentage +
      0.1}%, rgba(255, 255, 255, 0) 100%)`;
  }

  fullscreen() {
    if (!this.isFullscreen) {
      FullScreenHelper.enable(this.$refs.player as any);
    } else {
      FullScreenHelper.disable();
    }
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

#bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 55px;
  z-index: 9999;
}

#progress-slider-container {
  width: 100%;
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#bar {
  height: 50px;
  background: linear-gradient(
    rgba(54, 168, 109, 0) 0%,
    rgba(54, 168, 109, 0.25) 100%
  );
  display: flex;
  align-items: center;
}

#playpause {
  color: white;
  font-size: 30px;
  margin-left: 20px;
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

#time {
  color: white;
  font-family: "Montserrat";
  font-weight: 600;
  margin-left: 10px;
}

#mute {
  color: white;
  font-size: 30px;
  margin-left: 20px;
  cursor: pointer;
}

#volume-slider-container {
  width: 150px;
  height: 5px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider {
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  border-radius: 1000px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    background: radial-gradient(
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #ffffff;
    }
  }

  &:active::-webkit-slider-thumb {
    background: #ffffff;
  }

  &::-moz-slider-thumb {
    width: 15px;
    height: 15px;
    border: 0;
    background: radial-gradient(
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s ease-in-out;
    &:hover {
      background: #ffffff;
    }
  }

  &:active::-moz-slider-thumb {
    background: #ffffff;
  }
}

#fullscreen {
  color: white;
  font-size: 30px;
  margin-left: auto;
  margin-right: 20px;
  cursor: pointer;
}

// Firefox Overrides
::-moz-range-track {
  background: #d7dcdf;
  border: 0;
}

input::-moz-focus-inner,
input::-moz-focus-outer {
  border: 0;
}
</style>
