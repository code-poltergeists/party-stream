<template>
  <div id="dashboard">
    <i class="fas fa-sad-tear" id="sad"></i>
    <div id="text">{{ $t('no-items') }}</div>
    <div id="buttons">
      <div>
        <Button
          icon="fas fa-plus-circle"
          text="create-room"
          @click.native="openDialog('create-room')"
        ></Button>
      </div>
      <div>
        <Button icon="fas fa-sign-in-alt" text="join-room" @click.native="openDialog('join-room')"></Button>
      </div>
      <div>
        <Button
          icon="fas fa-user-friends"
          text="add-friends"
          @click.native="openDialog('invite-friends')"
        ></Button>
      </div>
    </div>
    <div id="no-items" v-if="hasElements === false" class="container-fluid">
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
          <Button
            icon="fas fa-sign-in-alt"
            text="join-room"
            @click.native="openDialog('join-room')"
          ></Button>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../items/Button.vue";
import RoomService from "@/services/room-service";
import router from "@/router";

@Component({
  components: {
    Button
  }
})
export default class Dashboard extends Vue {
  roomService = new RoomService();

  hasElements: boolean | null = false;

  private openDialog(type: string) {
    let stepsArray: { name: string | null; action: Function }[] = [];
    let buttonIcon: string = "";
    let buttonText: string = "";
    let title: string = "";
    let component: string = "";
    switch (type) {
      case "create-room":
        stepsArray = [
          {
            name: null,
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
            name: "name-and-privacy",
            action: () => {
              this.$store.commit("setupDialog", {
                title: "invite-friends",
                button: { icon: "fas fa-plus-circle", text: "create-room" },
                component: "CreateRoom2",
                steps: stepsArray
              });
            }
          },
          {
            name: "invite-friends",
            action: () => {
              this.$store.commit("toggleDialogVisibility", false);
              new RoomService()
                .createRoom(
                  this.$store.state.room.name,
                  this.$store.state.room.privacy
                )
                .then(doc => {
                  router.push({ name: "room", params: { id: doc.id } });
                });
            }
          }
        ];
        break;
      case "join-room":
        stepsArray = [
          {
            name: null,
            action: () => {
              this.$store.commit("setupDialog", {
                title: "join-room",
                button: { icon: "fa fa-check", text: "join" },
                component: "JoinRoom",
                steps: stepsArray
              });
            }
          },
          {
            name: "join-room",
            action: () => {
              this.roomService
                .joinRoom(this.$store.state.room.code)
                .then(() => {
                  this.$store.commit("toggleDialogVisibility", false);
                });
            }
          }
        ];
        break;
      case "invite-friends":
        stepsArray = [
          {
            name: null,
            action: () => {
              this.$store.commit("setupDialog", {
                title: "invite-friends",
                button: { icon: "fa fa-plus", text: "add" },
                component: "InviteFriends",
                steps: stepsArray
              });
            }
          },
          {
            name: "invite-friends",
            action: () => {
              this.$store.commit("toggleDialogVisibility", false);
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
  text-align: center;
}

#sad {
  color: white;
  font-size: 150px;
  margin-top: 50px;
}

#text {
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  font-weight: 600;
  margin-top: 30px;
}

#buttons {
  display: flex;
  margin: 0 30px;
  flex-flow: row wrap;
  align-content: space-around;
  justify-content: space-around;

  & > div {
    flex-basis: calc(50% - 20px);
    display: flex;

    &:nth-child(1) {
      justify-content: flex-end;
      margin: 0 10px;
    }
    &:nth-child(2) {
      justify-content: flex-start;
      margin: 0 10px;
    }
    &:nth-child(3) {
      justify-content: center;
    }
  }
}
</style>
