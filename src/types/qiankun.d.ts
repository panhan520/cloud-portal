// 类型声明文件，用于解决 vite-plugin-qiankun 的类型问题

declare module "vite-plugin-qiankun" {
  import { Plugin } from "vite";
  export default function qiankun(name: string, options?: any): Plugin;
}

declare module "vite-plugin-qiankun/dist/helper" {
  export const qiankunWindow: Window & {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  };

  export interface RenderWithQiankunProps {
    mount: (props: any) => void;
    bootstrap?: () => void;
    update?: () => void;
    unmount?: () => void;
  }

  export function renderWithQiankun(config: RenderWithQiankunProps): void;
}
