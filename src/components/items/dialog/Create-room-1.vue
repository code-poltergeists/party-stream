<template>
  <div id="dialog-content">
    <TextField
      id="name-textfield"
      placeholder="name"
      toEmitOnChange="update-name"
      @update-name="updateName"
      ref="textField"
    />
    <div id="privacy">
      <i class="fas fa-globe-europe privacy-item"></i>
      <div class="switch-container">
        <ToggleSwitch
          id="privacy-switch"
          onToggle="update-privacy"
          @update-privacy="updatePrivacy"
        />
      </div>
      <i class="fas fa-lock privacy-item"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextField from "../TextField.vue";
import ToggleSwitch from "../ToggleSwitch.vue";

@Component({
  components: {
    TextField,
    ToggleSwitch
  }
})
export default class CreateRoom1 extends Vue {
  public roomName: string = "";

  public updateName(value: string) {
    this.$store.commit("roomNameUpdate", value);
  }

  public updatePrivacy(value: number) {
    this.$store.commit("roomPrivacyUpdate", 1);
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
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

#name-textfield {
  width: 100%;
}

#privacy {
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-item {
  color: #e3e3e3;
  margin: 0 20px;
  font-size: calc(2.5vh + 2.5vw);
}

.switch-container {
  @include desktop {
    width: 10vw;
  }
  @include mobile {
    width: 25vw;
  }
  height: 5vh;
}
</style>
