<template>
  <div id="dialog-content">
    <ChooseFriends />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextField from '../TextField.vue';
import ChooseFriends from '../Choose-friends.vue';

@Component({
  components: {
    TextField,
    ChooseFriends,
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
