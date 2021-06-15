import { createStore } from "vuex";

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const store = createStore({
  state() {
    return {
      token: null,
      tokenExpiration: null,
      userId: null,
      username: "",
      bio: "",
      imgUrl: "",
      userColor: "",
      serverError: "",
      server: "https://chat-restapi.herokuapp.com/",
    };
  },
  mutations,
  getters,
  actions,
});

export default store;
