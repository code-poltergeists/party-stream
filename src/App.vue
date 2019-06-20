<template>
  <div id="app">
    <Layout :class="{blur: $store.state.dialog.isVisible}" />
    <Dialog v-if="$store.state.dialog.isVisible" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Layout from './components/structure/Layout.vue';
import Dialog from './components/items/Dialog.vue';

@Component({
  components: {
    Layout,
    Dialog,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #1A2328;
}

.blur {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
</style>
