<template>
  <div class="textfield">
      <input class="input" :placeholder="$t(placeholder)" type="text" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Prop({ default: '' }) private placeholder!: string;
}
</script>

<style scoped lang="scss">
.input {
    outline: 0;
    border-width: 0 0 2px;
    border-color: #247BD5;
    background-color: transparent;
    font-family: 'Montserrat', sans-serif;
    color: #909090;
    font-weight: 600;
    font-size: 20px;
}
</style>
