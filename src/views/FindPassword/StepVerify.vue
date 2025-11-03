<template>
  <div class="step-verify">
    <p class="desc">
      请输入邮箱
      {{ props.email }}
      收到的6位验证码，有效期5分钟，如验证码失效，请尝试重新获取验证码
    </p>

    <div class="code-box">
      <el-input
        v-for="(_val, index) in codes"
        :key="index"
        v-model="codes[index]"
        maxlength="1"
        class="code-input"
        @input="handleInput(index, $event)"
        @keydown.delete="handleDelete(index, $event)"
        @paste="handlePaste"
        ref="codeInputs"
      />
    </div>

    <div class="tips">
      {{ countdown }}秒后可点击
      <div
        class="get-code"
        @click.prevent="resendCode"
        :class="{ disabled: countdown > 0 }"
      >
        重发验证码
      </div>
    </div>

    <div class="btns">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button
        type="primary"
        :disabled="!isFilled"
        :loading="loading"
        @click="handleNext"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { getCodeApi, verifyCodeApi } from "@/api/login";

const props = defineProps<{
  email: string;
}>();
const emit = defineEmits(["next", "prev"]);

const codes = ref(["", "", "", "", "", ""]);
const countdown = ref(60);
const loading = ref(false);
const codeInputs = ref<any[]>([]);

const isFilled = computed(() => codes.value.every((v) => v));

// 处理输入
function handleInput(index: number, value: string) {
  // 如果输入的是数字或字母，自动跳到下一个
  if (value && index < 5) {
    nextTick(() => {
      codeInputs.value[index + 1]?.focus();
    });
  }
}

// 处理删除键
function handleDelete(index: number, event: KeyboardEvent) {
  // 如果当前输入框为空，删除前一个输入框的内容并聚焦
  if (!codes.value[index] && index > 0) {
    event.preventDefault(); // 阻止默认删除行为
    codes.value[index - 1] = "";
    nextTick(() => {
      codeInputs.value[index - 1]?.focus();
    });
  }
}

// 处理粘贴事件
function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData("text") || "";
  const cleanData = pasteData.replace(/[^a-zA-Z0-9]/g, ""); // 只保留字母和数字

  if (cleanData.length > 0) {
    // 清空所有输入框
    codes.value.fill("");

    // 填充粘贴的内容
    const pasteCodes = cleanData.split("");
    pasteCodes.forEach((char, index) => {
      if (index < 6) {
        codes.value[index] = char;
      }
    });

    // 聚焦到下一个可用的输入框
    nextTick(() => {
      const focusIndex = Math.min(5, pasteCodes.length);
      codeInputs.value[focusIndex]?.focus();
    });
  }
}

async function resendCode() {
  if (countdown.value > 0) return;
  let payload = {
    channel: "CODE_CHANNEL_TYPE_EMAIL_AWS_SES",
    recipient: props.email,
    type: "CODE_BUSINESS_TYPE_FORGET_PWD",
  };
  await getCodeApi(payload);
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

async function handleNext() {
  loading.value = true;
  try {
    let payload = {
      recipient: props.email?.trim(),
      code: codes.value.join(""),
      type: "CODE_BUSINESS_TYPE_FORGET_PWD",
    };
    await verifyCodeApi(payload);
    emit("next", codes.value.join(""));
  } finally {
    loading.value = false;
  }
}

onMounted(() => startCountdown());
</script>

<style lang="less" scoped>
:deep(.el-input__inner) {
  text-align: center;
}
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

    .get-code {
      color: #409eff;
      display: inline-block;
      cursor: pointer;
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
  .el-button {
    width: 50%;
  }
}
</style>
