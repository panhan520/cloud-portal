import qiankun from 'vite-plugin-qiankun'

/** 子应用插件 */
export const qiankunPlugin = (MICRO_APP_NAME: string) => qiankun(
  MICRO_APP_NAME,
  {
    useDevMode: true,
  },
)
