import { h } from "vue";
import Layout from "@/layout/index.vue";
import { MicroApp } from "@/constants/qiankun";

import type { RouteRecordRaw } from "vue-router";
import type { IRouteRecordRaw } from "@/qiankun/src/interfaces";

export const notFoundRouter: RouteRecordRaw = {
  path: "/:pathMatch(.*)",
  name: "notFound",
  component: h("div", {}, 444),
  // redirect: '/404',
};
export const basicRoutes: IRouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home", // 默认跳到首页
    component: Layout,
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/HomePage/index.vue"),
        meta: { title: "首页" },
      },
      {
        path: "/observable/:pathMatch(.*)*",
        component: Layout, // TODO: 测试用，后续改回microApp
        // microApp: MicroApp.OBSERVABLE,
      },
      {
        path: "waf/:any(.*)*",
        microApp: MicroApp.WAF,
      },
      {
        path: "cert/:any(.*)?",
        microApp: MicroApp.WAF,
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index.vue"),
    name: "Login",
    meta: {
      hidden: true,
      title: "登录",
      noTagsView: true,
    },
  },
  {
    path: "/findUsername",
    component: () => import("@/views/FindUsername/index.vue"),
    name: "FindUsername",
    meta: {
      hidden: true,
      title: "忘记账号",
      noTagsView: true,
    },
  },

  notFoundRouter,
];
