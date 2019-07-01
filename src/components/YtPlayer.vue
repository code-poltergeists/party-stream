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
import io from 'socket.io-client';

@Component
export default class YtPlayer extends Vue {
  @Prop() private msg!: string;
	private socket:any =  io('localhost:3000');

  get player() {
    // @ts-ignore
    return this.$refs.youtube.player;
  }

  public playing() {
		this.socket.emit('PLAYING', {
			status: 1,
		})
  }

  public paused() {
  	this.socket.emit('PAUSED',{
			status: 1,
		})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
