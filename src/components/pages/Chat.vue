<template>
  <div id="chat">
    <div id="conversation">
      <MessageBubble
        v-for="(message, index) in messages"
        :key="message.id"
        :message="message"
        :class="chatService.isSentByCurrentUser(message) ? 'align-right' : 'align-left'"
        :last="chatService.isLastMessage(messages, index)"
      />
    </div>
    <div id="type">
      <div id="attach" @click="startUpload">
        <i class="fas fa-paperclip"></i>
      </div>
      <input
        type="file"
        style="display: none"
        ref="photoInput"
        @change="uploadPhoto"
        accept="image/*"
      />
      <textarea
        id="textarea"
        @input="autosize"
        ref="textarea"
        :placeholder="$t('type-a-message')"
        v-model="text"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="sendMessage"
      ></textarea>
      <div id="send" @click="sendMessage">
        <i class="far fa-paper-plane"></i>
      </div>
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

  startUpload() {
    (this.$refs.photoInput as any).click();
  }

  uploadPhoto() {
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoString = reader.result as string;
      this.chatService.uploadPhoto(this.$route.params.chatId, photoString);
    };
    const file = (this.$refs.photoInput as any).files[0];
    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.log("oh no no photo");
    }
  }

  mounted() {
    this.chatService.listenForMessages(this.$route.params.chatId, changes => {
      changes.forEach(change => {
        if (change.type === "added") {
          const map = change.doc.data();
          map.id = change.doc.id;
          this.messages.unshift(Message.fromMap(map));
        }
      });
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.$route.params.chatId, this.text);
    this.text = "";
    (this.$refs.textarea as any).style.height = "25px";
  }

  private autosize() {
    const element = this.$refs.textarea as any;
    element.style.height = "25px";
    element.style.height = element.scrollHeight + "px";
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
  margin-bottom: 10px;
}

#type {
  min-height: 25px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

#attach {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  margin: 0 25px;
  cursor: pointer;

  & > i {
    color: white;
    font-size: 30px;
  }
}

#textarea {
  resize: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  @include desktop {
    font-size: 2vw;
  }
  @include mobile {
    font-size: 5vw;
    // padding for iPhones without a home button:
    padding-bottom: env(safe-area-inset-bottom);
  }
  overflow: hidden;
  min-height: 30px;
  height: 30px;
  flex: 1;
  background-color: transparent;
  border: none;
  color: white;

  &:focus {
    outline: 0;
  }
}

#send {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  margin: 0 25px;
  cursor: pointer;

  & > i {
    color: #36a86d;
    font-size: 30px;
  }
}

.align-right {
  align-self: flex-end;
}

.align-left {
  align-self: flex-start;
}
</style>
