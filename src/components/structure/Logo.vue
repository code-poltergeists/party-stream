<template>
  <div id="logo-container">
    <div id="logo">
      <i class="fas fa-stream"></i>
      Party-stream
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component
export default class Logo extends Vue {
  
}
</script>

<style scoped lang="scss">
#logo-container {
  width: 100%;
  background-color: #29333c;
  border-right: 5px solid rgb(90, 97, 100);
  box-sizing: border-box;
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 23px;
  text-align: center;
  display: flex;
  align-items: center;
  border-bottom: 5px solid rgb(90, 97, 100);
}

#logo {
  width: 100%;
}
</style>
