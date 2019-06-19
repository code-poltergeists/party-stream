<template>
  <div id="layout" class="container-fluid">
    <div class="row no-gutters">
      <div class="col-2">
        <div id="sidebar"></div>
      </div>
      <div class="col-10">
        <div id="topbar">
          <div id="border"></div>
        </div>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Layout extends Vue {}
</script>

<style scoped lang="scss">
#layout {
  margin: 0;
  padding: 0;
  height: 100%;
}

#topbar {
  background-color: #29333c;
  height: 15vh;
  border-bottom-right-radius: 10px;
  position: relative;
}

#border {
  border-bottom: 5px solid rgb(90, 97, 100);
  position: absolute;
  bottom: 0;
  left: -20%;
  right: 0;
}

#sidebar {
  height: 100vh;
  width: 100%;
  background-color: #29333c;
  border-right: 5px solid rgb(90, 97, 100);
  border-bottom-right-radius: 10px;
}
</style>
