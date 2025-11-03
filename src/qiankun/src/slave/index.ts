import { ref } from "vue";
import { renderWithQiankun } from "vite-plugin-qiankun/dist/helper";
import { IS_QIANKUN } from "@/qiankun/src/slave/constants";

import type { App } from "vue";
import type { OnGlobalStateChangeCallback } from "qiankun";
import type { ILifeCycle } from "./interfaces";
import type { IActions, IUseSlaveRes } from "./interfaces";

/** 单例存储 */
let slaveConfigCache: IUseSlaveRes | null = null;

export const useSlave = (): IUseSlaveRes => {
  if (slaveConfigCache) {
    return slaveConfigCache;
  }
  /** 全局数据 */
  const globalState = ref({});
  /** 全局数据的操作集 */
  const actions = ref<IActions>({
    onGlobalStateChange: (
      _callback: OnGlobalStateChangeCallback,
      _fireImmediately?: boolean
    ) => {},
    setGlobalState: (_state: Record<string, any>) => true,
  });
  const render = (generatorApp: () => App<Element>, lifeCycle?: ILifeCycle) => {
    if (!IS_QIANKUN) {
      generatorApp()?.mount("#app");
    } else {
      renderWithQiankun({
        mount(props: any) {
          actions.value.onGlobalStateChange = props.onGlobalStateChange;
          actions.value.setGlobalState = props.setGlobalState;
          generatorApp()?.mount(props.container);
          props.onGlobalStateChange((state: any) => {
            globalState.value = state;
          }, true);
          lifeCycle?.mount?.(props);
        },
        bootstrap() {
          console.log({ bootstrap: "bootstrap" });
          lifeCycle?.bootstrap?.();
        },
        update() {
          console.log({ update: "update" });
          lifeCycle?.update?.();
        },
        unmount() {
          console.log({ unmount: "unmount" });
          lifeCycle?.unmount?.();
        },
      });
    }
  };

  slaveConfigCache = {
    render,
    globalState,
    actions,
  };
  return slaveConfigCache;
};
