<template>
  <div class="layout">
    <Header />
    <SideBar />
    <!-- 强制路由组件重新挂载，避免访问已卸载 vnode -->
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </RouterView>
    <MicroApp />
  </div>
</template>

<script setup lang="ts">
import { useMaster } from "~/qiankun/src/master";
import Header from "./header/index.vue";
import SideBar from "./sideBar";
import { MicroApp } from "~/qiankun/src/master";

const { actions, globalState } = useMaster();

actions.value.setGlobalState({
  ...globalState.value,
  userInfo: {
    name: "asdasdd",
    age: 12,
  },
});
</script>

<style scoped>
.layout {
  height: 100%;
}
</style>
