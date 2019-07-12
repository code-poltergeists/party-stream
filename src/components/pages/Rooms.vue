<template>
  <div id="rooms">
    <DashboardRoom v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "./Button.vue";
import Room from "@/models/Room";
import DashboardRoom from "../items/DashboardRoom.vue";
import RoomService from "@/services/room-service";

@Component({
  components: {
    DashboardRoom
  }
})
export default class Rooms extends Vue {
  roomService = new RoomService();

  rooms: Array<Room> = [];

  mounted() {
    this.roomService.getRoomsForCurrentUser().then(rooms => {
      this.rooms = rooms;
    });
  }
}
</script>

<style scoped lang="scss">
</style>
