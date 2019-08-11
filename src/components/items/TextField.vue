<template>
  <div class="textfield">
    <input
      class="input"
      :type="secure ? 'password' : 'text'"
      :placeholder="$t(placeholder)"
      v-model="text"
      @keyup.enter="onEnterPressed"
      @input="onChanged"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TextField extends Vue {
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private toEmit!: string;
  @Prop({ default: "" }) private toEmitOnChange!: string;
  @Prop({ default: false }) private secure!: boolean;

  private text: string = "";
  private onEnterPressed() {
    if (this.toEmit !== "") {
      this.$emit(this.toEmit, this.text);
      this.text = "";
    }
  }

  private onChanged() {
    if (this.toEmitOnChange !== "") {
      this.$emit(this.toEmitOnChange, this.text);
    }
  }
}
</script>

<style scoped lang="scss">
.textfield {
  width: 100%;
}

.input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: #247bd5;
  background-color: transparent;
  font-family: "Montserrat", sans-serif;
  color: #909090;
  font-weight: 600;
  font-size: 20px;
  width: 100%;
}
</style>
