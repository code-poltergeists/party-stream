<template>
  <div class="message">
    <div class="message-text">
      {{message.text}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "@/models/Message";

@Component
export default class MessageBubble extends Vue {
  @Prop() message: Message;

  mounted() {
    
  }

}
</script>

<style scoped lang="scss">
.message {
  background-color: green;
  width: 300px;
  padding: 10px;
  margin: 20px 0;
  box-sizing: border-box;
  border-radius: 25px;
}

.message-text {
  width: 100%;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 25px;
  word-break: break-all;
}
</style>
