import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

/** qiankun环境 */
export const IS_QIANKUN = qiankunWindow.__POWERED_BY_QIANKUN__;
export const isDev = (import.meta as any).env?.MODE === "development";
/** qiankun子应用资源路径 */
export const PUBLIC_PATH = isDev
  ? IS_QIANKUN
    ? qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    : `http://localhost:${8081}`
  : "";
