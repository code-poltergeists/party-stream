<template>
  <div id="player" ref="player">
    <youtube
      :video-id="videoId"
      id="youtube"
      :playerVars="{controls: 0, disablekb: 1, modestbranding: 1}"
      ref="youtube"
      :fitParent="true"
    />
    <div @mouseover="onMouseOver" @mouseleave="onMouseLeave" @mousemove="onMouseMove">
      <div id="thumbnail" v-if="!isPlaying" :style="{backgroundImage: `url(${videoThumbnail})`}"></div>
      <div v-if="videoId === 'false'">
        <div id="overlay" v-if="videoId === 'false'">
          <div id="overlay-content-2-meme">
            <div id="video-title">No videos in queue</div>
            <div id="added-by">
              <div>Add a video now!</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else id="overlay">
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
            <div>{{ whoAdded }}</div>
          </div>
          <div id="controls">
            <div
              @click="playpause"
            >{{ $t(firstTimePlaying ? 'start-playing' : 'continue-playing') }}</div>
          </div>
        </div>
      </div>
      <div id="no-clicks-on-iframe-because-somehow-pointer-events-none-is-not-working"></div>
      <div id="bar-container" v-show="isPlaying">
        <div id="progress-slider-container">
          <input
            id="progress-slider"
            class="slider"
            ref="progressSlider"
            type="range"
            value="0"
            min="0"
            max="100"
            @input="onProgressChange(parseInt($event.target.value))"
          />
        </div>
        <div id="bar">
          <i
            id="playpause"
            @click="playpause"
            :class="{'fas': true, 'fa-pause': isPlaying, 'fa-play': !isPlaying}"
          ></i>
          <div id="time">{{ formatTime(elapsedTime) }} - {{ formatTime(totalTime) }}</div>
          <i
            id="mute"
            @click="chooseMute"
            :class="{'fas': true, 'fa-volume-mute': isMuted, 'fa-volume-up': !isMuted}"
          ></i>
          <div id="volume-slider-container">
            <input
              id="volume-slider"
              class="slider"
              ref="volumeSlider"
              type="range"
              value="0"
              min="0"
              max="100"
              @input="onVolumeChange($event.target.value)"
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
import FullScreenHelper from "../../helpers/full-screen";
import TimeHelper from "../../helpers/time";
import VideoService from "../../services/video-service";
import RoomService from "@/services/room-service";

@Component
export default class Player extends Vue {
  @Prop()
  videoId: string;

  @Prop()
  roomId: string;

  @Prop()
  whoAdded: string;

  @Prop()
  calculatedTime: number;

  isLoaded = false;
  RoomService = new RoomService();
  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  shouldShow = false;

  timer: any;
  progressTimer: any;

  shouldUpdateSliders = true;

  videoTitle = "";
  videoThumbnail = "";

  elapsedTime: number | null = null;
  totalTime: number | null = null;

  firstTimePlaying = true;

  videoService = new VideoService();

  pauseTimestamp = new Date();
  playTimestamp = new Date();
  timeMissed = 0;

  lastTimeFromFirestore = -1;

  onVolumeChange(volume: number) {
    this.RoomService.updateVolume(this.roomId, volume);
    this.applyFill(volume, "volumeSlider");
  }

  onProgressChange(time: number) {
    this.RoomService.updateTime(this.roomId, time, new Date());
    this.applyFill(time, "progressSlider");
  }

  mounted() {
    this.videoService
      .getVideoTitle(this.videoId)
      .then(title => {
        this.videoTitle = title;
        this.videoThumbnail = this.videoService.getVideoThumbnail(this.videoId);
      })
      .catch(e => console.log(e));
    (this.player as any).getDuration().then((duration: number) => {
      this.elapsedTime = this.calculatedTime;
      if (this.elapsedTime >= duration) {
        this.elapsedTime = 0;
        this.playpause();
      }
      (this.player as any).seekTo(this.elapsedTime);
      this.totalTime = duration;
      this.setupProgress();
      (this.$refs.progressSlider as any).max = duration;
    });
    window.setInterval(() => {
      if (this.isPlaying && this.shouldUpdateSliders) {
        (this.player as any).getCurrentTime().then((time: number) => {
          this.elapsedTime = Math.floor(time);
          this.applyFill(time, "progressSlider");
        });
        (this.player as any).getVolume().then((volume: number) => {
          this.applyFill(volume, "volumeSlider");
        });
      }
    }, 1000);
    window.setInterval(() => {
      (this.player as any).getPlayerState().then((state: number) => {
        /* 
            -1 – unstarted
            0 – ended
            1 – playing
            2 – paused
            3 – buffering
            5 – video cued
         */
        if (state === 0) {
          this.$emit("ended");
        }
        this.shouldUpdateSliders = state === 1;
      });
    }, 100);
    FullScreenHelper.onFullscreenChange(() => {
      this.isFullscreen = !this.isFullscreen;
    });
    this.RoomService.isPlayingListener(this.roomId, (isPlaying: boolean) => {
      isPlaying ? this.play() : this.pause();
    });

    this.RoomService.isMutedListener(this.roomId, (isMuted: boolean) => {
      isMuted ? this.mute() : this.unMute();
    });
    this.RoomService.timeListener(this.roomId, (time: number) => {
      if (time !== this.lastTimeFromFirestore) {
        (this.player as any).seekTo(time);
        this.lastTimeFromFirestore = time;
      }
    });
    this.RoomService.volumeListener(this.roomId, (volume: number) => {
      (this.player as any).setVolume(volume);
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
    this.RoomService.isPlayingUpdater(
      this.roomId,
      !this.isPlaying,
      this.elapsedTime,
      new Date()
    );
  }

  chooseMute() {
    this.RoomService.isMutedUpdater(this.roomId, !this.isMuted);
  }

  mute() {
    (this.player as any).mute();
    this.RoomService.isMutedUpdater(this.roomId, true);
    this.isMuted = true;
  }

  unMute() {
    (this.player as any).unMute();
    this.RoomService.isMutedUpdater(this.roomId, false);
    this.isMuted = false;
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

  onMouseMove(value: any) {
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
    if (circle === undefined || text === undefined) {
      return;
    }
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

  applyFill(value: any, sliderName: string) {
    const slider = this.$refs[sliderName] as any;
    if (slider === undefined) {
      return;
    }
    slider.value = value;
    let percentage = (100 * (value - slider.min)) / (slider.max - slider.min);
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
  z-index: 9995;
}

#no-clicks-on-iframe-because-somehow-pointer-events-none-is-not-working {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9996;
}

#thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9997;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
  background-color: rgba(26, 35, 40, 0.75);
  border: 2px solid #36a86d;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#overlay-content-2-meme {
  background-color: rgba(26, 35, 40, 1);
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
