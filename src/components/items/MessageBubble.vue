<template>
  <div :class="['message', getPosition(), last ? getPosition() + '-last' : '']">
    <div class="message-text" v-if="message.text">{{message.text}}</div>
    <div class="message-image" v-if="message.attachment">
      <img :src="message.attachment" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "@/models/Message";
import ChatService from "../../services/chat-service";

@Component
export default class MessageBubble extends Vue {
  @Prop() message: Message;
  @Prop() last: boolean;

  chatService = new ChatService();

  getPosition() {
    return this.chatService.isSentByCurrentUser(this.message)
      ? "green"
      : "white";
  }
}
</script>

<style scoped lang="scss">
@mixin desktop {
  @media only screen and (min-width: 601px) {
    @content;
  }
}

@mixin mobile {
  @media only screen and (max-width: 600px) {
    @content;
  }
}

.message {
  border-radius: 20px;
  padding: 8px 15px;
  margin-top: 2.5px;
  margin-bottom: 2.5px;
  display: inline-block;
  @include mobile {
    max-width: 50vw;
  }
  @include desktop {
    max-width: 30vw;
  }
  position: relative;
}

.message-text {
  width: 100%;
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  word-break: break-all;
}

.message-image {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    width: 100%;
  }
}

.green {
  background-color: #36a86d;
  margin-right: 10px;

  & > div {
    color: #e3e3e3;
  }
}

.green-last {
  &:before {
    content: "";
    position: absolute;
    z-index: 0;
    bottom: 0;
    right: -8px;
    height: 20px;
    width: 20px;
    background: #36a86d;
    background-attachment: fixed;
    border-bottom-left-radius: 15px;
  }

  &:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: -10px;
    width: 10px;
    height: 20px;
    background: #1a2328;
    border-bottom-left-radius: 10px;
  }
}

.white {
  background-color: #e3e3e3;
  margin-left: 10px;

  & > div {
    color: black;
  }
}

.white-last {
  &:before {
    content: "";
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: -7px;
    height: 20px;
    width: 20px;
    background: #e3e3e3;
    border-bottom-right-radius: 15px;
  }

  &:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: -10px;
    width: 10px;
    height: 20px;
    background: #1a2328;
    border-bottom-right-radius: 10px;
  }
}
</style>
