<template>
  <div v-if="isPrivate === false">
    <div v-if="this.isReady">
      <Player
        :video-id="videoId"
        :room-id="roomId"
        :who-added="whoAdded"
        :key="videoId"
        :calculatedTime="time"
        @ended="videoEnded"
      />
    </div>
    <div id="invite">{{$t('invite-using')}}{{roomDetails.inviteCode}}</div>
    <div class="buttons">
      <Button icon="fas fa-plus" text="add-song" @click.native="addSong" class="customButton" />
    </div>
    <div id="chat-container">
      <Chat />
    </div>
  </div>
  <div v-else-if="isPrivate === true">
    <div class="error-message">{{$t('no-access')}}</div>
  </div>
  <div v-else-if="isPrivate === undefined">
    <div class="error-message">{{$t('room-does-not-exist')}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "../items/Player.vue";
import Button from "../items/Button.vue";
import RoomModel from "@/models/Room";
import RoomService from "../../services/room-service";
import AuthService from "../../services/auth-service";
import Chat from "./Chat.vue";
import router from "@/router";

@Component({
  components: {
    Player,
    Button,
    Chat
  }
})
export default class Room extends Vue {
  private roomService = new RoomService();
  private authService = new AuthService();
  private username = "";
  private videoId = "";
  private roomId = "";
  private time = 0;
  private isReady = false;
  private whoAdded: String = "";
  private videoDuration = 0;
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
    new Date(),
    0,
    [],
    0
  );

  async videoEnded() {
    this.roomService.videoEnded(this.roomId, this.roomDetails.videos[0].id);
    this.roomDetails.videos.shift();
    if (
      this.roomDetails.videos === undefined ||
      this.roomDetails.videos.length == 0
    ) {
      console.log("hey we're all deleted");
      this.videoId = "false";
    } else {
      this.videoId = this.roomDetails.videos[0].link.slice(-11);
      this.whoAdded = this.roomDetails.videos[0].whoAdded;
    }
    this.roomDetails = await this.roomService.getRoomInfo(
      this.$route.params.id
    );
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
    if (this.$route.params.id.length === 6) {
      try {
        const idFromInviteCode = await this.roomService.getRoomForCode(
          this.$route.params.id
        );
        router.push({ name: "room", params: { id: idFromInviteCode } });
      } catch {
        this.isPrivate = undefined;
      }
    }
    try {
      this.isPrivate = await this.roomService.isPrivate(this.$route.params.id);
    } catch {
      this.isPrivate = undefined;
    }
    this.roomDetails = await this.roomService.getRoomInfo(
      this.$route.params.id
    );
    this.roomId = this.$route.params.id;
    let currentTime = new Date();
    let seconds = currentTime.getTime() / 1000;
    this.time =
      seconds -
      (this.roomDetails.startTime as any).seconds +
      this.roomDetails.time;
    this.time = Math.trunc(this.time);
    if (
      this.roomDetails.videos === undefined ||
      this.roomDetails.videos.length == 0
    ) {
      this.videoId = "false";
      this.time = 0;
    } else {
      this.videoId = this.roomDetails.videos[0].link.slice(-11);
    }
    this.$store.commit("updateRoomName", this.roomDetails.roomName);
    this.isReady = true;
    await this.authService.currentUser().then(res => {
      this.username = res.username;
    });
    this.roomService.videosListener(this.roomId, (changes: any) => {
      changes.forEach(change => {
        if (change.type === "added") {
          const map = change.doc.data();
          map.id = change.doc.id;
          this.roomDetails.videos.push(map);
          this.videoId = this.roomDetails.videos[0].link.slice(-11);
          this.whoAdded = this.roomDetails.videos[0].whoAdded;
        }
      });
    });
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: white;
}

#invite {
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  font-weight: 600;
  margin: 20px 0;
  color: white;
  width: 100%;
  text-align: center;
}

.customButton {
  width: 100%;
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

#chat-container {
  width: 100%;
  height: 500px;
  overflow: scroll;
}

.error-message {
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 30px;
  color: white;
}
</style>