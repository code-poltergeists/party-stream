<template>
  <div v-if="isPrivate === false">
    <h1>Hi, and welcome to room: {{ this.roomDetails.roomName }}</h1>
    <!-- <Player :video-id="videoId" /> -->
    <Button icon="fas fa-plus" text="invite-friends" @click.native="inviteFriends" />
    <Button icon="fas fa-plus" text="add-song" @click.native="addSong" />
  </div>
  <div v-else-if="isPrivate === true">
    <h1>Sorry, private room</h1>
  </div>
  <div v-else-if="isPrivate === undefined">
    <h1>Room not found :(</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "../items/Player.vue";
import Button from "../items/Button.vue";
import RoomModel from "@/models/Room";
import RoomService from "../../services/room-service";
 
@Component({
  components: {
    Player,
    Button
  }
})
export default class Room extends Vue {
  private roomService = new RoomService();
  private videoId = "dQw4w9WgXcQ";

  isPrivate: boolean | null | undefined = null;
  private roomDetails = new RoomModel('', new Date(), 0, false, false, [''], 0, '0', 0, [], 0);

  inviteFriends() {
    const stepsArray = [
      {
        name: null,
        action: () => {
          this.$store.commit("setupDialog", {
            title: "invite-friends",
            button: { icon: "fa fa-plus", text: "add" },
            component: "InviteFriends",
            steps: stepsArray
          });
          this.$store.commit("updateChosenFriends", []);
        }
      },
      {
        name: "invite-friends",
        action: () => {
          this.$store.commit("toggleDialogVisibility", false);
          this.roomService.addPeopleToRoom(
            this.$route.params.id,
            this.$store.state.chooseFriends.users
          );
        }
      }
    ];
    stepsArray[0].action();
    this.$store.commit("toggleDialogVisibility", true);
  }

  addSong() {
    const stepsArray = [
      {
        name: null,
        action: () => {
          this.$store.commit("setupDialog", {
            title: "add-a-song",
            button: { icon: "fa fa-plus", text: "add" },
            component: "AddSong",
            steps: stepsArray
          });
        }
      },
      {
        name: "add-a-song",
        action: () => {
          this.$store.commit("toggleDialogVisibility", false);
          console.log("I got here");
        }
      }
    ];
    stepsArray[0].action();
    this.$store.commit("toggleDialogVisibility", true);
  }

  async mounted() {
    try {
      this.isPrivate = await this.roomService.isPrivate(this.$route.params.id);
    } catch {
      this.isPrivate = undefined;
    }
    this.roomDetails = await this.roomService.getRoomInfo(this.$route.params.id);
    this.videoId = this.roomDetails.videos[0].link.slice(-11);
    console.log(this.videoId)
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: white;
}
</style>