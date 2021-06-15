<template>
  <header class="py-1 px-sm-5 px-2">
    <span class="userInfo d-flex align-items-center">
      <span class="img-wrapper">
        <img :src="imgUrl" alt="user" class="userImg" />
      </span>
      <span class="userContent mx-3">
        <span class="name">{{ userName }}</span> <br />
        <span class="bio text-secondary">{{ bio }}</span>
      </span>
    </span>
    <span class="menu">
      <i class="ml-4 fas fa-sign-out-alt" @click="logout"></i>
    </span>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
  emits: ["fetch-messages", "logout"],
  computed: {
    userName() {
      return this.$store.getters.username;
    },
    bio() {
      return this.$store.getters.bio;
    },
    imgUrl() {
      return "https://chat-restapi.herokuapp.com/" + this.$store.getters.imgUrl;
    },
  },
  methods: {
    fetchMessages() {
      this.$emit("fetch-messages");
    },
    logout() {
      this.$emit("logout");
      this.$router.push("/auth");
    },
  },
};
</script>

<style scoped>
header {
  width: 100%;
  height: 10vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 1000000;
}
.userInfo {
  height: 100%;
}
.img-wrapper {
  width: 9vh;
  height: 9vh;
  padding: 1px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.userImg {
  width: 200%;
  height: 120%;
}
.name {
  font-weight: 500;
}
i {
  color: #808080;
  font-size: 1.8rem;
  cursor: pointer;
}
</style>
