<template>
  <div class="forgot-container">
    <h2 class="title">找回密码</h2>

    <el-steps :active="activeStep" align-center>
      <el-step title="账号信息" />
      <el-step title="身份验证" />
      <el-step title="修改密码" />
      <el-step title="完成" />
    </el-steps>

    <div class="step-content">
      <component :is="currentComponent" @next="handleNext" @prev="handlePrev" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import StepAccount from "./StepAccount.vue";
import StepVerify from "./StepVerify.vue";
import StepReset from "./StepReset.vue";
import StepFinish from "./StepFinish.vue";

const activeStep = ref(0);

const components = [StepAccount, StepVerify, StepReset, StepFinish];
const currentComponent = computed(() => components[activeStep.value]);

function handleNext() {
  if (activeStep.value < 3) activeStep.value++;
}

function handlePrev() {
  if (activeStep.value > 0) activeStep.value--;
}
</script>

<style lang="less" scoped>
.forgot-container {
  max-width: 500px;
  margin: 100px auto;
  text-align: center;
  .title {
    font-size: 24px;
    margin-bottom: 30px;
  }
  .step-content {
    margin-top: 40px;
  }
}
</style>
