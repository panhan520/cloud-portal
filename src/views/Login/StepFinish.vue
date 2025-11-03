<template>
  <div class="step-finish">
    <h2>修改密码</h2>
    <div class="success-text">
      为保障您的账户安全，请首次登录后修改密码。修改成功后将自动进入系统。
    </div>
    <img :src="successIcon" alt="success" width="80" />
    <div class="success-title">修改密码成功</div>
    <div class="success-desc">
      <span>{{ countdown }}s</span>后自动跳转到系统
    </div>
    <el-button type="primary" @click="goLogin">完成</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import successIcon from "@/assets/login/success.svg";

const router = useRouter();
const countdown = ref(5); // 初始倒计时5秒
let timer: ReturnType<typeof setInterval> | null = null;

// 跳转到登录页
function goLogin() {
  // 清除定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  router.push("/home");
}

// 开始倒计时
function startCountdown() {
  timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      goLogin();
    }
  }, 1000);
}

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style lang="less" scoped>
.step-finish {
  width: 500px;
  margin: 100px auto;
  text-align: center;
  .success-text {
    font-size: 13px;
    margin: 30px auto;
  }
  .success-title {
    font-size: 14px;
    margin: 15px 0;
  }
  .success-desc {
    font-size: 13px;
    color: #999;
    margin-bottom: 40px;
    span {
      color: #1664ff;
      margin-right: 3px;
    }
  }
  .el-button {
    width: 380px;
  }
}
</style>
