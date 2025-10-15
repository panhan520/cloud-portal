<template>
  <div class="step-reset">
    <el-alert
      title="请在5分钟内完成操作，超时后需要重新进行验证"
      type="info"
      show-icon
      class="info-box"
    />
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm">
        <el-input
          v-model="form.confirm"
          type="password"
          show-password
          placeholder="确认新密码"
        />
      </el-form-item>
      <div class="btns">
        <el-button @click="$emit('prev')">上一步</el-button>
        <el-button type="primary" @click="submitForm">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

const formRef = ref<FormInstance>();
const form = ref({
  password: "",
  confirm: "",
});

const rules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  confirm: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== form.value.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const emit = defineEmits(["next", "prev"]);

async function submitForm() {
  await formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success("密码修改成功");
      emit("next");
    }
  });
}
</script>

<style lang="less" scoped>
.step-reset {
  .info-box {
    margin-bottom: 20px;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
</style>
