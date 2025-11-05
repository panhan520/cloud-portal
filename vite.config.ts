import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsxPlugin(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        "@": path.join(__dirname, ".", "src"),
      },
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" 也可设置成你的ip地址
      host: "0.0.0.0",
      port: Number(env?.VITE_PORT),
      open: true,
      cors: true,
      // proxy: generateMicroAppProxy(getMicroAppConfigs(loadEnv(mode, process.cwd()))),
      proxy: {
        // 证书
        "/apis": {
          target: "https://www.dev.wafscloud.com",
          changeOrigin: true,
        },
        // 控制台
        "/api/v1/iam": {
          target: "https://gateway.observe.dev.eks.gainetics.io",
          changeOrigin: true,
        },
        // 账户相关
        "/user-proxy": {
          target: "https://gateway.observe.dev.eks.gainetics.io",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/user-proxy/, ""),
        },
      },
    },
  };
});
