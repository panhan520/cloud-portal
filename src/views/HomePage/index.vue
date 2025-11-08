<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-tab active">概览</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 第一行 -->
      <div class="content-row">
        <el-card class="content-card recent-visits">
          <div class="card-header">
            <h3 class="card-title">最近访问</h3>
          </div>
          <div v-for="value in getHistory()">
            {{ value }}
          </div>
          <div class="card-content">
            <div class="no-data">暂无数据</div>
          </div>
        </el-card>

        <el-card class="content-card my-account">
          <div class="card-header">
            <h3 class="card-title">我的账号</h3>
            <span class="account-management-link" @click="goToAccountManagement"
              >账号管理 ></span
            >
          </div>
          <div class="card-content">
            <div class="account-info">
              <div class="account-avatar">{{ userInitial }}</div>
              <div class="account-details">
                <div class="account-name">{{ userInfo.username }}</div>
                <div class="account-id">ID: {{ userOrg.userId }}</div>
                <div class="account-badge">
                  {{ userInfo.accountType === "MASTER" ? "主账号" : "子账号" }}
                </div>
                <!-- <div class="verification-status">
                  <span class="check-icon">✓</span>
                  <span>已实名</span>
                </div> -->
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 第二行 -->
      <div>
        <el-card class="content-card service-card" v-loading="loading">
          <div
            v-for="service in serviceList"
            :key="service.product"
            class="service-card-content"
          >
            <div class="card-header">
              <h3 class="card-title">{{ service.title }}</h3>
            </div>
            <div class="card-content">
              <div class="service-description">
                {{ service.desc }}
              </div>
              <el-button
                type="primary"
                class="activate-button"
                @click="handleOpenService(service)"
                :loading="service.loading"
              >
                {{
                  service.status === "PRODUCT_STATUS_ACTIVE"
                    ? "立即使用"
                    : "开通"
                }}
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- <el-card class="content-card access-control">
          <div class="card-header">
            <h3 class="card-title">访问控制</h3>
            <span class="access-control-link" @click="goToAccessControl"
              >访问控制 ></span
            >
          </div>
          <div class="card-content">
            <div class="access-sections">
              <div class="access-section">
                <div class="section-title">用户 ></div>
                <div class="section-count">0</div>
                <el-button class="new-button">新建用户</el-button>
              </div>
              <div class="access-section">
                <div class="section-title">用户组 ></div>
                <div class="section-count">0</div>
                <el-button class="new-button">新建用户组</el-button>
              </div>
              <div class="access-section">
                <div class="section-title">角色 ></div>
                <div class="section-count">0</div>
                <el-button class="new-button">新建角色</el-button>
              </div>
            </div>
          </div>
        </el-card> -->
      </div>
    </div>
    <!-- 开通指引弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="开通指引"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="guide-content">
        <p>
          感谢您对【{{
            currentService?.title
          }}】的关注！根据平台规范，使用本产品需先完成企业实名认证。请您联系我们的销售代表，提交企业认证资料。认证通过后，销售将第一时间为您开通产品并交付账户。
        </p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            @click="handleContactSales"
            :loading="loadingSales"
          >
            联系销售
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import {
  getCloudProductsApi,
  openCloudProductsApi,
  inquiriesSalesApi,
} from "@/api/home/index";

const userStore = useUserStore();
const router = useRouter();
const dialogVisible = ref(false);
const currentService = ref<ServiceItem | null>(null);

// 产品数据数组
const serviceList = ref<ServiceItem[]>([]);
const loading = ref(false);
const loadingSales = ref(false);

