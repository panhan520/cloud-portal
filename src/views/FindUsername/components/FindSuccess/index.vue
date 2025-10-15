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
    <!-- 重置密码弹框组件 -->
    <ResetPassword
      v-model="showResetDialog"
      @confirm="handleResetConfirm"
      @close="handleResetDialogClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import successIcon from "@/assets/login/success.svg";
import ResetPassword from "../ResetPassword/index.vue";

const router = useRouter();
const props = defineProps<{
  username: string;
}>();
const username = props.username;

// 控制重置密码弹框的显示
const showResetDialog = ref(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(username);
  ElMessage.success("复制成功");
};

const handleReset = () => {
  showResetDialog.value = true;
};

const handleResetConfirm = () => {
  showResetDialog.value = false;
  ElMessage.success("密码重置请求已提交");
};

const handleResetDialogClose = () => {
  showResetDialog.value = false;
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
