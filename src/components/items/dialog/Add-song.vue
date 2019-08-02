<template>
  <div id="dialog-content">
    <TextField id="name-textfield" placeholder="Youtube link" toEmitOnChange="update-link" @update-link="updateLink" ref="textField"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextField from '../TextField.vue';

@Component({
  components: {
    TextField
  }
})
export default class AddSong extends Vue {
  public link: string;

  updateLink(value: string) {
    this.link = value;
    console.log(this.link);
  }
}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
