<template>
  <div id="layout" :class="{'open': isMenuOpen}">
    <div id="col-sidebar">
      <Logo />
      <Sidebar />
    </div>
    <div id="col-view">
      <Topbar @onMenuToggle="onMenuToggle" />
      <div id="view">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import Logo from "./Logo.vue";

@Component({
  components: {
    Sidebar,
    Topbar,
    Logo
  }
})
export default class Layout extends Vue {
  isMenuOpen = false;

  onMenuToggle(value: boolean) {
    this.isMenuOpen = value;
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

#layout {
  display: flex;
  transition: all .25s ease-in-out;
}

.open {
  transform: scale(0.75) translateX(50vw);
}

#col-sidebar {
  height: 100vh;
  flex: 0 0 300px;
  @include mobile {
    display: none;
  }
}

#col-view {
  flex: 1;
}

#view {
  height: 90vh;
}
</style>
