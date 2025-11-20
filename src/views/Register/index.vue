<template>
  <div class="register-wrap">
    <div class="logo-top" @click="goTo('/')">
      <img :src="logo" alt="logo" />
      星云
    </div>
    <!-- 左侧 -->
    <div class="promo">
      <img :src="sideLogo" alt="" />
    </div>

    <!-- 右侧登录卡片 -->
    <div class="login-card">
      <el-card class="card-body">
        <div class="title">注册星云账号</div>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              @keyup.enter.native="handleSubmit"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-popover
              placement="bottom"
              :width="380"
              :visible="!!form.password && isPopoverVisible"
              trigger="manual"
            >
              <template #reference>
                <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  :type="showPassword ? 'text' : 'password'"
                  @input="checkPasswordStrength"
                  @focus="isPopoverVisible = true"
                  @blur="isPopoverVisible = false"
                  clearable
                >
                  <template #suffix>
                    <el-button
                      @click="showPassword = !showPassword"
                      type="text"
                      icon
                    >
                      <el-icon
                        ><View v-if="showPassword" /> <Hide v-else
                      /></el-icon>
                    </el-button> </template
                ></el-input>
              </template>
              <!-- 校验提示 -->
              <div class="password-check-list">
                <div
                  :class="[
                    'check-item',
                    validRule.containsTypes ? 'ok' : 'fail',
                  ]"
                >
                  <el-icon v-if="validRule.containsTypes"
                    ><SuccessFilled
                  /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                  <span>同时包含大、小写字母、数字和特殊符号至少 3 种</span>
                </div>

                <div
                  :class="['check-item', validRule.validChars ? 'ok' : 'fail']"
                >
                  <el-icon v-if="validRule.validChars"
                    ><SuccessFilled
                  /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                  <span>仅支持字母、数字、特殊字符（除空格）</span>
                </div>

                <div
                  :class="['check-item', validRule.validLength ? 'ok' : 'fail']"
                >
                  <el-icon v-if="validRule.validLength"
                    ><SuccessFilled
                  /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                  <span>长度为 8–32 个字符</span>
                </div>
              </div>
            </el-popover>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              v-model="form.rePassword"
              placeholder="请再次输入密码"
              :type="showPasswordRe ? 'text' : 'password'"
              @keyup.enter.native="handleSubmit"
              clearable
            >
              <template #suffix>
                <el-button
                  @click="showPasswordRe = !showPasswordRe"
                  type="text"
                  icon
                >
                  <el-icon
                    ><View v-if="showPasswordRe" /> <Hide v-else
                  /></el-icon>
                </el-button> </template
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div class="code-box">
              <el-input
                v-model="form.code"
                placeholder="请输入邮箱验证码"
                clearable
              />
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
          <!-- <div class="login-line">
            <el-checkbox v-model="form.agree" size="large"
              >我已阅读并同意星云<span>用户协议</span>和<span
                >隐私政策</span
              ></el-checkbox
            >
          </div> -->

          <el-form-item class="login-btn">
            <el-button
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="handleSubmit"
              >注册</el-button
            >
          </el-form-item>

          <div class="register">
            已有账号？ <span @click="goTo('/login')">立即登录</span>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { getCodeApi, registryApi } from "@/api/login";
