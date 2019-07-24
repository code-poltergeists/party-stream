<template>
  <div id="topbar">
    <div id="menu">
      A
    </div>
    <div id="title">{{ $t(this.$route.name) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Topbar extends Vue {
  toggleMenu() {
    alert("AAA");
  }
}
</script>

<style scoped lang="scss">
@mixin desktop {
  @media only screen and (min-width: 601px) {
    @content;
  }
}

@mixin mobile {
  @media only screen and (max-width: 600px) {
    @content;
  }
}
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

#menu {
  margin-left: 20px;
  font-size: 4vh;
  // width: 4vh;
  width: 100px;
  background-color: red;
  cursor: pointer;
  @include desktop {
    display: none;
  }
}

#title {
  margin-left: 30px;
  font-size: 4vh;
  @include mobile {
    margin-left: -25px;
    flex: 1;
    text-align: center;
  }
}
</style>
