<template>
  <div class="success-container">
    <div class="success-content">
      <img :src="successIcon" alt="success" width="80" />
      <div class="success-title">找回登录名成功</div>
      <div class="success-text">请妥善保管您的账号名称：</div>
      <div class="username-box">
        <span
          >登录名：<strong>{{ username }}</strong></span
        >
        <div>
          <el-button text type="primary" @click="handleCopy">复制</el-button>
          <el-button text type="primary" @click="handleReset"
            >重置密码</el-button
          >
        </div>
      </div>
      <el-button type="primary" class="done-btn" @click="handleDone"
        >完成</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import successIcon from "@/assets/login/success.svg";

const router = useRouter();
const props = defineProps<{
  username: string;
}>();
const username = props.username;
const handleCopy = async () => {
  await navigator.clipboard.writeText(username);
  ElMessage.success("复制成功");
};

const handleReset = () => {
  //   router.push("/reset-password");
};

const handleDone = () => {
  router.push("/login");
};
</script>

<style scoped lang="less">
.success-container {
  margin: 20px auto;
  text-align: center;
  .success-title {
    font-size: 14px;
    margin: 15px 0;
  }
  .success-text {
    font-size: 13px;
    color: #999;
    text-align: left;
    margin-bottom: 5px;
  }
  .success-content {
    .username-box {
      margin: 0 0 10px 0;
      padding: 5px 10px;
      border: 1px solid #ebeef5;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .done-btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
