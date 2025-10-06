<template>
  <header class="vce-header">
    <div class="vce-header-left">
      <!-- 左侧菜单图标 -->
      <div class="menu-icon" @click="toggleDrawer" role="button">
        <svg v-if="!drawerVisible" viewBox="0 0 24 24" width="24" height="24">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="24" height="24">
          <path
            d="M6 6l12 12M6 18L18 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <!-- 原 Logo -->
      <div class="vce-logo" @click="goTo('/')" role="button">
        <svg
          class="logo-icon"
          viewBox="0 0 48 48"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path
            d="M24 4L44 34H4L24 4z"
            fill="currentColor"
            style="color: #ff6a00"
          />
        </svg>
        <span class="logo-text">GAINETICS</span>
      </div>
    </div>

    <div class="vce-header-center">
      <el-input
        v-model="searchText"
        placeholder="搜索产品或文档"
        clearable
        class="search-input"
        @keyup.enter="onSearch"
      >
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>

    <div class="vce-header-right">
      <el-dropdown trigger="click" @command="handleDropdownCommand">
        <template #default>
          <div class="user-wrap">
            <img
              class="avatar"
              src="https://dummyimage.com/32x32/ccc/fff.png"
              alt="avatar"
            />
            <span class="user-name">{{ userName }}</span>
            <i class="arrow"></i>
          </div>
        </template>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 左侧抽屉菜单 -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="250px"
      :with-header="false"
      custom-class="left-drawer"
    >
      <div class="drawer-content">
        <div class="drawer-title">产品与服务</div>
        <ul class="drawer-list">
          <li @click="goTo('/waf')">Web应用防火墙</li>
          <li @click="goTo('/cert')">证书中心</li>
        </ul>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";

type DropdownCommand = string | number | Record<string, any>;

const router = useRouter();
const userName = ref("H");
const searchText = ref("");
const drawerVisible = ref(false);

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value;
};

const handleDropdownCommand = (cmd: DropdownCommand) => {
  if (cmd === "profile") {
    router.push("/profile");
  } else if (cmd === "logout") {
    console.log("logout");
  }
};

const goTo = (path: string) => {
  if (drawerVisible.value && path !== "/") toggleDrawer();
  router.push(path);
};

const onSearch = () => {
  router.push({ path: "/search", query: { q: searchText.value } });
};
</script>

<style lang="less" scoped>
:deep(.el-overlay.is-drawer) {
  margin-top: 48px;
}
:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.3);
}
:deep(.el-drawer__body) {
  background-color: #f6f8fa;
  padding: 20px 12px 12px;
}
.vce-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 20px;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  .vce-header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-icon {
      cursor: pointer;
      svg {
        color: #333;
        transition: transform 0.3s;
      }
    }

    .vce-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .logo-icon {
        display: inline-block;
      }
      .logo-text {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
      }
    }
  }

  .vce-header-center {
    flex: 1;
    display: flex;
    justify-content: center;

    .search-input {
      width: 520px;
      max-width: 60%;
      .el-input__inner {
        border-radius: 4px;
      }
    }
  }

  .vce-header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-wrap {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      cursor: pointer;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .user-name {
        font-size: 14px;
        color: #111827;
      }
      .arrow {
        width: 8px;
        height: 8px;
        border-left: 2px solid #999;
        border-bottom: 2px solid #999;
        transform: rotate(-45deg);
        margin-left: 2px;
      }
    }
  }
}
.drawer-content {
  background: #f6f8fa;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #41464f;
  cursor: pointer;
  font-size: 13px;
  position: relative;
  .drawer-title {
    background: rgba(22, 100, 255, 0.08);
    border: 1px solid #a0c0ff;
    border-radius: 4px;
    color: #1664ff;
    padding: 10px 12px;
  }
  .drawer-list {
    list-style: none;
    margin-top: 12px;
    li {
      height: 36px;
      line-height: 40px;
      margin-bottom: 4px;
      padding: 0 12px;
      &:hover {
        background: rgba(22, 100, 255, 0.08);
        color: #1664ff;
      }
    }
  }
}

@media (max-width: 900px) {
  .vce-header {
    .vce-header-center {
      display: none;
    }
  }
}
</style>
