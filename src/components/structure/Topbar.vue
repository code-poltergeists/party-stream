<template>
  <div id="topbar">
    <i class="fa fa-bars" id="menu" @click="toggleMenu"></i>
    <div id="title">{{ $t(this.$route.name) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Topbar extends Vue {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.$emit('onMenuToggle', this.isMenuOpen);
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
  box-sizing: border-box;
  padding-left: 20px;
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
  font-size: 4vh;
  margin-right: 4vh;
  cursor: pointer;
  @include desktop {
    display: none;
  }
}

#title {
  pointer-events: none;
  font-size: 4vh;
  @include mobile {
    margin-left: -25px;
    flex: 1;
    text-align: center;
  }
}
</style>
