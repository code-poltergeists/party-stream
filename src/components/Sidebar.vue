<template>
  <div id="sidebar">
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
#sidebar {
  height: 90vh;
  width: 100%;
  background-color: #29333c;
  border-right: 5px solid rgb(90, 97, 100);
  border-bottom-right-radius: 10px;
  position: absolute;
  top: 10vh;
}
</style>
