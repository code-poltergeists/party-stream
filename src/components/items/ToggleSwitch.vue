<template>
  <label class="switch">
    <input type="checkbox">
    <span class="slider round"></span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ToggleSwitch extends Vue {}
</script>

<style scoped lang="scss">
label {
  margin: 0;
  padding: 0;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 50px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E3E3E3;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 50px;
  width: 50px;
  left: 0;
  bottom: 0;
  background-color: #247BD5;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider:before {
  -webkit-transform: translateX(50px);
  -ms-transform: translateX(50px);
  transform: translateX(50px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
