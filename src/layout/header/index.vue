<template>
  <header class="vce-header">
    <div class="vce-header-left">
      <!-- 左侧菜单图标 -->
      <div
        class="menu-icon"
        role="button"
        @mouseenter="openDrawer"
        @click="toggleDrawer"
        :class="{
          isActive: drawerVisible,
        }"
      >
        <svg
          v-if="!drawerVisible"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          style="pointer-events: none"
        >
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="24"
          height="24"
          style="pointer-events: none"
        >
          <path
            d="M6 6l12 12M6 18L18 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <!-- Logo -->
      <div class="vce-logo" @click="goTo('/')" role="button">
        <img :src="logo" alt="" class="logo-img" />
        <span class="logo-text">星云</span>
      </div>
      <div class="header-button-bg" @click="goTo('/home')">
        <el-icon><HomeFilled /></el-icon>概览
      </div>
    </div>

    <!-- <div class="vce-header-center">
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
    </div> -->

    <div class="vce-header-right">
      <!-- <div class="header-button-item">文档</div>
      <div class="header-button-item" @click="goTo('/app/console')">控制台</div> -->
      <!-- 未登录状态 -->
      <template v-if="!isLoggedIn">
        <div @click="goToPage('/login')" class="header-button-item">登录</div>
        <div
          @click="goToPage('/register')"
          class="register-button cursor-pointer"
        >
          注册
        </div>
      </template>

      <!-- 已登录状态 -->
      <template v-else>
        <el-dropdown
          trigger="hover"
          @command="handleDropdownCommand"
          placement="bottom-end"
        >
          <template #default>
            <div class="user-wrap">
              <div class="avatar">{{ userInitial }}</div>
            </div>
          </template>
          <template #dropdown>
            <div class="user-info-dropdown">
              <div class="user-info-card">
                <div class="user-avatar">
                  {{ userInitial }}
                </div>
                <div class="user-details">
                  <div class="user-name-row">
                    <span class="username">{{ userInfo.username }}</span>
                    <span
                      class="account-management"
                      @click="goToAccountManagement"
                      >账号管理 ></span
                    >
                  </div>
                  <!-- <div class="account-id">账号ID: {{ userOrg.userId }}</div> -->
                  <div class="user-actions">
                    <!-- <div
                      v-if="!isVerified"
                      class="verify-action"
                      @click="goToVerification"
                    >
                      完成实名认证 >
                    </div> -->
                    <div class="account-badges">
                      <span class="badge main-account">{{
                        userInfo.accountType === "MASTER" ? "主账号" : "子账号"
                      }}</span>
                      <!-- <span
                        class="badge enterprise-verify"
                        @click="goToEnterpriseVerification"
                      >
                        企业认证 >
                      </span> -->
                    </div>
                  </div>
                  <div
                    class="logout-button"
                    :Loading="loading"
                    @click="handleLogout"
                  >
                    退出登录
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-dropdown>
      </template>
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
        <div class="drawer-title">
          <el-icon :size="18"><Grid /></el-icon>产品与服务
        </div>
        <ul class="drawer-list">
          <li
            @click="
              handleService({
                title: '证书中心',
                product: 'CLOUD_PRODUCT_CERT',
              })
            "
          >
            证书中心
          </li>
          <li
            v-for="service in serviceList"
            :key="service.product"
            @click="handleService(service)"
          >
            {{ service.title }}
          </li>
        </ul>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";
import { Grid, HomeFilled } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
import logo from "@/assets/svgs/logo.svg";
import { logoutApi } from "@/api/login";
import { getCloudProductsApi } from "@/api/home/index";

type DropdownCommand = string | number | Record<string, any>;

const router = useRouter();
const userStore = useUserStore();
// const searchText = ref("");
const drawerVisible = ref(false);
const loading = ref(false);

// 登录状态
const isLoggedIn = computed(() => {
  return !!getToken() && !!userStore.userInfo.username;
});

// 用户信息
const userInfo = computed(() => userStore.userInfo);
// const userOrg = computed(() => userStore.userOrg);
interface ServiceItem {
  product: string;
  status: string;
  isReady: boolean;
  title: string;
  desc: string;
  loading: boolean;
}
// 产品数据数组
const serviceList = ref<ServiceItem[]>([]);
// 获取浏览历史（改为响应式）
interface HistoryItem {
  name: string;
  icon: string;
}
// 用户首字母
const userInitial = computed(() => {
  const username = userInfo.value.username;
  return username.charAt(0).toUpperCase();
});

