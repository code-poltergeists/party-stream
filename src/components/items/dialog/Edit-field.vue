<template>
  <div id="dialog-content">
    <TextField
      id="textfield"
      :placeholder="type"
      :secure="type === 'password'"
      toEmitOnChange="update-field"
      @update-field="updateField"
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
export default class EditField extends Vue {
  public value: string;

  @Prop() type: string;

  updateField(value: string) {
    this.value = value;
    this.$store.commit("updateUserInfo", {
      [this.type]: value
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
</style>
