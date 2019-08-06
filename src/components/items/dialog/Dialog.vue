<template>
  <div id="dialog">
    <div id="overlay"></div>
    <div id="dialog-container" @click.self="hideDialog()">
      <div id="dialog-element">
        <div id="dialog-title-container">
          <div id="dialog-title">{{ $t($store.state.dialog.info.title) }}</div>
        </div>
        <div id="dialog-steps-container">
          <div
            :class="{'dialog-step-container': true, 'arrow-active': currentIndex == index}"
            v-for="(step, index) in $store.state.dialog.info.steps.filter(e => e.name !== null)"
            :key="step.name"
            @click="dialogStepClicked(index)"
          >
            <div
              :class="{'dialog-step': true, 'active': currentIndex == index, 'arrow-overlap': index != 0, 'single-step': $store.state.dialog.info.steps.length == 2}"
            >
              <div
                class="step-number"
                v-if="$store.state.dialog.info.steps.length > 1"
              >{{index + 1}}</div>
              <div class="step-title">{{$t(step.name)}}</div>
            </div>
            <div class="arrow" v-if="index != $store.state.dialog.info.steps.length - 2"></div>
          </div>
        </div>
        <Button
          class="dialog-button"
          :icon="$store.state.dialog.info.button.icon"
          :text="$store.state.dialog.info.button.text"
          @click.native="onClick"
        />
        <component :is="$store.state.dialog.info.component"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AddSong from "./Add-song.vue";
import Button from "../Button.vue";
import CreateRoom1 from "./Create-room-1.vue";
import CreateRoom2 from "./Create-room-2.vue";
import InviteFriends from "./Invite-friends.vue";
import ChooseFriends from "../Choose-friends.vue";
import JoinRoom from "./Join-room.vue";

@Component({
  components: {
    AddSong,
    Button,
    CreateRoom1,
    CreateRoom2,
    ChooseFriends,
    InviteFriends,
    JoinRoom
  }
})
export default class Dialog extends Vue {
  private currentIndex: number = 0;

  private hideDialog() {
    this.$store.commit("toggleDialogVisibility", false);
  }

  private onClick() {
    this.$store.state.dialog.info.steps[this.currentIndex + 1].action();
    this.currentIndex += 1;
  }

  private dialogStepClicked(index: number) {
    this.$store.state.dialog.info.steps[index].action();
    this.currentIndex = index;
  }
}
</script>

<style scoped lang="scss">
#overlay {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.75;
  z-index: 10000;
}

#dialog-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

#dialog * {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}

#dialog-element {
  width: 50vw;
  height: 50vh;
  background-color: #1a2328;
  border-radius: 20px;
  position: relative;
}

#dialog-title-container {
  width: 100%;
  height: 10vh;
  background-color: rgb(15, 22, 26);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#dialog-title {
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  font-weight: 600;
  margin-left: 30px;
}

#dialog-steps-container {
  width: 100%;
  height: 7.5vh;
  background-color: #344046;
  display: flex;
  align-items: center;
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.dialog-step-container {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-color: transparent transparent transparent #344046;
  cursor: pointer;
}

.dialog-step {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 20px;
  z-index: 200;
}

.single-step {
  justify-content: center;
}

.arrow-overlap {
  margin-left: -3.75vh;
  width: calc(100% + 3.75vh);
  padding-left: calc(20px + 3.75vh);
}

.arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 3.75vh 0 3.75vh 3.75vh;
  border-color: inherit;
  margin-left: auto;
  z-index: 210;
}

.active {
  background-color: #247bd5;
}

.arrow-active {
  border-color: transparent transparent transparent #247bd5;
}

.step-number {
  width: 6vh;
  height: 6vh;
  border-radius: 50%;
  border: 2px solid #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  font-size: 30px;
}

.step-title {
  font-size: 20px;
}

.dialog-button {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
