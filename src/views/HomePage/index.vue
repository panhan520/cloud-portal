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
              <div class="account-avatar">H</div>
              <div class="account-details">
                <div class="account-badge">主账号</div>
                <div class="account-name">{{ userInfo.username }}</div>
                <div class="account-id">ID: {{ userOrg.userId }}</div>
                <div class="verification-status">
                  <span class="check-icon">✓</span>
                  <span>已实名</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 第二行 -->
      <div class="content-row">
        <el-card class="content-card service-card">
          <div class="service-card-content">
            <div class="card-header">
              <h3 class="card-title">多云CDN</h3>
            </div>
            <div class="card-content">
              <div class="service-description">
                多云CDN提供内容分发、流量调度、统一运维，一站式管理流量接入、分发、加速、监控、诊断，提升管理效率，优化网站性能，提供优质用户体验。
              </div>
              <el-button type="primary" class="activate-button">开通</el-button>
            </div>
          </div>
          <div class="service-card-content">
            <div class="card-header">
              <h3 class="card-title">Web应用防火墙</h3>
            </div>
            <div class="card-content">
              <div class="service-description">
                Web应用防火墙（WAF）为Web网站提供一站式应用安全解决方案，包括漏洞防护、访问控制、BOT管理等。
              </div>
              <el-button type="primary" class="activate-button">开通</el-button>
            </div>
          </div>
          <div class="service-card-content">
            <div class="card-header">
              <h3 class="card-title">DDos防护</h3>
            </div>
            <div class="card-content">
              <div class="service-description">
                依托海量防护带宽、多维防护算法、高效清洗系统，为游戏、互联网+、金融等易受DDoS攻击的行业用户提供专业防护服务，保障业务连续性。
              </div>
              <el-button type="primary" class="activate-button">开通</el-button>
            </div>
          </div>
          <div class="service-card-content">
            <div class="card-header">
              <h3 class="card-title">云拨测</h3>
            </div>
            <div class="card-content">
              <div class="service-description">
                <ul class="service-features">
                  <li>从用户位置发起访问测试</li>
                  <li>主动探测，先于用户感知故障</li>
                  <li>开箱即用，管理用户体验，评估网络服务</li>
                </ul>
              </div>
              <el-button type="primary" class="activate-button">开通</el-button>
            </div>
          </div>
        </el-card>

        <el-card class="content-card access-control">
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
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
// 用户信息
const userInfo = computed(() => userStore.userInfo);
const userOrg = computed(() => userStore.userOrg);
const goToAccountManagement = () => {
  console.log("跳转到账号管理");
  // router.push("/account-management");
};

const goToAccessControl = () => {
  console.log("跳转到访问控制");
  // router.push("/access-control");
};
</script>

<style scoped lang="less">
:deep(.el-card__body) {
  padding: 16px;
}

.home-container {
  padding: 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.top-nav {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e9ecef;

  .nav-tab {
    font-size: 16px;
    font-weight: 500;
    color: #666;
    padding: 8px 0;
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
      background: #1664ff;
      color: white;
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
  .service-card-content {
    width: 48%;
    margin: 1%;
    display: inline-block;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 15px;
    height: 200px;
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

// 响应式设计
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .content-row {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }
}
</style>
