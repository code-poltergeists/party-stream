<template>
  <div id="dialog-content">
    <div id="privacy">
      <i class="fas fa-globe-europe privacy-item"></i>
      <ToggleSwitch id="privacy-switch" @onToggle="changePrivacy"/>
      <i class="fas fa-lock privacy-item"></i>
    </div>
    <TextField :placeholder="placeholder" id="name-textfield"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextField from '../TextField.vue';
import ToggleSwitch from '../ToggleSwitch.vue';

@Component({
  components: {
    TextField,
    ToggleSwitch,
  },
})
export default class JoinRoom extends Vue {
  private placeholder: string = 'enter-room-name';

  private changePrivacy(value: number) {
    // let title: string = '';
    switch (value) {
      case 0:
        // title = 'join-public-room';
        this.placeholder = 'enter-room-name';
        break;
      case 1:
        // title = 'join-private-room';
        this.placeholder = 'enter-room-id';
        break;
      default:
        break;
    }
    // const steps = this.$store.state.dialog.info.steps;
    // steps[0].namexș = title;
    // this.$store.commit('setupDialog', {
    //   title: title,
    //   steps: steps
    // });
  }
}
</script>

<style scoped lang="scss">
#dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#privacy {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-item {
  color: #E3E3E3;
  margin: 0 20px;
  font-size: 50px;
}

#name-textfield {
  margin-top: 60px;
}

</style>
