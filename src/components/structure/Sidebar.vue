<template>
  <div id="sidebar">
    <div id="menu-items">
      <MenuItem
        v-for="item in menuItems"
        :key="item.text"
        :icon="item.icon"
        :text="$t(item.text)"
        :route="item.text"
        :index="item.index"
        :active="$store.state.currentMenuItem == item.index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MenuItem from "../items/Menu-item.vue";

@Component({
  components: {
    MenuItem
  }
})
export default class Sidebar extends Vue {
  private menuItems = [
    {
      index: 0,
      icon: "fas fa-chart-line",
      text: "dashboard"
    },
    {
      index: 1,
      icon: "fab fa-chromecast",
      text: "rooms"
    },
    {
      index: 2,
      icon: "fas fa-envelope",
      text: "inbox"
    },
    {
      index: 3,
      icon: "fas fa-user-friends",
      text: "friends"
    },
    {
      index: 5,
      icon: "fas fa-cog",
      text: "settings"
    }
  ];
}
</script>

<style scoped lang="scss">
#menu-items {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 5px solid rgb(90, 97, 100);
  border-bottom-right-radius: 10px;
}

#sidebar {
  height: 90vh;
  width: 100%;
  background-color: #29333c;
}

#menu-items div:last-child {
  margin-top: auto;
}
</style>
