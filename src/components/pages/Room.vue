<template>
  <ytPlayer video_id="dQw4w9WgXcQ"></ytPlayer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ytPlayer from '../items/YtPlayer.vue';

@Component({
  components: {
    ytPlayer
  }
})
export default class Room extends Vue{

}
</script>

<style scoped lang="scss">

</style>