// 用户信息
const userInfo = computed(() => userStore.userInfo);
const userOrg = computed(() => userStore.userOrg);
// 用户首字母
const userInitial = computed(() => {
  const username = userInfo.value.username;
  return username.charAt(0).toUpperCase();
});
interface ServiceItem {
  product: string;
  status: string;
  isReady: boolean;
  title: string;
  desc: string;
  loading: boolean;
}
onMounted(() => {
  // getCloudProductsData();
});
const getCloudProductsData = async () => {
  try {
    loading.value = true;
    const res = await getCloudProductsApi();
    serviceList.value = res.data.list;
  } finally {
    loading.value = false;
  }
};
const goToAccountManagement = () => {
  router.push("/account/basic-info");
};
const goToPage = (path: string) => {
  router.push(path);
};
const goToAccessControl = () => {
  console.log("跳转到访问控制");
};
// 获取浏览历史
function getHistory() {
  const history = localStorage.getItem("recentlyProducts");
  return history ? JSON.parse(history) : [];
}
const handleOpenService = async (service: any) => {
  const rawService = toRaw(service);
  currentService.value = rawService;
  if (rawService.status === "PRODUCT_STATUS_ACTIVE") {
    let history = getHistory();
    const productTitle = rawService.title;
    // 去重：如果产品已存在，先移除
    history = history.filter((item: string) => item !== productTitle);
    // 添加到数组前面
    history.unshift(productTitle);
    // 保存到localStorage
    localStorage.setItem("recentlyProducts", JSON.stringify(history));
    switch (rawService.product) {
      case "CLOUD_PRODUCT_WAF":
        goToPage("/app/waf");
        break;
    }
  } else if (rawService.isReady) {
    const serviceIndex = serviceList.value.findIndex(
      (item) => item.product === rawService.product
    );
    if (serviceIndex !== -1 && serviceList.value[serviceIndex]) {
      try {
        serviceList.value[serviceIndex].loading = true;
        await openCloudProductsApi({ product: rawService.product });
        ElMessage.success("开通成功");
        getCloudProductsData();
      } finally {
        setTimeout(() => {
          if (serviceList.value[serviceIndex]) {
            serviceList.value[serviceIndex].loading = false;
          }
        }, 1000);
      }
    }
  } else {
    dialogVisible.value = true;
  }
};
// 联系销售
const handleContactSales = async () => {
  if (!currentService.value) {
    ElMessage.error("未选择产品");
    return;
  }
  try {
    loadingSales.value = true;
    await inquiriesSalesApi({ product: currentService.value.product });
    ElMessage.success("我们将在24小时内与您取得联系，请耐心等候");
    dialogVisible.value = false;
  } finally {
    loadingSales.value = false;
  }
};

const handleCancel = () => {
  dialogVisible.value = false;
};
</script>

<style scoped lang="less">
:deep(.el-card__body) {
  padding: 16px;
}

.home-container {
  padding: 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 48px);
}

.top-nav {
  padding: 10px 24px;
  background: white;
  border-bottom: 1px solid #e9ecef;

  .nav-tab {
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    padding: 8px;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &.active {
      color: #1664ff;
      border-bottom-color: #1664ff;
    }
  }
}

.main-content {
  padding: 24px;
}

.content-row {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;

  &:first-child {
    grid-template-columns: 1fr 1fr;
  }

  &:nth-child(2) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &:last-child {
    grid-template-columns: 1fr 1fr;
  }
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .account-management-link,
    .access-control-link {
      font-size: 12px;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #1664ff;
      }
    }
  }

  .card-content {
    .no-data {
      text-align: center;
      color: #999;
      font-size: 14px;
      padding: 20px 0;
    }
  }
}

// 我的账号卡片
.my-account {
  .account-info {
    display: flex;
    gap: 12px;

    .account-avatar {
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

    .account-details {
      flex: 1;

      .account-badge {
        display: inline-block;
        background: #1664ff;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .account-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .account-id {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }

      .verification-status {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #999;

        .check-icon {
          color: #52c41a;
          font-weight: bold;
        }
      }
    }
  }
}

// 服务卡片
.service-card {
  min-height: 480px;
  .service-card-content {
    width: 23%;
    margin: 1%;
    display: inline-block;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 15px;
    height: 230px;
    vertical-align: top;
    position: relative;
    .service-description {
      font-size: 13px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 16px;

      .service-features {
        margin: 0;
        padding-left: 16px;

        li {
          margin-bottom: 4px;
        }
      }
    }
  }

  .activate-button {
    width: 100px;
    background: #1664ff;
    border-color: #1664ff;
    border-radius: 4px;
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);

    &:hover {
      background: #0e4dcc;
      border-color: #0e4dcc;
    }
  }
}

// 访问控制卡片
.access-control {
  .access-sections {
    display: flex;
    justify-content: space-around;
    gap: 16px;

    .access-section {
      width: 28%;
      text-align: center;
      cursor: pointer;
      &:hover {
        .section-title {
          color: #1664ff;
        }
        .section-count {
          color: #1664ff;
        }
      }

      .section-title {
        font-size: 14px;
        color: #999;
        margin-bottom: 8px;
      }

      .section-count {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .new-button {
        width: 100%;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        color: #666;
        border-radius: 4px;

        &:hover {
          background: #e0e0e0;
          color: #333;
        }
      }
    }
  }
}
.guide-content {
  line-height: 1.6;
  p {
    color: #606266;
    margin-bottom: 24px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

// 响应式设计
@media (max-width: 1000px) {
  .service-card {
    .service-card-content {
      width: 48%;
      height: 200px;
    }
  }
}
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .content-row {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }
  .service-card {
    .service-card-content {
      width: 48%;
      height: 220px;
    }
  }
}
</style>
