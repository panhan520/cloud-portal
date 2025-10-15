<template>
  <div class="step-account">
    <el-input
      v-model="email"
      placeholder="请输入需要找回密码的邮箱地址"
      clearable
    />
    <div class="btns">
      <el-button @click="$emit('prev')" disabled>上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
    <a class="forgot-link" href="#">忘记账号？</a>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

const email = ref("");

function nextStep() {
  if (!email.value || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email.value)) {
    ElMessage.error("请输入正确的邮箱地址");
    return;
  }
  // 模拟发送验证码
  ElMessage.success("验证码已发送");
  setTimeout(() => {
    emit("next");
  }, 800);
}

const emit = defineEmits(["next", "prev"]);
</script>

<style lang="less" scoped>
.step-account {
  .el-input {
    width: 100%;
    margin-bottom: 30px;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .forgot-link {
    color: #409eff;
    font-size: 13px;
  }
}
</style>
