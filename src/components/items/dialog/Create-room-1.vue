<template>
  <div id="dialog-content">
    <TextField id="name-textfield" placeholder="name" toEmit="update-name" @update-name="updateName" ref="textField"/>
    <div id="privacy">
      <i class="fas fa-globe-europe privacy-item"></i>
      <ToggleSwitch id="privacy-switch" onToggle="update-privacy" @update-privacy="updatePrivacy" />
      <i class="fas fa-lock privacy-item"></i>
    </div>
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
export default class CreateRoom1 extends Vue {
  public roomName: string = '';

  public updateName(value: string) {
    this.$store.commit("roomNameUpdate", value)
  }

  public updatePrivacy(value: number) {
    this.$store.commit("roomPrivacyUpdate", 1);
  }
}
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
</style>
