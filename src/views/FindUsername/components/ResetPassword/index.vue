<template>
  <el-dialog
    v-model="dialogVisible"
    title="重置密码"
    width="410"
    :before-close="handleClose"
  >
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
              placeholder="请输入你的密码"
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

            <div :class="['check-item', validRule.validChars ? 'ok' : 'fail']">
              <el-icon v-if="validRule.validChars"><SuccessFilled /></el-icon>
              <el-icon v-else><CircleCloseFilled /></el-icon>
              <span>仅支持字母、数字、特殊字符（除空格）</span>
            </div>

            <div :class="['check-item', validRule.validLength ? 'ok' : 'fail']">
              <el-icon v-if="validRule.validLength"><SuccessFilled /></el-icon>
              <el-icon v-else><CircleCloseFilled /></el-icon>
              <span>长度为 8–32 个字符</span>
            </div>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="rePassword">
        <el-input
          v-model="form.rePassword"
          placeholder="请再次输入你的密码"
          :type="showPasswordRe ? 'text' : 'password'"
        >
          <template #suffix>
            <el-button
              @click="showPasswordRe = !showPasswordRe"
              type="text"
              icon
            >
              <el-icon><View v-if="showPasswordRe" /> <Hide v-else /></el-icon>
            </el-button> </template
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from "vue";
import {
  View,
  Hide,
  SuccessFilled,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { forgetPwdApi } from "@/api/login";
const props = defineProps<{
  modelValue: boolean;
  email: string;
  code: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const dialogVisible = ref(props.modelValue);
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
// 监听props变化
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

// 监听dialogVisible变化，并更新父组件
watch(dialogVisible, (newVal) => {
  emit("update:modelValue", newVal);
});

const handleClose = (_done: () => void) => {
  emit("close");
};

const handleCancel = () => {
  dialogVisible.value = false;
};

const handleConfirm = () => {
  if (!formRef.value) return;
  (formRef.value as any).validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    try {
      let payload = {
        email: props.email?.trim(),
        pwd: form.password,
        code: props.code?.trim(),
      };
      await forgetPwdApi(payload);
      ElMessage.success("重置密码成功");
      emit("close");
    } catch (err: any) {
      console.error("失败", err);
    } finally {
      loading.value = false;
    }
  });
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
</script>
