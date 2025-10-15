<template>
  <div class="step-verify">
    <p class="desc">
      请输入邮箱 {{ maskedEmail }} 收到的6位验证码，有效期10分钟
    </p>

    <div class="code-box">
      <el-input
        v-for="(val, index) in codes"
        :key="index"
        v-model="codes[index]"
        maxlength="1"
        class="code-input"
        @input="focusNext(index)"
      />
    </div>

    <div class="tips">
      {{ countdown }}秒后可点击
      <a
        href="#"
        @click.prevent="resendCode"
        :class="{ disabled: countdown > 0 }"
        >重发验证码</a
      >
    </div>

    <div class="btns">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" :disabled="!isFilled" @click="$emit('next')"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

const codes = ref(["", "", "", "", "", ""]);
const countdown = ref(60);

const maskedEmail = "83772****22@163.com";

const isFilled = computed(() => codes.value.every((v) => v));

function focusNext(index: number) {
  if (codes.value[index] && index < 5) {
    const inputs =
      document.querySelectorAll<HTMLInputElement>(".code-input input");
    inputs[index + 1]?.focus();
  }
}

function resendCode() {
  if (countdown.value > 0) return;
  ElMessage.success("验证码已重新发送");
  countdown.value = 60;
  startCountdown();
}

function startCountdown() {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
}

onMounted(() => startCountdown());
</script>

<style lang="less" scoped>
.step-verify {
  .desc {
    margin-bottom: 20px;
    color: #606266;
  }
  .code-box {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    .el-input {
      width: 40px;
      text-align: center;
    }
  }
  .tips {
    font-size: 13px;
    color: #999;
    margin-bottom: 30px;
    a {
      color: #409eff;
      &.disabled {
        color: #ccc;
        pointer-events: none;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
  }
}
</style>
