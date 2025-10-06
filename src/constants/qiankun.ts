/** 子应用 */
export enum MicroApp {
  /** 可观测 */
  OBSERVABLE = "OBSERVABLE",
  /** 证书中心 */
  CERT = "CERT",
  /** 防火墙 */
  WAF = "WAF",
}

/** 子应用配置map */
export const getMicroAppConfigs = (env: Record<string, any>) => [
  {
    name: MicroApp.OBSERVABLE,
    entry: env?.VITE_AVAILABILITY_URL,
    activeRule: "/observable",
  },
  {
    name: MicroApp.CERT,
    entry: env?.VITE_CERT_URL,
    activeRule: "/cert",
  },
  {
    name: MicroApp.WAF,
    entry: env?.VITE_WAF_URL,
    activeRule: "/waf",
    // 启用样式隔离
    sandbox: {
      strictStyleIsolation: true, // 样式严格隔离
      experimentalStyleIsolation: true, // 实验性 shadow DOM
    },
  },
];
