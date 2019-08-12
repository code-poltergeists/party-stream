<template>
  <label class="switch">
    <input type="checkbox" @change="toggle" />
    <span class="slider round"></span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ToggleSwitch extends Vue {
  private mode: number = 0;

  private toggle() {
    this.mode = this.mode === 0 ? 1 : 0;
    this.$emit("onToggle", this.mode);
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
label {
  margin: 0;
  padding: 0;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
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
  background-color: #e3e3e3;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 5vh;
  width: 5vh;
  left: 0;
  bottom: 0;
  background-color: #45b885;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider:before {
  @include desktop {
    -webkit-transform: translateX(calc(10vw - 5vh));
    -ms-transform: translateX(calc(10vw - 5vh));
    transform: translateX(calc(10vw - 5vh));
  }
  @include mobile {
    -webkit-transform: translateX(calc(25vw - 5vh));
    -ms-transform: translateX(calc(25vw - 5vh));
    transform: translateX(calc(25vw - 5vh));
  }
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
