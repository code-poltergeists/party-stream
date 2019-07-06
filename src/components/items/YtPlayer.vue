<template>
  <div>
    <youtube video-id="dQw4w9WgXcQ" 
             ref="youtube" 
             @playing="playing"
             @paused="paused" 
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class YtPlayer extends Vue {
  @Prop() private msg!: string;
  private isPlaying: number = 0;
  private isPaused: number = 0;

  get player() {
    // @ts-ignore
    return this.$refs.youtube.player;
  }

  // Start of async functions from YT API
  public async playVideo() {
    await this.player.playVideo();
  }

  public async pauseVideo() {
    await this.player.pauseVideo();
  }

  public playing() {
		
  }

  public paused() {
  	
  }
  
  mounted() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
