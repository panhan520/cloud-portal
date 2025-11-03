import { defineComponent } from "vue";
import { useMaster, MicroApp } from "@/qiankun/src/master";
import Header from "./header/index.vue";
import SideBar from "./sideBar/index.tsx";

export default defineComponent({
  name: "Layout",
  setup() {
    const { actions, globalState } = useMaster();
    actions.value.setGlobalState({
      ...globalState.value,
      userInfo: {
        name: "asdasdd",
        age: 12,
      },
    });
    return () => (
      <>
        <Header />
        <SideBar />
        {/* <RouterView />  // TODO: 测试用，后续改回RouterView */}
        <MicroApp />
      </>
    );
  },
});
