<template>
  <div
    class="inputWrapper d-flex justify-content-between align-items-center px-sm-5 px-2"
  >
    <div v-if="isReplying" class="replyBar container-fluid">
      <div class="row h-100">
        <div
          class="col px-sm-5 px-2 d-flex justify-content-between align-items-center"
        >
          <span class="reply-left d-flex align-items-center">
            <i class="fas fa-reply text-info"></i>
            <span class="ml-3">
              <span class="name text-info">{{
                repliedMessage.author.name
              }}</span>
              <br />
              <span class="content">{{ repliedMessage.content }}</span>
            </span>
          </span>
          <span @click="closeReply" class="reply-right close-icon"
            ><i class="fas fa-times"></i
          ></span>
        </div>
      </div>
    </div>

    <div v-if="isEditing" class="editBar container-fluid">
      <div class="row h-100">
        <div
          class="col px-sm-5 px-2 d-flex justify-content-between align-items-center"
        >
          <span class="edit-left d-flex align-items-center">
            <i class="fas fa-edit text-info"></i>
            <span class="ml-3">
              <span class="name text-info">{{
                editedMessage.author.name
              }}</span>
              <br />
              <span class="content">{{ editedMessage.content }}</span>
            </span>
          </span>
          <span @click="closeEdit" class="edit-right close-icon"
            ><i class="fas fa-times"></i
          ></span>
        </div>
      </div>
    </div>
    <div class="dropdown">
      <i class="far fa-laugh dropdown-toggle" data-toggle="dropdown"></i>
      <div class="dropdown-menu p-1 text-justify">
        <span
          v-for="emoji in emojis"
          :key="emoji"
          @click="addEmoji(emoji)"
          v-html="covertEmoji(emoji)"
          class="m-1 emoji"
        ></span>
      </div>
    </div>
    <input
      type="text"
      v-model="message"
      @keyup.enter="postMessage"
      class="form-control mx-3"
      placeholder="Type your message here..."
      ref="input"
    />

    <i class="fas fa-paper-plane" @click="postMessage"></i>
  </div>
</template>

<script>
import emojis from "../../functions/emojis";
export default {
  name: "InputMessage",
  data() {
    return {
      message: "",
      emojis: emojis,
    };
  },
  props: [
    "isReplying",
    "repliedMessage",
    "isFocus",
    "isEditing",
    "editedMessage",
  ],
  emits: ["post-message", "set-reply", "set-edit"],
  watch: {
    isFocus() {
      this.$refs.input.focus();
    },
    isEditing(value) {
      if (value === true) {
        this.message = this.editedMessage.content;
      } else {
        this.message = "";
      }
    },
  },
  methods: {
    postMessage() {
      this.$emit("post-message", this.message);
      this.message = "";
    },
    addEmoji(emoji) {
      let updatedMessage = this.message;
      updatedMessage += String.fromCodePoint(emoji);
      this.message = updatedMessage;
      this.$refs.input.focus();
    },
    covertEmoji(emoji) {
      let updatedEmoji = emoji.slice(1);
      updatedEmoji = "&#" + updatedEmoji + ";";
      return updatedEmoji;
    },
    closeReply() {
      this.$emit("set-reply", false);
    },
    closeEdit() {
      this.$emit("set-edit", false);
    },
  },
};
</script>

<style scoped>
.inputWrapper {
  width: 100%;
  height: 10vh;
  /* background-color: #eeeeee; */
  background-color: white;
  position: fixed;
  bottom: 0;
  z-index: 2000000;
}
i {
  font-size: 1.6rem;
  color: #808080;
  cursor: pointer;
}
input {
  box-shadow: none !important;
}
input:focus {
  border: 1px solid silver;
}
.dropdown-menu {
  width: 64px;
  height: 120px;
  overflow-y: auto;
  word-break: break-all;
}
.dropdown-toggle::after {
  content: none;
}
.emoji {
  cursor: pointer;
  font-size: 1.05rem;
}
.replyBar {
  background-color: white;
  position: absolute;
  bottom: 10vh;
  left: 0;
  height: 9vh;
}
.editBar {
  background-color: white;
  position: absolute;
  bottom: 10vh;
  left: 0;
  height: 9vh;
}
/* @media (max-width: 570px) {
  .replyBar {
    bottom: 0vh;
    height: 12vh;
  }
  .editBar {
    bottom: 0vh;
    height: 12vh;
  }
} */
.name {
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
