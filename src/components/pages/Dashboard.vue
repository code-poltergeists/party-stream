<template>
  <div id="dashboard" class="container-fluid">
    <div class="row no-gutters">
      <div class="col" id="col-text">
        <i class="fas fa-sad-tear" id="sad"></i>
        <div id="text">{{ $t('no-items') }}</div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-6 right">
        <Button icon="fas fa-plus-circle" text="create-room" @click.native="openDialog('create-room')"></Button>
      </div>
      <div class="col-6 left">
        <Button icon="fas fa-sign-in-alt" text="join-room"></Button>
      </div>
      <div class="col-12 center">
        <Button icon="fas fa-user-friends" text="add-friends"></Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from '../items/Button.vue';

@Component({
  components: {
    Button,
  },
})
export default class Dashboard extends Vue {
  private openDialog(type: string) {
    let stepsArray: string[] = [];
    let buttonIcon: string = '';
    let buttonText: string = '';
    switch (type) {
      case 'create-room':
        stepsArray = ['name-and-privacy', 'invite-friends'];
        buttonIcon = 'fas fa-plus-circle';
        buttonText = 'create-room';
        break;
      default:
        break;
    }
    this.$store.commit('setupDialog', {
      title: this.$t(type),
      steps: stepsArray,
      button: { icon: buttonIcon, text: buttonText },
      component: 'CreateRoom1',
    });
    this.$store.commit('toggleDialogVisibility', true);
  }
}
</script>

<style scoped lang="scss">
#dashboard {
  background-color: #1a2328;
  color: white;
  width: 100%;
  height: 100%;
}

#col-text {
  text-align: center;
  margin-top: 50px;
}

#sad {
  color: white;
  font-size: 150px;
}

#text {
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  font-weight: 600;
  margin-top: 30px;
}

.center {
  display: flex; 
  justify-content: center;
}

.right {
  display: flex; 
  justify-content: flex-end;
  padding-right: 30px;
}

.left {
  display: flex; 
  justify-content: flex-start;
  padding-left: 30px;
}
</style>
