<template>
  <div class="account-layout" :class="{ collapsed }">
    <aside class="account-sider">
      <div class="account-sider__title">账号管理</div>
      <ul class="account-menu">
        <li
          v-for="item in menuItems"
          :key="item.name"
          :class="['account-menu__item', { active: isActive(item) }]"
          @click="handleSelect(item)"
        >
          <el-icon :size="16"><User /></el-icon>
          <span class="account-menu__text">{{ item.label }}</span>
        </li>
      </ul>
      <div class="account-sider__footer" @click="toggleCollapsed">
        <span class="account-sider__footer-icon"
          ><el-icon><Expand v-if="collapsed" /><Fold v-else /></el-icon
        ></span>
      </div>
    </aside>
    <section class="account-content">
      <RouterView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { User, Expand, Fold } from "@element-plus/icons-vue";

interface MenuItem {
  label: string;
  name: string;
  path: string;
  aliases?: string[];
}

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);

const menuItems: MenuItem[] = [
  {
    label: "基本信息",
    name: "BasicInfo",
    path: "/account/basic-info",
    aliases: ["/basicInfo"],
  },
  // {
  //   label: "实名认证",
  //   name: "AccountRealName",
  //   path: "/account/real-name",
  // },
  // {
  //   label: "安全设置",
  //   name: "AccountSecurity",
  //   path: "/account/security",
  // },
];

const activePath = computed(() => route.path);
const activeName = computed(() => route.name as string | undefined);

const isActive = (item: MenuItem) => {
  if (item.name && activeName.value === item.name) {
    return true;
  }
  if (item.path === activePath.value) {
    return true;
  }
  if (item.aliases?.includes(activePath.value)) {
    return true;
  }
  return false;
};

const handleSelect = (item: MenuItem) => {
  if (!isActive(item)) {
    router.push(item.path);
  }
};

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped lang="less">
.account-layout {
  display: flex;
  height: calc(100vh - 48px);
  background: #f7f9fc;

  &.collapsed {
    .account-sider {
      width: 62px;
    }
    .account-menu__item {
      justify-content: center;
      padding: 8px 5px;
    }
    .account-menu__text {
      display: none;
    }
    .account-sider__title {
      text-align: center;
    }
    .account-sider__footer-text {
      display: none;
    }
    .account-sider__title {
      display: none;
    }
  }
}

.account-sider {
  width: 200px;
  padding: 24px 0 10px;
  background: #fbfcff;
  box-shadow: inset -1px 0 0 #edf1f6;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}

.account-sider__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  padding: 0 24px 20px;
}

.account-menu {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
}

.account-menu__item {
  padding: 12px 24px;
  margin: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #4e5969;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(22, 100, 255, 0.12);
    color: #165dff;
  }

  &.active {
    background: rgba(22, 100, 255, 0.16);
    color: #165dff;
    font-weight: 600;
  }
}

.account-menu__text {
  font-size: 14px;
  margin-left: 5px;
}

.account-sider__footer {
  padding: 16px 20px 0;
  font-size: 13px;
  color: #4e5969;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #165dff;
  }
}

.account-sider__footer-icon {
  font-size: 18px;
}

.account-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #fff;
}
</style>
