<template>
  <div id="topbar">
    <div id="title">{{ $t(this.$route.name) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Topbar extends Vue {}
</script>

<style scoped lang="scss">
#topbar {
  background-color: #29333c;
  height: 10vh;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  border-bottom: 5px solid rgb(90, 97, 100);
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 25px;
}

#topbar * {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}

#title {
  margin-left: 50px;
}
</style>
