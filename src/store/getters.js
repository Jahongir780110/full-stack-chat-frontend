export default {
  token(state) {
    return state.token;
  },
  tokenExpiration(state) {
    return state.tokenExpiration;
  },
  userId(state) {
    return state.userId;
  },
  isAuth(state) {
    return state.token ? true : false;
  },
  username(state) {
    return state.username;
  },
  bio(state) {
    return state.bio;
  },
  imgUrl(state) {
    return state.imgUrl;
  },
  userColor(state) {
    return state.userColor;
  },
  serverError(state) {
    return state.serverError;
  },
  server(state) {
    return state.server;
  },
};
