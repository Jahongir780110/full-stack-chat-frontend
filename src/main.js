import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import TheAuth from "./pages/TheAuth";
import TheChat from "./pages/TheChat";
import NotFound from "./components/NotFound";

import store from "./store/index.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/chat", name: "TheMain" },
    { path: "/auth", component: TheAuth, name: "TheAuth" },
    {
      path: "/chat",
      component: TheChat,
      name: "TheChat",
    },
    { path: "/:notFound(.*)", component: NotFound, name: "NotFound" },
  ],
});

router.beforeEach((to, from, next) => {
  if (!store.getters.isAuth) {
    store.dispatch("tryLogin");
  }
  if (!store.getters.isAuth && to.name !== "TheAuth") {
    console.log(store.getters.isAuth);
    next({ name: "TheAuth" });
  } else {
    if (to.name === "TheAuth" && store.getters.isAuth) {
      next({ name: "TheChat" });
    } else {
      next();
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
