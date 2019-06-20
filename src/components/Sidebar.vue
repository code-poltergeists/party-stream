<template>
  <div id="sidebar">
    <div id="menu-items">
      <MenuItem icon="fas fa-chart-line" :text="$t('dashboard')" :active="true"></MenuItem>
      <MenuItem icon="fab fa-chromecast" :text="$t('rooms')" :active="false"></MenuItem>
      <MenuItem icon="fas fa-envelope" :text="$t('inbox')" :active="false"></MenuItem>
      <MenuItem icon="fas fa-user-friends" :text="$t('friends')" :key="false"></MenuItem>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MenuItem from './Menu-item.vue';

@Component({
  components: {
    MenuItem,
  },
})
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
#menu-items {
  padding-top: 50px;
}

#sidebar {
  height: 90vh;
  width: 100%;
  background-color: #29333c;
  border-right: 5px solid rgb(90, 97, 100);
  border-bottom-right-radius: 10px;
}
</style>
