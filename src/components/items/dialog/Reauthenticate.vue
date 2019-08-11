<template>
  <div id="dialog-content">
    <div id="why-reauthenticate">{{$t('why-reauthenticate')}}</div>
    <TextField
      id="email-textfield"
      placeholder="email"
      toEmitOnChange="update-field"
      @update-field="updateEmailField"
      ref="textField"
    />
    <TextField
      :secure="true"
      id="password-textfield"
      placeholder="password"
      toEmitOnChange="update-field"
      @update-field="updatePasswordField"
      ref="textField"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextField from "../TextField.vue";

@Component({
  components: {
    TextField
  }
})
export default class Reauthenticate extends Vue {
  @Prop() type: string;
  @Prop() provider: string;

  updateEmailField(value: string) {
    this.$store.commit("reauthenticate", {
      email: value
    });
  }

  updatePasswordField(value: string) {
    this.$store.commit("reauthenticate", {
      password: value
    });
  }
}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#why-reauthenticate {
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 20px;
  margin: 10px 0;
  color: white;
  text-align: center;
}
</style>
