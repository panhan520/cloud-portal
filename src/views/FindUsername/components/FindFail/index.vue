<template>
  <div class="success-container">
    <div class="success-content">
      <img :src="failIcon" alt="success" width="80" />
      <div class="success-title">登录名找回失败</div>
      <div class="success-text">没有匹配到对应的登录名</div>
      <el-button type="primary" class="done-btn" @click="handleDone"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import failIcon from "@/assets/login/fail.svg";

const router = useRouter();

const handleDone = () => {
  // 带修改
  router.push("/login");
};
</script>

<style scoped lang="less">
.success-container {
  margin: 20px auto;
  text-align: center;
  .success-title {
    font-size: 14px;
    margin: 15px 0 5px;
  }
  .success-text {
    font-size: 13px;
    margin-bottom: 5px;
  }
  .success-content {
    .done-btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
