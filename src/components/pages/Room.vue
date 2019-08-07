<template>
  <div v-if="isPrivate === false">
    <h1>Hi, and welcome to room: {{ this.roomDetails.roomName }}</h1>
    <div v-if="this.isReady">
      <Player
        :video-id="videoId"
        :room-id="roomId"
        :who-added="username"
        :key="videoId"
        @ended="videoEnded"
      />
    </div>
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
import AuthService from "../../services/auth-service";

@Component({
  components: {
    Player,
    Button
  }
})
export default class Room extends Vue {
  private roomService = new RoomService();
  private authService = new AuthService();
  private username = "";
  private videoId = "";
  private roomId = "";
  private isReady = false;
  isPrivate: boolean | null | undefined = null;
  private roomDetails = new RoomModel(
    "",
    new Date(),
    0,
    false,
    false,
    [""],
    0,
    "0",
    0,
    [],
    0
  );

  videoEnded() {
    this.roomDetails.videos.shift();
    console.log(this.roomDetails);
    this.videoId = this.roomDetails.videos[0].link.slice(-11);
  }

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
          this.roomService.addVideo(
            this.$route.params.id,
            this.$store.state.video.link,
            this.username,
            new Date()
          );
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
    this.roomDetails = await this.roomService.getRoomInfo(
      this.$route.params.id
    );
    this.roomId = this.$route.params.id;
    if (
      this.roomDetails.videos === undefined ||
      this.roomDetails.videos.length == 0
    ) {
      this.videoId = "false";
    } else {
      this.videoId = this.roomDetails.videos[0].link.slice(-11);
    }
    this.isReady = true;
    await this.authService.currentUser().then(res => {
      this.username = res.username;
    });
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: white;
}

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
</style>