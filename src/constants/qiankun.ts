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
  /** 域名防护 */
  DOMAIN = "DOMAIN",
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
  {
    name: MicroApp.DOMAIN,
    entry: env?.VITE_DOMAIN_URL,
    activeRule: (location: Location) => {
      // 只匹配 /app/domain-shield 或 /app/domain 开头的路径
      // 注意：不再匹配 /domain-shield，避免与子应用真实路径冲突
      const pathname = location.pathname;
      // 明确排除 /domain-shield 路径，避免刷新页面时直接路由到子应用
      if (pathname.startsWith("/domain-shield")) {
        return false;
      }
      // 只匹配 /app/domain-shield 或 /app/domain 开头的路径
      return pathname.startsWith("/app/domain-shield") || pathname.startsWith("/app/domain");
    },
    // 启用样式隔离
    sandbox: {
      strictStyleIsolation: true, // 样式严格隔离
      experimentalStyleIsolation: true, // 实验性 shadow DOM
    },
  },
];
