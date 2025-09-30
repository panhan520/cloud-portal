import { h } from 'vue'
import Layout from '~/layout'
import { MicroApp } from '~/constants/qiankun'

import type { RouteRecordRaw } from 'vue-router'
import type { IRouteRecordRaw } from '~/qiankun/src/interfaces'

export const notFoundRouter: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  name: 'notFound',
  component: h('div', {}, 444),
  // redirect: '/404',
}
export const basicRoutes: IRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
  },
  {
    path: '/observable/:pathMatch(.*)*',
    component: Layout, // TODO: 测试用，后续改回microApp
    // microApp: MicroApp.OBSERVABLE,
  },
  {
    path: '/waf/:pathMatch(.*)*',
    microApp: MicroApp.WAF,
  },
  {
    path: '/cert/:pathMatch(.*)*',
    microApp: MicroApp.CERT,
  },
  notFoundRouter,
]
