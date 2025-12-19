<template>
  <div class="step-account">
    <el-input v-model="email" placeholder="请输入需要找回密码的邮箱地址" />
    <div class="btns">
      <el-button @click="$emit('prev')" disabled>上一步</el-button>
      <el-button type="primary" @click="nextStep" :loading="loading"
        >下一步</el-button
      >
    </div>
    <div class="forgot-link" @click="goTo('/findUsername')">忘记账号？</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { emailCheckApi, getCodeApi } from "@/api/login";

const router = useRouter();
const emit = defineEmits(["next", "prev"]);
const email = ref("");
const loading = ref(false);

async function nextStep() {
  if (!email.value || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email.value)) {
    ElMessage.error("请输入正确的邮箱地址");
    return;
  }
  try {
    loading.value = true;
    await emailCheckApi({ email: email.value });
    let payload = {
      channel: "CODE_CHANNEL_TYPE_EMAIL_AWS_SES",
      recipient: email.value,
      type: "CODE_BUSINESS_TYPE_FORGET_PWD",
    };
    await getCodeApi(payload);
    ElMessage.success("验证码已发送");
    setTimeout(() => {
      emit("next", email.value);
    }, 800);
  } finally {
    loading.value = false;
  }
}
function goTo(path: string) {
  router.push({ path: path });
}
</script>

<style lang="less" scoped>
.step-account {
  .el-input {
    width: 90%;
    margin-bottom: 30px;
  }
  .btns {
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin: 0 auto 15px;
  }
  .forgot-link {
    color: #1664ff;
    font-size: 13px;
    cursor: pointer;
  }
  .el-button {
    width: 50%;
  }
}
</style>
