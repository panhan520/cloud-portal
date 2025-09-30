import type { Component, Ref, App } from 'vue'
import type { Router, RouterOptions, RouterHistory } from 'vue-router'
import type { RegistrableApp, MicroAppStateActions } from 'qiankun'
import type { IRouteRecordRaw } from '../interfaces'
import type { ICommonObj } from '../interfaces'

/** 子应用注册表 */
export type IRegistrableApp<T extends ICommonObj> = 
  Omit<RegistrableApp<T>, 'container'>
    & {
      /** 子应用容器 */
      container?: string | HTMLElement
    }

/** 路由配置 */
export interface IRouterConfig {
  /** 基础路由 */
  basicRoutes: IRouteRecordRaw[]
  /** 创建路由实例 */
  createRouter: (options: RouterOptions) => Router
  /** 创建history模式路由 */
  createWebHistory: (base?: string) => RouterHistory
}

/** 子应用配置 */
export type IMicroAppConfig = IRegistrableApp<ICommonObj>

/** IStartParams入参 */
export interface IStartParams {
  /** 子应用配置表 */
  microAppConfigs: IMicroAppConfig[]
  /** 全局初始化数据 */
  initialGlobalState?: Record<string, any>
  /** 路由配置 */
  routerConfig: IRouterConfig
  /** 创建app */
  initApp: (registerRouter: (p: App) => Promise<void>) => Promise<void>
}

/** 子应用占位路由 */
export interface IRoutes {
  /** 地址 */
  path: string
  /** 组件 */
  component: Component
}

/** useMaster出参 */
export interface IUseMasterRes {
  /** 注册子应用 */
  start: (p: IStartParams) => void
  /** 全局数据的操作集 */
  actions: Ref<MicroAppStateActions>
  /** 全局数据 */
  globalState: Ref<any>
  /** 子应用占位路由 */
  microAppRoutes: Ref<IRoutes[]>
}
