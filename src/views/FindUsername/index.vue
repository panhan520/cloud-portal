<template>
  <div class="find-container">
    <h2>找回登录名</h2>
    <!-- 第一步，输入邮箱和密码 -->
    <el-tabs v-if="currentStep === 1" v-model="activeTab" class="tab">
      <el-tab-pane label="邮箱" name="email">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="0"
          class="form"
        >
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item prop="code">
            <div class="code-box">
              <el-input v-model="form.code" placeholder="请输入邮箱验证码" />
              <el-button
                type="default"
                :disabled="countdown > 0"
                @click="handleSendCode"
              >
                {{
                  countdown > 0
                    ? `${countdown}s后重新获取`
                    : hasGotCode
                    ? "重新获取"
                    : "获取验证码"
                }}
              </el-button>
            </div>
          </el-form-item>

          <div class="btn-group">
            <el-button @click="handlePrev">上一步</el-button>
            <el-button type="primary" @click="handleNext" :loading="loading"
              >下一步</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 找回成功 -->
    <FindSuccess
      v-if="currentStep === 2"
      :username="username"
      :email="form.email"
      :code="form.code"
    />
    <!-- 找回失败 -->
    <FindFail
      v-if="currentStep === 3"
      @update:currentStep="handleCurrentStep"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { getCodeApi, verifyCodeApi, forgetUsernameApi } from "@/api/login";
import type { getCodeParams } from "@/api/login/types";
import FindSuccess from "./components/FindSuccess/index.vue";
import FindFail from "./components/FindFail/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("email");
const countdown = ref(0);
const timer = ref<number>();
const hasGotCode = ref(false); // 用于记录是否获取过验证码
const formRef = ref();
const loading = ref(false);

const form = reactive({
  email: "",
  code: "",
});
const currentStep = ref(1);
const username = ref("");

// 正则
const emailRe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// 校验规则
const rules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator(_: any, value: string, cb: (err?: Error) => void) {
        if (!emailRe.test(value)) return cb(new Error("请输入正确的邮箱"));
        cb();
      },
      trigger: "blur",
    },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    {
      validator(_: any, value: string, cb: (err?: Error) => void) {
        if (!value) {
          cb(new Error("请输入邮箱验证码"));
          return;
        }
        if (!/^\d{6}$/.test(value)) {
          cb(new Error("验证码格式不正确，应为6位数字"));
          return;
        }
        cb();
      },
      trigger: "blur",
    },
  ],
};
// 从找用户名失败的页面返回
const handleCurrentStep = (step: number) => {
  currentStep.value = step;
  formRef.value?.resetFields();
  form.email = "";
  form.code = "";
};
// 发送验证码
const handleSendCode = async () => {
  if (!form.email) return ElMessage.warning("请输入邮箱");
  if (!emailRe.test(form.email)) return ElMessage.warning("请输入正确的邮箱");
  try {
    let payload: getCodeParams;
    payload = {
      channel: "CODE_CHANNEL_TYPE_EMAIL_AWS_SES",
      recipient: form.email?.trim(),
      type: "CODE_BUSINESS_TYPE_FORGET_PWD",
    };
    await getCodeApi(payload);
    ElMessage.success("验证码已发送");
    hasGotCode.value = true; // 标记已获取过验证码
    countdown.value = 60;
    timer.value = window.setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer.value);
    }, 1000);
  } catch (error) {
    ElMessage.error("发送失败，请稍后再试");
  }
};
// 下一步
const handleNext = async () => {
  if (!formRef.value) return;
  (formRef.value as any).validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    try {
      let payload: any;
      payload = {
        recipient: form.email?.trim(),
        code: form.code?.trim(),
        type: "CODE_BUSINESS_TYPE_FORGET_PWD",
      };
      const res = await verifyCodeApi(payload);
      if (res.code === 200) {
        let payload: any;
        payload = {
          email: form.email?.trim(),
        };
        const res = await forgetUsernameApi(payload);
        if (res.code === 200) {
          username.value = res.data.username;
          currentStep.value = 2;
        } else {
          currentStep.value = 3;
        }
      }
    } finally {
      loading.value = false;
    }
  });
};

const handlePrev = () => {
  router.replace({ path: "/login" });
};
</script>

<style scoped lang="less">
:deep(.el-tabs__item) {
  background-color: #ffffff !important;
  font-size: 16px;
  margin-right: 30px;
}
:deep(.el-tabs__nav-wrap:after) {
  background-color: #ffffff;
}
.find-container {
  width: 400px;
  margin: 100px auto;
  text-align: center;
  .tab {
    margin-top: 20px;
    .code-box {
      display: flex;
      gap: 10px;
      :deep(.el-input) {
        width: 270px;
      }
      :deep(.el-button) {
        width: 120px;
        height: 42px;
        font-weight: 400;
      }
    }
    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      :deep(.el-button) {
        flex: 1;
      }
    }
  }
}
</style>
