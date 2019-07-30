<template>
  <div id="chat">
    <div id="conversation">
      <MessageBubble v-for="message in messages" :key="message.id" :message="message" :class="isSentFromCurrentAccount(message) ? 'align-right' : ''"/>
    </div>
    <div id="type">
      <div id="attach"></div>
      <textarea id="textarea" @keyup="autosize" ref="textarea" :placeholder="$t('type-a-message')"></textarea>
      <div id="send"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "../../models/Message";
import MessageBubble from "../items/MessageBubble.vue";
import AuthService from '@/services/auth-service';

@Component({
  components: {
    MessageBubble
  }
})
export default class Chat extends Vue {
   _authService = new AuthService();
  messages: Array<Message> = [
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },
    {
      id: "",
      text: "njjnfnjnjfdnjfdnjdjnfdnjfddjdjdnjdndjdnjdnjdjnndnjdnjnjknjkdfnjnjnfdjnj",
      userId: "",
      date: new Date()
    },

  ];

  prepareMessage() {}

  autosize() {
    const element = this.$refs.textarea as any;
    element.style.height = "25px";
    element.style.height = element.scrollHeight + "px";
  }

  isSentFromCurrentAccount(message: any) {
    // TODO: change once we get messages from firestore
    return true;
    // return message.userId === this._authService.currentUserId;
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
  min-height: 25px;
  height: 25px;
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
