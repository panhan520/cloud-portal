import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useMaster } from "./qiankun/src/master";
import { getMicroAppConfigs } from "./constants/qiankun";
import { basicRoutes } from "./router";
import App from "./App";
// 引入全局样式
import "@/styles/index.less";
import "@fortawesome/fontawesome-free/css/all.css";

import type { App as IApp } from "vue";

const initApp = async (registerRouter: (p: IApp) => Promise<void>) => {
  const app = createApp(App);
  const pinia = createPinia();
  // 使用持久化插件
  pinia.use(piniaPluginPersistedstate);
  await registerRouter(app);
  app.use(pinia);
  app.mount("#app");
};
const { start } = useMaster();
start({
  microAppConfigs: getMicroAppConfigs(import.meta.env),
  initApp,
  routerConfig: {
    basicRoutes,
    createRouter,
    createWebHistory,
  },
});
