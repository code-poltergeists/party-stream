<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Layout from './components/Layout.vue';

@Component({
  components: {
    Layout,
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
</style>