// 认证状态（模拟数据，实际应该从后端获取）
// const isVerified = ref(true); // 可以根据实际需求调整
onMounted(() => {
  getCloudProductsData();
});
// 获取产品列表
const getCloudProductsData = async () => {
  const res = await getCloudProductsApi();
  serviceList.value =
    res.data.list?.filter((item) => item.status === "PRODUCT_STATUS_ACTIVE") ||
    [];
};
const getHistoryFromLocal = () => {
  const history = localStorage.getItem("recentlyProducts");
  return history ? JSON.parse(history) : [];
};
const handleService = async (service: any) => {
  drawerVisible.value = false;
  const rawService = toRaw(service);
  let history = getHistoryFromLocal();
  const productTitle = rawService.title;
  // 去重
  history = history.filter((item: HistoryItem) => item.name !== productTitle);
  let icon = "";
  switch (rawService.product) {
    case "CLOUD_PRODUCT_WAF":
      icon = "fa-solid fa-table-cells-column-lock";
      break;
    case "CLOUD_PRODUCT_CDN":
      icon = "fa-solid fa-diagram-project";
      break;
    case "CLOUD_PRODUCT_DDOS":
      icon = "fa-solid fa-user-shield";
      break;
    case "CLOUD_PRODUCT_PROBE":
      icon = "fa-solid fa-cloud-arrow-up";
      break;
    case "CLOUD_PRODUCT_CERT":
      icon = "fa-solid fa-file-shield";
      break;
    case "CLOUD_PRODUCT_DNPS":
      icon = "fa-solid fa-shield-halved";
      break;
  }

  // 添加到开头并限制最多8个
  history = [
    { name: productTitle, icon, product: rawService.product },
    ...history,
  ].slice(0, 8);

  // 保存到 localStorage
  localStorage.setItem("recentlyProducts", JSON.stringify(history));
  switch (rawService.product) {
    case "CLOUD_PRODUCT_WAF":
      goToPage("/app/waf");
      break;
    case "CLOUD_PRODUCT_CERT":
      goToPage("/app/cert");
      break;
    case "CLOUD_PRODUCT_DNPS":
      goToPage("/domain-shield/");
      break;
  }
};
const toggleDrawer = () => {
  console.log("toggleDrawer", drawerVisible.value);
  drawerVisible.value = !drawerVisible.value;
};

const openDrawer = () => {
  drawerVisible.value = true;
};

const handleDropdownCommand = (cmd: DropdownCommand) => {
  if (cmd === "profile") {
    // router.push("/profile");
  } else if (cmd === "logout") {
    handleLogout();
  }
};

const goToAccountManagement = () => {
  router.push("/account/basic-info");
};

// const goToVerification = () => {
//   router.push("/account/real-name");
// };

// const goToEnterpriseVerification = () => {
//   router.push("/account/security");
// };

const handleLogout = async () => {
  loading.value = true;
  try {
    await logoutApi();
    userStore.clearInfo();
    router.push("/login");
  } finally {
    loading.value = false;
  }
};

const goTo = (path: string) => {
  router.push(path);
  // 点击菜单项时关闭抽屉
  if (drawerVisible.value && path !== "/") {
    drawerVisible.value = false;
  }
};

// const onSearch = () => {
//   router.push({ path: "/search", query: { q: searchText.value } });
// };

const goToPage = (path: string) => {
  router.push({ path });
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
  padding: 0 20px 0 0;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
  position: relative;
  color: #1d2129;
  font-size: 14px;

  .vce-header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-icon {
      width: 48px;
      height: 48px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background: #1664ff;
        svg {
          color: #ffffff;
        }
      }
      svg {
        color: #333;
        transition: transform 0.3s;
      }
    }
    .isActive {
      background: #1664ff;
      svg {
        color: #ffffff;
      }
    }

    .vce-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      .logo-img {
        width: 30px;
      }
      .logo-text {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
      }
    }
    .header-button-bg {
      color: #1664ff;
      background: #ebf1ff;
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
      padding: 0 12px;
      font-size: 13px;
      cursor: pointer;
      border-radius: 4px;
      i {
        margin-right: 4px;
        vertical-align: middle;
        margin-top: -3px;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .vce-header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 32px;

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
    .register-button {
      width: 129px;
      background: #165dff;
      border-radius: 0;
      color: #fff !important;
      display: block;
      font-weight: 500;
      line-height: 48px;
      margin-left: 16px;
      position: relative;
      text-align: center;
      -moz-transition: background 0.1s linear;
      transition: 0.1s linear;
    }
    .header-button-item {
      margin: 5px;
      cursor: pointer;
    }
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
        background-color: #ecf2ff;
        color: #05f;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
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
    padding: 8px 12px;
    i {
      margin: -4px 5px 0 0;
      vertical-align: middle;
    }
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

// 用户信息下拉框样式
:deep(.el-dropdown-menu) {
  padding: 0;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.user-info-dropdown {
  width: 320px;
  background: white;

  .user-info-card {
    padding: 16px;
    display: flex;
    gap: 12px;
    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #ecf2ff;
      color: #05f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;

      .user-name-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .username {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .account-management {
          font-size: 12px;
          color: #666;
          cursor: pointer;

          &:hover {
            color: #1664ff;
          }
        }
      }

      .account-id {
        font-size: 12px;
        color: #999;
        margin-bottom: 12px;
      }

      .user-actions {
        margin-bottom: 16px;

        .verify-action {
          font-size: 14px;
          color: #1664ff;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }

        .account-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #666;
            cursor: pointer;

            &.main-account {
              display: inline-block;
              background: #1664ff;
              color: white;
              font-size: 12px;
              padding: 2px 6px;
              border-radius: 4px;
              cursor: default;
            }

            &.enterprise-verify:hover {
              background: #e6f3ff;
              border-color: #1664ff;
              color: #1664ff;
            }
          }
        }
      }

      .logout-button {
        width: 100%;
        padding: 8px 16px;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #e0e0e0;
          color: #333;
        }
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