import type { getCodeParams, registryParams } from "@/api/login/types";
import logo from "@/assets/svgs/logo.svg";
import sideLogo from "@/assets/login/side-logo.svg";
import {
  View,
  Hide,
  SuccessFilled,
  CircleCloseFilled,
} from "@element-plus/icons-vue";

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const showPassword = ref(false);
const showPasswordRe = ref(false);
const countdown = ref(0);
const timer = ref<number>();
const hasGotCode = ref(false); // 用于记录是否获取过验证码
const isPopoverVisible = ref(false); // 用于控制密码强度提示框的显示
// 密码校验规则
const validRule = reactive({
  containsTypes: false,
  validChars: false,
  validLength: false,
});
// 表单数据
const form = reactive({
  email: "",
  passwordEmail: "",
  username: "",
  password: "",
  rePassword: "",
  code: "",
  // agree: false,
});

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
  username: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 6, max: 20, message: "用户名长度为6-40个字符", trigger: "blur" },
    {
      validator(_: any, value: string, cb: (err?: Error) => void) {
        if (!value) {
          cb(new Error("请输入用户名称"));
          return;
        }

        // 检查是否以中英文数字开头
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9]/.test(value)) {
          cb(new Error("用户名必须以中文、英文或数字开头"));
          return;
        }

        // 检查是否只包含中英文、数字、-、_、#
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9\-_#]+$/.test(value)) {
          cb(new Error("用户名只能包含中文、英文、数字、-、_、#"));
          return;
        }

        cb();
      },
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 32, message: "密码长度为8-32个字符", trigger: "blur" },
    {
      validator(_: any, value: string, cb: (err?: Error) => void) {
        if (!value) {
          cb(new Error("请输入密码"));
          return;
        }

        // 检查是否包含空格
        if (/\s/.test(value)) {
          cb(new Error("密码不能包含空格"));
          return;
        }

        // 检查是否只包含字母、数字和特殊字符
        if (!/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]+$/.test(value)) {
          cb(new Error("密码只能包含字母、数字和特殊字符"));
          return;
        }

        // 检查密码复杂度
        let hasUpper = /[A-Z]/.test(value);
        let hasLower = /[a-z]/.test(value);
        let hasNumber = /\d/.test(value);
        let hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value);

        // 计算包含的字符类型数量
        let typeCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
          Boolean
        ).length;

        if (typeCount < 3) {
          cb(
            new Error(
              "密码必须包含至少3种字符类型(大写字母、小写字母、数字、特殊字符)"
            )
          );
          return;
        }

        cb();
      },
      trigger: "blur",
    },
  ],
  rePassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator(_: any, value: string, cb: (err?: Error) => void) {
        if (!value) {
          cb(new Error("请确认密码"));
          return;
        }
        if (value !== form.password) {
          cb(new Error("两次输入的密码不一致"));
          return;
        }
        cb();
      },
      trigger: "blur",
    },
  ],
  code: [
    { required: true, message: "请输入邮箱验证码", trigger: "blur" },
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
const checkPasswordStrength = (val: string) => {
  // 1️⃣ 长度校验
  validRule.validLength = val.length >= 8 && val.length <= 32;

  // 2️⃣ 仅支持合法字符（不含空格）
  validRule.validChars =
    /^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]+$/.test(val);

  // 3️⃣ 至少包含大写、小写、数字、特殊符号中的三种
  let types = 0;
  if (/[A-Z]/.test(val)) types++;
  if (/[a-z]/.test(val)) types++;
  if (/\d/.test(val)) types++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(val)) types++;
  validRule.containsTypes = types >= 3;
};
const handleSendCode = async () => {
  if (!form.email) return ElMessage.warning("请输入邮箱");
  try {
    let payload: getCodeParams;
    payload = {
      channel: "CODE_CHANNEL_TYPE_EMAIL_AWS_SES",
      recipient: form.email?.trim(),
      type: "CODE_BUSINESS_TYPE_REGISTER",
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

// 注册处理
async function handleSubmit() {
  if (!formRef.value) return;
  (formRef.value as any).validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;

    try {
      let payload: registryParams;
      payload = {
        username: form.username?.trim(),
        email: form.email?.trim(),
        password: form.password,
        type: "ACCOUNT_TYPE_EMAIL",
        code: form.code?.trim(),
      };

      await registryApi(payload);
      ElMessage.success("注册成功");
      goTo("/login");
    } catch (err: any) {
      console.error("注册失败", err);
    } finally {
      loading.value = false;
    }
  });
}
function goTo(path: string) {
  router.push({ path: path });
}
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
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #41464f;
}
.register-wrap {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(180deg, #f3f7ff 0%, #fff 100%);
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 30px 60px;
  background: url("@/assets/login/bacakground.svg") no-repeat center;
  background-size: cover;
}
.logo-top {
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 22px;
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  img {
    width: 50px;
    margin-right: 5px;
  }
}
/* 左侧 */
.promo {
  width: 60%;
  img {
    width: 80%;
  }
}

/* 右侧登录卡 */
.login-card {
  width: 476px;
  .card-body {
    border-radius: 12px;
    padding: 28px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .login-form {
    margin-top: 8px;

    .code-box {
      display: flex;
      gap: 10px;
      :deep(.el-input) {
        width: 250px;
      }
      :deep(.el-button) {
        width: 120px;
        height: 42px;
        font-weight: 400;
      }
    }
  }
  .login-line {
    color: #41464f;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 15px;
    span {
      color: #3370ff;
      cursor: pointer;
      margin: 0 5px;
    }
  }
  .login-btn {
    :deep(.el-button) {
      height: 40px;
      font-size: 14px !important;
    }
    :deep(.el-button.is-disabled, .el-button.is-disabled:hover) {
      background-color: rgba(160, 192, 255);
      background-image: none;
      border-color: rgba(160, 192, 255);
      color: var(--el-button-disabled-text-color);
      cursor: not-allowed;
    }
  }
  .register {
    text-align: center;
    color: #6b7280;
    cursor: pointer;
    span {
      color: #3370ff;
    }
  }
}
</style>
