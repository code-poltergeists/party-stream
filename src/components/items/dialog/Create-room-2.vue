<template>
  <div id="dialog-content">
    <TextField id="name-textfield" placeholder="name"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextField from '../TextField.vue';

@Component({
  components: {
    TextField,
  },
})
export default class CreateRoom2 extends Vue {}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name-textfield {
  margin-top: 60px;
}
</style>
