/**
 * @description: 基座两处主要配置
 *  1: 在需要的时机调用start注册子应用
 *  2: 在vite.config.ts中通过generateMicroAppProxy方法配置proxy代理，将子应用的请求转发至子应用，走子应用自身的proxy
 *  -
 *  注意：自身的port不要和子应用重复
 */
import { ref } from "vue";
import {
  initGlobalState as initGlobalStateQiankun,
  registerMicroApps as registerMicroAppsQiankun,
  start as startQiankun,
} from "qiankun";
import MicroApp from "./microApp";
import { MICRO_APP_CONTAINER_KEY, MICRO_APP_PATH_MATCH } from "./constants";

import type { App } from "vue";
import type {
  MicroAppStateActions,
  OnGlobalStateChangeCallback,
} from "qiankun";
import type { RouteRecordRaw } from "vue-router";
import type { IRouteRecordRaw } from "../interfaces";
import type {
  IStartParams,
  IUseMasterRes,
  IRoutes,
  IRouterConfig,
  IMicroAppConfig,
} from "./interfaces";

/** 单例存储 */
let masterConfigCache: IUseMasterRes | null = null;

export { default as MicroApp } from "./microApp";
/** 初始化基座 */
export const useMaster = (): IUseMasterRes => {
  if (masterConfigCache) {
    return masterConfigCache;
  }
  /** 全局数据 */
  const globalState = ref({});
  /** 全局数据的操作集 */
  const actions = ref<MicroAppStateActions>({
    onGlobalStateChange: (
      _callback: OnGlobalStateChangeCallback,
      _fireImmediately?: boolean
    ) => {},
    setGlobalState: (_state: Record<string, any>) => true,
    offGlobalStateChange: () => true,
  });
  /** 子应用路由配置表 */
  const microAppRoutes = ref<IRoutes[]>([]);
  /** 生成子应用占位路由 */
  const generateMicroAppRoutes = (routes: IRouteRecordRaw[] = []) => {
    routes.forEach((v) => {
      if (v.microApp) {
        // TODO: 加入路由是否匹配的校验
        v.component = MicroApp;
        v.path = `${v.path}${MICRO_APP_PATH_MATCH}`;
      }
      v.children && generateMicroAppRoutes(v.children);
    });
  };
  /** 向基座路由表注入子应用占位路由 */
  const injectMicroAppRoutes = (routerConfig: IRouterConfig) => {
    generateMicroAppRoutes(routerConfig.basicRoutes);
    return async (app: App) => {
      const router = routerConfig.createRouter({
        history: routerConfig.createWebHistory("/"), // 路由不使用 base，保持路径干净
        routes: routerConfig.basicRoutes as RouteRecordRaw[],
      });
      app.use(router);
    };
  };
  /** 初始化全局数据 */
  const initGlobalState = (
    initialGlobalState: Record<string, any> | undefined
  ) => {
    actions.value = initGlobalStateQiankun(initialGlobalState); // 1: 初始化全局数据
    actions.value?.onGlobalStateChange((state: any) => {
      globalState.value = state;
    }, true); // 2: 实时更新state
  };
  /** 注册子应用 */
  const registerMicroApps = (microAppConfigs: IMicroAppConfig[] = []) => {
    const result = generateMicroApps(microAppConfigs); // 1: 生成子应用配置表
    registerMicroAppsQiankun(result); // 2: 注册子应用
  };
  // 生成子应用配置表
  const generateMicroApps = (microAppConfigs: IMicroAppConfig[] = []) =>
    microAppConfigs.map((v) => ({
      ...v,
      container: `#${MICRO_APP_CONTAINER_KEY}`,
    }));
  /** 注册子应用 */
  const start = async ({
    microAppConfigs = [],
    initialGlobalState,
    routerConfig,
    initApp,
  }: IStartParams) => {
    initGlobalState(initialGlobalState); // 1: 初始化全局数据
    const registerRouter = injectMicroAppRoutes(routerConfig); // 2: 将MicroApp组件注入子应用路由
    await initApp(registerRouter); // 3: 初始化vue项目
    registerMicroApps(microAppConfigs); // 4: 注册子应用
    startQiankun(); // 5: 开启qiankun
  };

  masterConfigCache = {
    start,
    actions,
    globalState,
    microAppRoutes,
  };
  return masterConfigCache;
};
