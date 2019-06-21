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

  get player() {
    // @ts-ignore
    return this.$refs.youtube.player;
  }

  public playing() {
    console.log("hey I started");
  }

  public paused() {
    console.log("hey I stopped");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
