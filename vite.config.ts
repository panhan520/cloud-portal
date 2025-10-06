import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(async ({ mode }) => {
  return {
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
        "~": path.join(__dirname, ".", "src"),
      },
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" 也可设置成你的ip地址
      host: "0.0.0.0",
      port: Number(loadEnv(mode, process.cwd())?.VITE_PORT),
      open: true,
      cors: true,
      // proxy: generateMicroAppProxy(getMicroAppConfigs(loadEnv(mode, process.cwd()))),
      proxy: {
        // 代理 /mock 请求到子应用 (4000 端口)
        "/mock": {
          target: "http://localhost:4001",
          changeOrigin: true,
          // 如果子应用 mock 路径不需要 /mock 前缀，可以用 rewrite
          // rewrite: (path) => path.replace(/^\/mock/, '')
        },
      },
    },
  };
});
