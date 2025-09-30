import type { RouteRecordRaw } from 'vue-router'

/** 任意对象 */
export interface ICommonObj {
  [k: string]: any
}

/** 路由配置表（兼容qiankun） */
export type IRouteRecordRaw = 
  Omit<RouteRecordRaw, 'children'>
  & {
    /** 子应用标识 */
    microApp?: string
    children?: IRouteRecordRaw[]
  }
