<template>
  <div class="chat-wrapper">
    <the-header @fetch-messages="fetchMessages" @logout="logout"></the-header>
    <the-messages
      :isReplying="isReplying"
      :isEditing="isEditing"
      :messages="messages"
      :isLoading="isLoading"
      @set-reply="setReply"
      @set-edit="setEdit"
      @set-reply-content="setReplyContent"
      @set-edit-content="setEditContent"
      @set-focus="setFocus"
    ></the-messages>
    <input-message
      :isReplying="isReplying"
      :isEditing="isEditing"
      :repliedMessage="repliedMessage"
      :editedMessage="editedMessage"
      :isFocus="isFocus"
      @post-message="postMessage"
      @set-reply="setReply"
      @set-edit="setEdit"
    ></input-message>
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import TheMessages from "../components/TheMessages.vue";
import InputMessage from "../components/InputMessage.vue";
import axios from "axios";
import openSocket from "socket.io-client";
export default {
  name: "TheChat",
  components: { TheHeader, TheMessages, InputMessage },
  data() {
    return {
      messages: [],
      isLoading: false,
      isReplying: false,
      isEditing: false,
      repliedMessage: null,
      editedMessage: null,
      isFocus: false,
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuth;
    },
  },
  watch: {
    isAuth(value) {
      if (value === false) {
        this.$router.push("/auth");
      }
    },
  },
  mounted() {
    this.fetchMessages();
    const socket = openSocket(this.$store.getters.server, {
      auth: {
        userId: this.$store.getters.userId,
      },
    });
    socket.on("messages", (data) => {
      if (data.action === "create") {
        const updatedMessages = [...this.messages];
        updatedMessages.push(data.message);
        this.messages = updatedMessages;
      } else if (data.action === "delete") {
        this.messages = data.messages;
      } else if (data.action === "edit") {
        this.messages = data.messages;
      }
    });
  },
  methods: {
    fetchMessages() {
      this.isLoading = true;
      axios
        .get(this.$store.getters.server + "chat/messages", {
          headers: {
            Authorization: "Bearer " + this.$store.getters.token,
          },
        })
        .then((result) => {
          this.messages = result.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    postMessage(message) {
      let repliedMessage = null;
      if (this.isReplying) {
        repliedMessage = this.repliedMessage._id;
        this.setReply(false);
      }
      if (this.isEditing) {
        axios
          .put(
            this.$store.getters.server + "chat/message",
            {
              messageId: this.editedMessage._id,
              content: message,
            },
            {
              headers: {
                Authorization: "Bearer " + this.$store.getters.token,
              },
            }
          )
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.log(err));
        this.setEdit(false);
      } else {
        axios
          .post(
            this.$store.getters.server + "chat/message",
            {
              author: this.$store.getters.userId,
              color: this.$store.getters.userColor,
              content: message,
              repliedMessage: repliedMessage,
            },
            {
              headers: {
                Authorization: "Bearer " + this.$store.getters.token,
              },
            }
          )
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.log(err));
      }
    },
    setReply(value) {
      this.isEditing = false;
      this.repliedMessage = null;
      this.editedMessage = null;
      this.isReplying = value;
    },
    setEdit(value) {
      this.isReplying = false;
      this.repliedMessage = null;
      this.editedMessage = null;
      this.isEditing = value;
    },
    setReplyContent(message) {
      this.repliedMessage = message;
    },
    setEditContent(message) {
      this.editedMessage = message;
    },
    setFocus() {
      this.isFocus = Math.random();
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.chat-wrapper {
  width: 100vw;
  height: 100vh;
}
</style>
