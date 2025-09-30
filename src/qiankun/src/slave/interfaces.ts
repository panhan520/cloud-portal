import type { App, Ref } from 'vue'
import type { OnGlobalStateChangeCallback } from 'qiankun'

/** 子应用生命周期 */
export interface ILifeCycle {
  /** 路由每次进入子应用都会触发 */
  mount?: (p: any) => void | Promise<void>
  /** 仅在首次加载时执行一次 */
  bootstrap?: () => void | Promise<void>
  /** 基座下发的props变化时触发 */
  update?: () => void | Promise<void>
  /** 路由每次离开子应用触发 */
  unmount?: () => void | Promise<void>
}

/** 全局数据的操作集 */
export interface IActions {
  onGlobalStateChange: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void,
  setGlobalState: (state: Record<string, any>) => boolean,
}

/** 出参 */
export interface IUseSlaveRes {
  /** 初始化子应用 */
  render: (generatorApp: () => App<Element>, lifeCycle?: ILifeCycle) => void
  /** 全局数据 */
  globalState: Ref<any>
  /** 全局数据操作集 */
  actions: Ref<IActions>
}
