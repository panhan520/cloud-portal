/** 子应用 */
export enum MicroApp {
  /** 可观测 */
  OBSERVABLE = "OBSERVABLE",
  /** 证书中心 */
  CERT = "CERT",
  /** 防火墙 */
  WAF = "WAF",
  // 控制台
  CONSOLE = "CONSOLE",
}

/** 子应用配置map */
export const getMicroAppConfigs = (env: Record<string, any>) => [
  {
    name: MicroApp.CERT,
    entry: env?.VITE_CERT_URL,
    activeRule: "/app/cert",
  },
  {
    name: MicroApp.WAF,
    entry: env?.VITE_WAF_URL,
    activeRule: "/app/waf",
    // 启用样式隔离
    sandbox: {
      strictStyleIsolation: true, // 样式严格隔离
      experimentalStyleIsolation: true, // 实验性 shadow DOM
    },
  },
  {
    name: MicroApp.CONSOLE,
    entry: env?.VITE_CONSOLE_URL,
    activeRule: "/app/console",
    // 启用样式隔离
    sandbox: {
      strictStyleIsolation: true, // 样式严格隔离
      experimentalStyleIsolation: true, // 实验性 shadow DOM
    },
  },
];
