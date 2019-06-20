<template>
  <div>
    <youtube video-id="BBJa32lCaaY" ref="youtube" />
    <br>
    <button v-on:click="logVideo">Press me I dare you</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class YtPlayer extends Vue {
  @Prop() private msg!: string;

  public logVideo() {
    console.log(this.$refs.youtube.player.getVolume());
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
