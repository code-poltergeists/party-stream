<template>
  <div id="layout" class="container-fluid">
    <div class="row no-gutters">
      <div class="col-2">
        <Logo />
        <Sidebar/>
      </div>
      <div class="col-10">
        <Topbar />
        <div id="view">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';
import Logo from './Logo.vue';

@Component({
  components: {
    Sidebar,
    Topbar,
    Logo,
  },
})
export default class Layout extends Vue {}
</script>

<style scoped lang="scss">
#layout {
  margin: 0;
  padding: 0;
  height: 100%;
}

#view {
  height: 90vh;
}
</style>
