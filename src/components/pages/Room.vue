<template>
  <div>
    <h1>Hi, and welcome to room {{ $route.params.id }}</h1>
    <Button icon="fas fa-plus" text="invite-friends" @click.native="inviteFriends" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ytPlayer from "../items/YtPlayer.vue";
import Button from "../items/Button.vue";
import RoomService from '../../services/room-service';

@Component({
  components: {
    ytPlayer,
    Button
  }
})
export default class Room extends Vue {
  private roomService = new RoomService();

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
          this.roomService.addPeopleToRoom(this.$route.params.id, this.$store.state.chooseFriends.users);
        }
      }
    ];
    stepsArray[0].action();
    this.$store.commit("toggleDialogVisibility", true);
  }
}
</script>

<style scoped lang="scss">
h1 {
  color: white;
}
</style>