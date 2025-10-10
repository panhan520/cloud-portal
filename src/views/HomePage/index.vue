<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <h1 class="title">欢迎回来，管理员 👋</h1>
      <p class="subtitle">这里是微前端主应用控制台首页</p>
    </el-card>

    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-title">已注册微应用</div>
        <div class="stat-value">{{ microApps.length }}</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-title">系统版本</div>
        <div class="stat-value">v2.5.1</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-title">最后更新时间</div>
        <div class="stat-value">{{ lastUpdate }}</div>
      </el-card>
    </div>

    <el-card class="desc-card">
      <p>
        🚀 当前系统通过
        <strong>Qiankun 微前端框架</strong>
        实现多模块集成，您可以从顶部导航切换不同子系统。
      </p>
      <p>🔧 支持动态加载、独立部署、统一鉴权与通信。</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElCard } from "element-plus";

const microApps = ref(["Observable", "WAF", "Cert"]);
const lastUpdate = new Date().toLocaleString();
</script>

<style scoped lang="less">
.home-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.welcome-card {
  text-align: center;
  margin-bottom: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  .title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #666;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  .stat-card {
    text-align: center;
    padding: 20px 0;

    .stat-title {
      font-size: 14px;
      color: #999;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      color: #409eff;
    }
  }
}

.desc-card {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}
</style>
