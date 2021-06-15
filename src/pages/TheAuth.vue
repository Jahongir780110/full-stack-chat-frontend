<template>
  <div class="container-wrapper" :class="{ 'sign-up-mode': isSignup }">
    <div class="forms-container">
      <div class="signin-signup">
        <form class="sign-in-form">
          <h2 class="title">Sign in</h2>
          <p v-if="serverError" class="text-danger">{{ serverError }}</p>
          <div v-if="emailError" class="text-danger">
            {{ emailError }}
          </div>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" placeholder="Email" v-model.trim="email" />
          </div>

          <div v-if="passwordError" class="text-danger">
            {{ passwordError }}
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              v-model.trim="password"
            />
          </div>
          <input
            type="submit"
            value="Login"
            class="btn solid"
            @click.prevent="submitForm('signin')"
          />
        </form>

        <form class="sign-up-form" enctype="multipart/form-data">
          <h2 class="title">Sign up</h2>
          <p v-if="serverError" class="text-danger">{{ serverError }}</p>
          <div v-if="nameError" class="text-danger">{{ nameError }}</div>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="Username" v-model="name" />
          </div>
          <div v-if="bioError" class="text-danger">{{ bioError }}</div>
          <div class="input-field">
            <i class="fas fa-leaf"></i>
            <input type="text" placeholder="Add BIO" v-model="bio" />
          </div>
          <div v-if="emailError" class="text-danger">{{ emailError }}</div>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" placeholder="Email" v-model.trim="email" />
          </div>
          <div v-if="passwordError" class="text-danger">
            {{ passwordError }}
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              v-model.trim="password"
            />
          </div>
          <div v-if="imageError" class="text-danger">
            {{ imageError }}
          </div>
          <label class="input-field userImgWrapper" for="file">
            <i class="fas fa-image"></i>
            <span class="filePath">{{ imagePath }}</span>
            <input
              type="file"
              @change="selectFile"
              class="userImg"
              id="file"
              ref="file"
              hidden
            />
          </label>
          <input
            type="submit"
            class="btn"
            value="Sign up"
            @click.prevent="submitForm('signup')"
          />
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h2>New here ?</h2>
          <p style="font-size: 18px">
            <!-- <big> -->
            Join our community so that you can chat with all members. Just click
            the button below.
            <!-- </big> -->
          </p>
          <button class="btn transparent" @click="switchToSignup">
            Sign up
          </button>
        </div>
        <img src="../assets/log.svg" class="image" />
      </div>

      <div class="panel right-panel">
        <div class="content">
          <h2>One of us ?</h2>
          <p style="font-size: 18px">
            <!-- <big> -->
            If you already registered in our app, you can continue with your
            previous account.
            <!-- </big> -->
          </p>
          <button class="btn transparent" @click="switchToSignin">
            Sign in
          </button>
        </div>
        <img src="../assets/register.svg" class="image" />
      </div>
    </div>
  </div>

  <the-loader :isLoading="isLoading"></the-loader>
</template>

<script>
import TheLoader from "../components/TheLoader.vue";
export default {
  name: "TheAuth",
  components: { TheLoader },
  data() {
    return {
      isSignup: false,
      name: "",
      bio: "",
      email: "",
      password: "",
      file: "",
      emailError: "",
      nameError: "",
      bioError: "",
      passwordError: "",
      imageError: "",
      imagePath: "Select image",
      isLoading: false,
    };
  },
  computed: {
    serverError() {
      return this.$store.getters.serverError;
    },
    isAuth() {
      return this.$store.getters.isAuth;
    },
  },
  methods: {
    switchToSignin() {
      this.isSignup = false;
      this.$store.dispatch("clearServerError");
    },
    switchToSignup() {
      this.isSignup = true;
      this.$store.dispatch("clearServerError");
    },
    selectFile() {
      this.file = this.$refs.file.files[0];
      this.imagePath = this.$refs.file.files[0].name;
    },
    submitForm(value) {
      this.emailError = "";
      this.bioError = "";
      this.nameError = "";
      this.passwordError = "";
      const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.isSignup && this.name.length < 2) {
        this.nameError = "Please enter at least 2 characters";
        return;
      }
      if (this.isSignup && this.name.length > 12) {
        this.nameError = "Pleaes enter maximum 12 characters";
        return;
      }
      if (this.isSignup && this.bio.length < 3) {
        this.bioError = "Please enter at least 3 characters";
        return;
      }
      if (this.isSignup && this.bio.length > 30) {
        this.nameError = "Pleaes enter maximum 30 characters";
        return;
      }
      if (!emailValidator.test(this.email)) {
        this.emailError = "Please enter a valid email";
        return;
      }
      if (this.password.length < 6) {
        this.passwordError =
          "Your password should contain at least 6 characters";
        return;
      }
      if (this.isSignup && this.file === "") {
        this.imageError = "Please add your photo";
        return;
      }
      this.isLoading = true;
      if (value === "signup") {
        this.$store
          .dispatch("signup", {
            email: this.email,
            password: this.password,
            username: this.name,
            bio: this.bio,
            file: this.file,
          })
          .then(() => {
            this.$router.push("/chat");
            this.isLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      } else if (value === "signin") {
        this.$store
          .dispatch("signin", {
            email: this.email,
            password: this.password,
          })
          .then(() => {
            this.$router.push("/chat");
            this.isLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
.container-wrapper {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container-wrapper:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

.container-wrapper.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container-wrapper.sign-up-mode .left-panel .image,
.container-wrapper.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container-wrapper.sign-up-mode .signin-signup {
  left: 25%;
}

.container-wrapper.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container-wrapper.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container-wrapper.sign-up-mode .right-panel .image,
.container-wrapper.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container-wrapper.sign-up-mode .left-panel {
  pointer-events: none;
}

.container-wrapper.sign-up-mode .right-panel {
  pointer-events: all;
}

.userImg {
  width: 100%;
  background-color: red;
}

.filePath {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
}

@media (max-width: 870px) {
  .container-wrapper {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 75%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container-wrapper.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container-wrapper:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container-wrapper.sign-up-mode:before {
    transform: translate(-50%, 95%);
    bottom: 32%;
    right: initial;
  }

  .container-wrapper.sign-up-mode .left-panel .image,
  .container-wrapper.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container-wrapper.sign-up-mode .right-panel .image,
  .container-wrapper.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container-wrapper.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container-wrapper {
    padding: 1.5rem;
  }

  .container-wrapper:before {
    bottom: 74%;
    left: 50%;
  }

  .container-wrapper.sign-up-mode:before {
    bottom: 20%;
    left: 50%;
  }
}
</style>
