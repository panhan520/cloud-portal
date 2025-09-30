import type { IMicroAppConfig } from './interfaces'

/** 根据子应用配置表生成针对子应用的proxy代理 */
export const generateMicroAppProxy = (microAppConfigs: IMicroAppConfig[] = []) => Object.fromEntries(
  microAppConfigs.map(v => ([
    [`/${v.name}`],
    {
      target: v.entry,
      changeOrigin: true,
    },
  ]))
)