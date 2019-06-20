<template>
  <div class="button" @click="openDialog(type)">
    <i :class="[icon, 'icon']"></i>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop({ default: '' }) private icon!: string;
  @Prop({ default: '' }) private text!: string;
  @Prop({ default: '' }) private type!: string;
}
</script>

<style scoped lang="scss">
.button {
  margin-top: 15px;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  width: 200px;
  background-color: #267dd7;
  color: white;
  cursor: pointer;
}

.icon {
  font-size: 30px;
}

.text {
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
}
</style>
