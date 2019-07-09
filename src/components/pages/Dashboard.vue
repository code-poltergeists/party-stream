<template>
  <div id="dashboard" class="container-fluid">
    <div class="row no-gutters">
      <div class="col" id="col-text">
        <i class="fas fa-sad-tear" id="sad"></i>
        <div id="text">{{ $t('no-items') }}</div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-6 right">
        <Button
          icon="fas fa-plus-circle"
          text="create-room"
          @click.native="openDialog('create-room')"
        ></Button>
      </div>
      <div class="col-6 left">
        <Button icon="fas fa-sign-in-alt" text="join-room" @click.native="openDialog('join-room')"></Button>
      </div>
      <div class="col-12 center">
        <Button
          icon="fas fa-user-friends"
          text="add-friends"
          @click.native="openDialog('invite-friends')"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../items/Button.vue";
import RoomService from "@/services/room-service";

@Component({
  components: {
    Button
  }
})
export default class Dashboard extends Vue {
  mounted() {
    new RoomService().isPlayingListener(
      "fXO5vernUJa2qZg3Qlc6",
      (isPlaying: boolean) => {
        console.log(isPlaying);
      }
    );
  }

  private openDialog(type: string) {
    let stepsArray: { name: string; action: Function }[] = [];
    let buttonIcon: string = "";
    let buttonText: string = "";
    let title: string = "";
    let component: string = "";
    switch (type) {
      case "create-room":
        stepsArray = [
          {
            name: "name-and-privacy",
            action: () => {
              this.$store.commit("setupDialog", {
                title: "name-and-privacy",
                button: { icon: "fas fa-arrow-right", text: "continue" },
                component: "CreateRoom1",
                steps: stepsArray
              });
            }
          },
          {
            name: "invite-friends",
            action: () => {
              this.$store.commit("setupDialog", {
                title: "invite-friends",
                button: { icon: "fas fa-plus-circle", text: "create-room"},
                component: "CreateRoom2",
                steps: stepsArray
              });
              //new RoomService().createRoom(this.$store.state.room.name, this.$store.state.room.privacy)
              console.log(this.$store.state.room)
            }
          }
        ];
        break;
      case "join-room":
        stepsArray = [
          {
            name: "join-room",
            action: () => {
              this.$store.commit("setupDialog", {
                title: "join-room",
                button: { icon: "fa fa-check", text: "join" },
                component: "JoinRoom",
                steps: stepsArray
              });
            }
          }
        ];
        break;
      case "invite-friends":
        stepsArray = [
          {
            name: "invite-friends",
            action: () => {
              this.$store.commit("setupDialog", {
                title: "invite-friends",
                button: { icon: "fa fa-plus", text: "add" },
                component: "InviteFriends",
                steps: stepsArray
              });
            }
          }
        ];
        break;
      default:
        break;
    }
    stepsArray[0].action();
    this.$store.commit("toggleDialogVisibility", true);
  }
}
</script>

<style scoped lang="scss">
#dashboard {
  background-color: #1a2328;
  color: white;
  width: 100%;
  height: 100%;
}

#col-text {
  text-align: center;
  margin-top: 50px;
}

#sad {
  color: white;
  font-size: 150px;
}

#text {
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  font-weight: 600;
  margin-top: 30px;
}

.center {
  display: flex;
  justify-content: center;
}

.right {
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
}

.left {
  display: flex;
  justify-content: flex-start;
  padding-left: 30px;
}
</style>
