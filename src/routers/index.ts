import { h } from "vue";
import Layout from "~/layout/index.vue";
import { MicroApp } from "~/constants/qiankun";

import type { RouteRecordRaw } from "vue-router";
import type { IRouteRecordRaw } from "~/qiankun/src/interfaces";

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
        component: () => import("~/views/home/index.vue"),
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

  notFoundRouter,
];
