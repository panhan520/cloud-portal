<template>
  <div class="login-wrap">
    <div class="logo-top" @click="goTo('/')">
      <img :src="logo" alt="logo" />
      GAINETICS
    </div>
    <!-- 左侧 -->
    <div class="promo">
      <img :src="sideLogo" alt="" />
    </div>

    <!-- 右侧登录卡片 -->
    <div class="login-card">
      <el-card class="card-body">
        <div class="top-continer">
          <img :src="hiIcon" alt="" />
          <div class="title">
            注册成功
            <p>完善信息获得更多权益</p>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="login-form"
        >
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              :type="showPassword ? 'text' : 'password'"
              @keyup.enter.native="handleSubmit"
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
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="handleSubmit"
              class="login-btn"
              >完善信息</el-button
            >
          </el-form-item>
          <div class="login-bottom">
            <div class="forgot" @click="goTo('/findUsername')">忘记账号</div>
            <div class="forgot" @click="onForgotPassword">忘记密码</div>
          </div>

          <div class="register">
            没有账号？ <span @click="goTo('/register')">现在就注册</span>
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
// import { loginApi } from "@/api/login";
import hiIcon from "@/assets/login/hi.svg";
import type { LoginParams } from "@/api/login/types";
import logo from "@/assets/svgs/logo.svg";
import sideLogo from "@/assets/login/side-logo.svg";
import { View, Hide } from "@element-plus/icons-vue";

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const showPassword = ref(false);

// 表单数据
const form = reactive({
  email: "",
  passwordEmail: "",
  username: "",
  password: "",
  type: "email",
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
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  passwordEmail: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 忘记密码
function onForgotPassword() {
  router.push({ path: "/login" });
}

// 登录处理
async function handleSubmit() {
  if (!formRef.value) return;
  (formRef.value as any).validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;

    try {
      let payload: LoginParams;
      payload = {
        username: form.username?.trim(),
        email: form.email?.trim(),
        password: form.type === "account" ? form.password : form.passwordEmail,
        type: form.type,
      };

      //   const res = await loginApi(payload);
      //   假设 res.token 存在
      //   if (res?.token) {
      //     sessionStorage.setItem("ACCESS_TOKEN", res.token);

      //     ElMessage.success("登录成功");
      //   router.replace({ name: "Dashboard" });
      //   } else {
      //     ElMessage.error("登录失败：后端未返回 token");
      //   }
    } catch (err: any) {
      // 这里可根据 err.response 做更细的处理
      console.error("登录失败", err);
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
.login-wrap {
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
  .top-continer {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    img {
      width: 70px;
    }
    .title {
      font-size: 24px;
      p {
        font-size: 14px;
        margin-top: 5px;
        color: #6b7280;
      }
    }
  }

  .login-form {
    margin-top: 8px;
  }
  .login-btn {
    height: 40px;
    font-size: 14px !important;
  }
  .login-bottom {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 8px 0 18px;
    .forgot {
      cursor: pointer;
      margin-left: 10px;
      &:hover {
        color: #3370ff;
      }
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
