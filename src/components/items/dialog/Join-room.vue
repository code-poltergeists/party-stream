<template>
  <div id="dialog-content">
    <TextField
      :placeholder="placeholder"
      id="name-textfield"
      toEmitOnChange="update-code"
      @update-code="updateCode"
    />
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
export default class JoinRoom extends Vue {
  private placeholder: string = "enter-invite-code";

  updateCode(value: string) {
    this.$store.commit("roomCodeUpdate", value);
  }
}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#privacy {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-item {
  color: #e3e3e3;
  margin: 0 20px;
  font-size: 50px;
}

#name-textfield {
  margin-top: 60px;
}
</style>
