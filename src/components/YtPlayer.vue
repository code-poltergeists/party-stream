<template>
  <div>
    <iframe id="ytplayer"
      type="text/html" 
      width="720" 
      height="405" 
      src="https://www.youtube.com/embed/M7lc1UVf-VE" 
      frameborder="0" 
      allowfullscreen
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class YtPlayer extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
