export default {
  setUserData(state, payload) {
    state.token = payload.token;
    state.tokenExpiration = payload.tokenExpiration;
    state.userId = payload.userId;
    state.username = payload.username;
    state.bio = payload.bio;
    state.imgUrl = payload.imgUrl;
    state.userColor = payload.userColor;
  },
  setServerError(state, payload) {
    state.serverError = payload.serverError;
  },
};
