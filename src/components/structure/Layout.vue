<template>
  <div id="layout">
    <div id="col-sidebar">
      <Logo/>
      <Sidebar/>
    </div>
    <div id="col-view">
      <Topbar/>
      <div id="view">
        <router-view></router-view>
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
  width: 100vw;
  display: flex;
}

#col-sidebar {
  height: 100vh;
  flex: 0 0 300px;
}

#col-view {
  flex: 1;
}

#view {
  height: 90vh;
  padding: 10px;
}
</style>
