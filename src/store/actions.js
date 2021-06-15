import axios from "axios";

let timer;

export default {
  signup(context, payload) {
    context.commit("setUserData", {
      token: null,
      tokenExpiration: null,
      userId: null,
      username: "",
      userColor: "",
      bio: "",
      imgUrl: "",
    });
    const username = payload.username;
    const email = payload.email;
    const password = payload.password;
    const bio = payload.bio;
    const file = payload.file;
    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);
    formData.append("file", file);
    return axios
      .put("https://chat-restapi.herokuapp.com/auth/signup", formData)
      .then((response) => {
        const expiresIn = +response.data.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("color", response.data.color);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("bio", response.data.bio);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("tokenExpiration", expirationDate);

        timer = setTimeout(function() {
          context.dispatch("logout");
        }, expiresIn);

        context.commit("setUserData", {
          token: response.data.token,
          tokenExpiration: response.data.expiresIn,
          userId: response.data.userId,
          username: response.data.name,
          userColor: response.data.color,
          bio: response.data.bio,
          imgUrl: response.data.imgUrl,
        });
        context.commit("setServerError", {
          serverError: "",
        });
      })
      .catch((error) => {
        if (error.response) {
          context.commit("setServerError", {
            serverError: error.response.data.message || "",
          });
        }
      });
  },

  signin(context, payload) {
    context.commit("setUserData", {
      token: null,
      tokenExpiration: null,
      userId: null,
      username: "",
      userColor: "",
      bio: "",
      imgUrl: "",
    });
    const email = payload.email;
    const password = payload.password;
    return axios
      .post("https://chat-restapi.herokuapp.com/auth/signin", {
        email: email,
        password: password,
      })
      .then((response) => {
        const expiresIn = +response.data.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("color", response.data.color);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("bio", response.data.bio);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("tokenExpiration", expirationDate);

        timer = setTimeout(function() {
          context.dispatch("logout");
        }, expiresIn);

        context.commit("setUserData", {
          token: response.data.token,
          tokenExpiration: response.data.expiresIn,
          userId: response.data.userId,
          username: response.data.name,
          userColor: response.data.color,
          bio: response.data.bio,
          imgUrl: response.data.imgUrl,
        });
        context.commit("setServerError", {
          serverError: "",
        });
      })
      .catch((error) => {
        if (error.response) {
          context.commit("setServerError", {
            serverError: error.response.data.message || "",
          });
        }
      });
  },

  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("color");
    localStorage.removeItem("name");
    localStorage.removeItem("bio");
    localStorage.removeItem("imgUrl");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUserData", {
      token: null,
      tokenExpiration: null,
      userId: null,
      username: "",
      userColor: "",
      bio: "",
      imgUrl: "",
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const color = localStorage.getItem("color");
    const name = localStorage.getItem("name");
    const bio = localStorage.getItem("bio");
    const imgUrl = localStorage.getItem("imgUrl");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch("logout");
    }, expiresIn);

    if (token && userId && name && color && bio && imgUrl) {
      context.commit("setUserData", {
        token: token,
        tokenExpiration: tokenExpiration,
        userId: userId,
        username: name,
        userColor: color,
        bio: bio,
        imgUrl: imgUrl,
      });
    }
  },

  clearServerError(context) {
    context.commit("setServerError", {
      serverError: "",
    });
  },
};
