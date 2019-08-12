<template>
  <div class="button">
    <i :class="[icon, 'icon']"></i>
    <div class="text">{{ $t(text) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: "" }) private text!: string;
}
</script>

<style scoped lang="scss">
.button {
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  width: 100%;
  background-color: #36a86d;
  color: #e3e3e3;
  cursor: pointer;
  box-sizing: border-box;
}

.icon {
  font-size: 30px;
}

.text {
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
}
</style>
