<template>
  <div class="step-reset">
    <h2>修改密码</h2>
    <div class="success-text">
      为保障您的账户安全，请首次登录后修改密码。修改成功后将自动进入系统。
    </div>
    <div class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
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
                placeholder="请输入新密码"
                :type="showPassword ? 'text' : 'password'"
                @input="checkPasswordStrength"
                @focus="isPopoverVisible = true"
                @blur="isPopoverVisible = false"
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
                :class="['check-item', validRule.containsTypes ? 'ok' : 'fail']"
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
                <el-icon v-if="validRule.validChars"><SuccessFilled /></el-icon>
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
            placeholder="确认密码"
            :type="showPasswordRe ? 'text' : 'password'"
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
        <div class="btns">
          <el-button type="primary" @click="submitForm" :loading="loading"
            >下一步</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { pwdChangeApi } from "@/api/login";
import {
  View,
  Hide,
  SuccessFilled,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
const props = defineProps<{
  oldPwd: string;
}>();
const emit = defineEmits(["next"]);
const showPassword = ref(false);
const showPasswordRe = ref(false);
const isPopoverVisible = ref(false); // 用于控制密码强度提示框的显示
// 密码校验规则
const validRule = reactive({
  containsTypes: false,
  validChars: false,
  validLength: false,
});
// 表单数据
const form = reactive({
  password: "",
  rePassword: "",
});
const formRef = ref();
const loading = ref(false);
// 校验规则
const rules = {
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
              "密码必须包含至少3种字符类型（大写字母、小写字母、数字、特殊字符）"
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
};
async function submitForm() {
  if (!formRef.value) return;
  (formRef.value as any).validate(async (valid: boolean) => {
    if (!valid) return;
    if (form.password === props.oldPwd) {
      ElMessage.error("与原密码一致，请重新输入");
      return;
    }
    loading.value = true;
    try {
      let payload = {
        type: "ACCOUNT_TYPE_USERNAME",
        oldPwd: props.oldPwd?.trim(),
        newPwd: form.password?.trim(),
      };
      await pwdChangeApi(payload);
      emit("next");
    } finally {
      loading.value = false;
    }
  });
}
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
</script>

<style lang="less" scoped>
.step-reset {
  width: 500px;
  margin: 100px auto;
  text-align: center;
  .success-text {
    font-size: 13px;
    margin: 30px auto;
  }
  .form-container {
    width: 380px;
    margin: auto;
    .btns {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
