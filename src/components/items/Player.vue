<template>
  <div id="player">
    <youtube
      video-id="dQw4w9WgXcQ"
      :playerVars="{controls: 0, disablekb: 1, modestbranding: 1}"
      ref="youtube"
      @playing="isPlaying = true"
      @paused="isPlaying = false"
      :fitParent="true"
    />
    <div
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove"
    >
      <div id="overlay" @click="playpause"></div>
      <div id="bar" v-if="shouldShow">
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
import { truncate } from "fs";
import { clearTimeout } from "timers";

@Component
export default class Player extends Vue {
  isPlaying = false;
  shouldShow = false;

  timer: any;

  get player() {
    return (this.$refs.youtube as any).player;
  }

  playpause() {
    this.isPlaying ? this.player.pauseVideo() : this.player.playVideo();
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
    console.log(event.clientX, event.clientY);
    this.shouldShow = true;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.shouldShow = false;
    }, 2000);
  }
}
</script>

<style scoped lang="scss">
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
  z-index: 9999;
  pointer-events: auto;
}

// #overlay:hover {
//   pointer-events: none;
// }
 
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
  background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%);
  display: flex;
  align-items: center;
}

#playpause {
  color: white;
  font-size: 30px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
