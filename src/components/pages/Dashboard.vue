<template>
  <div id="dashboard">
    <div id="note">
      <svg viewBox="0 0 472.615 472.615">
        <defs>
          <radialGradient id="gradient">
            <stop offset="0%" stop-color="white" />
            <stop offset="100%" stop-color="#45b885" />
          </radialGradient>
        </defs>
        <path
          d="
            M 155.885 72.971
            v 280.104
            c -3.279 -2.917 -6.908 -5.599 -10.947 -7.959
            c -20.403 -11.941 -47.482 -14.669 -74.091 -7.521
			      C 24.022 350.101 -6.442 389.687 2.96 425.791
            c 3.856 14.669 13.634 26.89 28.115 35.448
            c 12.974 7.522 28.489 11.376 45.037 11.376
			      c 9.497 0 19.275 -1.315 29.054 -3.948
            c 40.825 -10.929, 69.089 -42.375 69.451 -74.137
            h 0.074
            V 178.644
            l 277.861 -64.268
            v 170.04
			      c -3.277 -2.909 -6.91 -5.583 -10.964 -7.936
            c -20.403 -11.941 -47.389 -14.574 -74.091 -7.522
            c -46.824 12.504 -77.195 52.088 -67.793 88.195
			      c 3.856 14.762 13.539 26.986 28.02 35.447
            c 12.975 7.522 28.583 11.377 45.037 11.377
            c 9.497 0 19.276 -1.315 29.054 -3.948
			      c 41.323 -11.038 69.858 -43.09 69.541 -75.283
            V 0
            L 155.885 72.971
            z
          "
          fill="url(#gradient)"
        />
      </svg>
    </div>
    <div id="col-text">
      <div id="text">{{ $t('welcome') }}</div>
    </div>
    <div id="buttons">
      <div>
        <Button
          icon="fas fa-plus-circle"
          text="create-room"
          class="dashboard-button"
          @click.native="openDialog('create-room')"
        ></Button>
      </div>
      <div>
        <Button
          icon="fas fa-sign-in-alt"
          text="join-room"
          class="dashboard-button"
          @click.native="openDialog('join-room')"
        ></Button>
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
}

#col-text {
  text-align: center;
  margin: 50px 0;
}

#text {
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  font-weight: 600;
  margin-top: 30px;
}

#buttons {
  display: flex;
  flex-direction: column;
  margin: 0 30px;
  align-items: center;
  justify-content: center;
}

.dashboard-button {
  width: 200px;
  margin-top: 15px;
}

#note {
  height: 200px;
  width: auto;
  margin-top: 50px;

  & > svg {
    width: 100%;
    height: 100%;
  }
}
</style>