<template>
  <div id="dialog-content">
    <ChooseFriends />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChooseFriends from '../Choose-friends.vue';

@Component({
  components: {
    ChooseFriends
  },
})
export default class InviteFriends extends Vue {}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
