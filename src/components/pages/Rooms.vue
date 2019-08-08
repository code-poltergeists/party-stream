<template>
  <div id="rooms">
    <div v-if="this.displayLoading" class="loading-container">
      <h1>Fetching rooms...</h1>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- Shit load of divs for animation :P -->
    </div>
    <div id="room-list">
      <DashboardRoom v-for="room in rooms" :key="room.id" :room="room" />
    </div>
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
  displayLoading = true;

  rooms: Array<Room> = [];

  mounted() {
    this.roomService.getRoomsForCurrentUser().then(rooms => {
      this.rooms = rooms;
      this.displayLoading = false;
    });
  }
}
</script>

<style scoped lang="scss">
.loading-container {
  text-align: center;
  color: white;
}
.lds-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
#room-list {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: row wrap;
  align-content: space-between;
  justify-content: space-between;
}
</style>
