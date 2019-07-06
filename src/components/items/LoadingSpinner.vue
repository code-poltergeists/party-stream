<template>
  <div id="spinner">
    <div id="bars">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="text">
      {{ $t('loading') }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoadingSpinner extends Vue {}
</script>

<style scoped lang="scss">
$color: #45B885;

#spinner {
  display: flex;
}

#bars {
  height: 30px;
  width: 40px;
  display: flex;
  align-items: flex-end;
}

.bar {
  background: $color;
  height: 3px;
  width: 3px;
  animation: sound 0ms -800ms linear infinite alternate;
}

@keyframes sound {
  0% {
    opacity: .35;
    height: 3px;
  }
  100% {
    opacity: 1;
    height: 28px;
  }
}

.bar:nth-child(1) {
  animation-duration: 474ms;
}
.bar:nth-child(2) {
  animation-duration: 433ms;
}
.bar:nth-child(3) {
  animation-duration: 407ms;
}
.bar:nth-child(4) {
  animation-duration: 458ms;
}
.bar:nth-child(5) {
  animation-duration: 400ms;
}
.bar:nth-child(6) {
  animation-duration: 427ms;
}
.bar:nth-child(7) {
  animation-duration: 441ms;
}
.bar:nth-child(8) {
  animation-duration: 419ms;
}
.bar:nth-child(9) {
  animation-duration: 487ms;
}
.bar:nth-child(10) {
  animation-duration: 442ms;
}
</style>
