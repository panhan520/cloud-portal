<template>
  <div class="step-finish">
    <el-result
      icon="success"
      title="密码已重置成功"
      sub-title="请使用新密码重新登录"
    >
      <template #extra>
        <el-button type="primary" @click="goLogin">返回登录</el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goLogin() {
  router.push("/login");
}
</script>

<style lang="less" scoped>
.step-finish {
  text-align: center;
  margin-top: 50px;
}
</style>
