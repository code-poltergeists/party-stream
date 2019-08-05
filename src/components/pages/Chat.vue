<template>
  <div id="chat">
    <div id="conversation">
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :class="chatService.isSentByCurrentUser(message) ? 'align-right' : ''"
      />
    </div>
    <div id="type">
      <div id="attach"></div>
      <textarea
        id="textarea"
        @keyup="autosize"
        ref="textarea"
        :placeholder="$t('type-a-message')"
        v-model="text"
      ></textarea>
      <div id="send" @click="sendMessage"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "../../models/Message";
import MessageBubble from "../items/MessageBubble.vue";
import ChatService from "@/services/chat-service";

@Component({
  components: {
    MessageBubble
  }
})
export default class Chat extends Vue {
  chatService = new ChatService();

  messages: Array<Message> = [];

  text = "";

  created() {
    this.chatService.getMessages(this.$route.params.chatId).then(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.text, this.$route.params.chatId);
  }

  private autosize() {
    const element = this.$refs.textarea as any;
    element.style.height = "25px";
    element.style.height = element.scrollHeight + "px";
  }
}
</script>

<style scoped lang="scss">
#chat {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

#conversation {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

#type {
  min-height: 25px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

#attach {
  background-color: pink;
  height: 25px;
  width: 25px;
  margin: 0 25px;
}

#textarea {
  resize: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 25px;
  overflow: hidden;
  min-height: 30px;
  height: 30px;
  flex: 1;
  background-color: transparent;
  border: none;
  color: white;
}

#send {
  background-color: pink;
  height: 25px;
  width: 25px;
  margin: 0 25px;
}

.align-right {
  margin-left: auto;
}
</style>
