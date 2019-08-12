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
        <div id="dialog-content-container">
          <component
            :is="$store.state.dialog.info.component"
            v-bind="$store.state.dialog.info.additionalProps"
          ></component>
        </div>
        <div class="dialog-button">
          <Button
            :icon="$store.state.dialog.info.button.icon"
            :text="$store.state.dialog.info.button.text"
            @click.native="onClick"
          />
        </div>
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
import EditField from "./Edit-field.vue";
import Reauthenticate from "./Reauthenticate.vue";

@Component({
  components: {
    AddSong,
    Button,
    CreateRoom1,
    CreateRoom2,
    ChooseFriends,
    InviteFriends,
    JoinRoom,
    EditField,
    Reauthenticate
  }
})
export default class Dialog extends Vue {
  private currentIndex: number = 0;

  private hideDialog() {
    this.$store.commit("toggleDialogVisibility", false);
  }

  private async onClick() {
    try {
      await this.$store.state.dialog.info.steps[this.currentIndex + 1].action();
    } catch (e) {
      return;
    }
    this.currentIndex += 1;
  }

  private async dialogStepClicked(index: number) {
    if (!this.$store.state.dialog.info.isStepChangeAllowed) {
      return;
    }
    try {
      await this.$store.state.dialog.info.steps[index].action();
    } catch (e) {
      return;
    }
    this.currentIndex = index;
  }
}
</script>

<style scoped lang="scss">
@mixin desktop {
  @media only screen and (min-width: 601px) {
    @content;
  }
}

@mixin mobile {
  @media only screen and (max-width: 600px) {
    @content;
  }
}

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

#dialog-element {
  width: 75vw;
  height: 75vh;
  background-color: #1a2328;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

#dialog-title-container {
  width: 100%;
  height: 10vh;
  background-color: rgb(15, 22, 26);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#dialog-title {
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-size: 3.5vh;
  font-weight: 600;
  text-align: center;
}

#dialog-steps-container {
  width: 100%;
  @include desktop {
    height: 10vh;
  }
  background-color: #344046;
  display: flex;
  align-items: center;
  color: #e3e3e3;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
  @include mobile {
    flex-direction: column;
  }
}

.dialog-step-container {
  display: flex;
  align-items: center;
  @include desktop {
    height: 10vh;
  }
  @include mobile {
    height: 7.5vh;
  }
  width: 100%;
  border-color: transparent transparent transparent #344046;
  cursor: pointer;
}

.dialog-step {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  @include desktop {
    padding-left: 20px;
  }
  z-index: 200;
}

.single-step {
  justify-content: center;
}

.arrow-overlap {
  @include desktop {
    margin-left: -3.75vh;
    width: calc(100% + 3.75vh);
    padding-left: calc(20px + 3.75vh);
  }
}

.arrow {
  @include desktop {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5vh 0 5vh 5vh;
    border-color: inherit;
    margin-left: auto;
    z-index: 210;
  }
}

.active {
  background-color: #36a86d;
}

.arrow-active {
  @include desktop {
    border-color: transparent transparent transparent #247bd5;
  }
}

.step-number {
  flex: 0 0 6vh;
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
  font-size: calc(1.5vh + 1vw);
}

.dialog-button {
  @include desktop {
    width: 30vw;
    align-self: flex-end;
  }
  @include mobile {
    width: 100%;
  }
}

#dialog-content-container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}
</style>
