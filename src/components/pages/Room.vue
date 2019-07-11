<template>
  <h1>Hi, and welcome to room {{ $route.params.id }}</h1>
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
h1 {
  color: white;
}
</style>