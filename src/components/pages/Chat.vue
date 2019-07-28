<template>
  
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AuthService from '../../services/auth-service';
import Message from '../../models/Message';

@Component
export default class Chat extends Vue {
  _authService = new AuthService();

  messages: Array<Message> = [];

  prepareMessage() {

  }
}
</script>

<style scoped lang="scss">

</style>