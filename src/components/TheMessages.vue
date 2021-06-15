<template>
  <div
    class="messages px-3 pb-2"
    :class="{ isReplying: isReplying, isEditing: isEditing }"
    ref="messages"
  >
    <div
      v-for="message in messages"
      :key="message._id"
      class="messageWrapper"
      :class="{ myMessage: message.author._id === $store.getters.userId }"
    >
      <span class="message">
        <div v-if="message.repliedMessage" class="replyBar d-flex">
          <span class="stick bg-info"></span>
          <span class="replySide ml-3">
            <span class="repliedName text-info">{{
              message.repliedMessage.author.name
            }}</span>
            <br />
            <span class="repliedContent">{{
              message.repliedMessage.content
            }}</span>
          </span>
        </div>

        <div class="dropdown">
          <span
            class="menu-icon-wrapper dropdown-toggle"
            data-toggle="dropdown"
          >
            <span class="menu-icon"></span>
          </span>
          <div class="dropdown-menu p-0">
            <p
              @click="replyMessage(message)"
              class="dropdown-item py-2 my-0 px-2"
            >
              <i class="fas fa-share mr-2"></i>Reply
            </p>
            <p
              v-if="message.author._id === $store.getters.userId"
              @click="editMessage(message)"
              class="dropdown-item py-2 my-0 px-2"
            >
              <i class="fas fa-edit mr-2"></i>Edit
            </p>
            <p
              @click="copyMessage(message)"
              class="dropdown-item py-2 my-0 px-2"
            >
              <i class="fas fa-copy mr-2"></i>Copy
            </p>
            <p
              v-if="message.author._id === $store.getters.userId"
              @click="deleteMessage(message._id)"
              class="dropdown-item py-2 my-0 px-2"
            >
              <i class="fas fa-trash mr-2"></i>Delete
            </p>
          </div>
        </div>
        <span class="author" :style="{ color: message.color }">{{
          message.author.name
        }}</span>
        <br />
        <span class="text">{{ message.content }}</span>
        <p class="p-0 m-0 text-right">
          <span v-if="message.edited" class="mr-2 time">edited</span>
          <span
            class="time text-right"
            :title="showFullTime(message.updatedAt)"
            >{{ showTime(message.updatedAt) }}</span
          >
        </p>
      </span>
    </div>
    <the-spinner :isLoading="isLoading"></the-spinner>
  </div>
</template>

<script>
import TheSpinner from "../components/TheSpinner.vue";
import moment from "moment";
import axios from "axios";
export default {
  name: "TheMessages",
  components: { TheSpinner },
  props: ["messages", "isLoading", "isReplying", "isEditing"],
  emits: [
    "set-reply",
    "set-reply-content",
    "set-focus",
    "set-edit",
    "set-edit-content",
  ],
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.messages.scroll(0, 1000000);
      }, 100);
    },
  },
  methods: {
    showTime(time) {
      return moment(time).format("HH:mm");
    },
    showFullTime(time) {
      return moment(time).format("YYYY:MM:DD");
    },
    copyMessage(message) {
      navigator.clipboard.writeText(message.content);
    },
    replyMessage(message) {
      this.$emit("set-reply", true);
      this.$emit("set-reply-content", message);
      this.$emit("set-focus");
    },
    editMessage(message) {
      this.$emit("set-edit", true);
      this.$emit("set-edit-content", message);
      this.$emit("set-focus");
    },
    deleteMessage(id) {
      axios
        .delete(this.$store.getters.server + "chat/message?messageId=" + id, {
          headers: {
            Authorization: "Bearer " + this.$store.getters.token,
          },
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.messages {
  width: 100%;
  height: 80vh;
  background-color: #78c5e3;
  overflow-y: auto;
  position: absolute;
  bottom: 10vh;
  top: 10vh;
}
.message {
  display: inline-block;
  margin-top: 12px;
  margin-bottom: 0;
  background-color: #eeeeee;
  border-radius: 6px;
  padding: 6px;
  padding-right: 20px;
  padding-bottom: 2px;
  position: relative;
  width: auto;
  min-width: 200px;
  max-width: 90%;
}
.message::after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom-color: #eeeeee;
  bottom: 0;
  left: 0;
  transform: translateX(-50%);
}
.myMessage {
  text-align: right;
}
.myMessage .message {
  text-align: left;
  background-color: white;
}
.myMessage .message::after {
  border-bottom-color: white;
  bottom: 0;
  left: 100%;
}
.menu-icon-wrapper {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: -18px;
  width: 25px;
  height: 25px;
}
.menu-icon {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  top: 12px;
  right: 8px;
  background-color: #6c757d;
}
.menu-icon::after {
  position: absolute;
  content: "";
  top: -5px;
  right: 0;
  background-color: inherit;
  width: 3px;
  height: 3px;
  border-radius: 50%;
}
.menu-icon::before {
  position: absolute;
  content: "";
  top: 5px;
  right: 0;
  background-color: inherit;
  width: 3px;
  height: 3px;
  border-radius: 50%;
}
.author {
  font-weight: 500;
}
.text {
  word-break: break-word;
}
.time {
  display: inline-block;
  font-size: 0.8rem;
  transform: translateX(10px);
  color: #6c757d;
}
.dropdown-toggle::after {
  content: none;
}
.dropdown-item {
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #ccc;
}
.isReplying {
  padding-bottom: 90px !important;
}
.isEditing {
  padding-bottom: 90px !important;
}
.stick {
  display: inline-block;
  width: 2px;
  height: 50px;
  margin-left: 10px;
  background-color: red;
}
.repliedName {
  font-size: 0.9rem;
  font-weight: 700;
}
</style>
