import getReqByProxyModule from "@/config/request";
import type {
  LoginParams,
  getCodeParams,
  registryParams,
  ApiResponse,
  verifyCodeParams,
} from "./types";

import { PROXY } from "@/config/constants";
const userAxios = getReqByProxyModule({ proxyModule: PROXY.USER });

// 用户登录接口
export const loginApi = (
  data: LoginParams
): Promise<ApiResponse<{ token: string; uid: string }>> => {
  return userAxios.post("/api/v1/iam/login", data);
};

// 发送验证码邮件
export const getCodeApi = (data: getCodeParams): Promise<ApiResponse<{}>> => {
  return userAxios.post("/api/v1/iam/code", data);
};

// 用户注册接口
export const registryApi = (data: registryParams) => {
  return userAxios.post("/api/v1/iam/registry", data);
};

// 校验邮箱验证码
export const verifyCodeApi = (
  data: verifyCodeParams
): Promise<ApiResponse<{}>> => {
  return userAxios.post("/api/v1/iam/verify_code", data);
};

// 忘记登录用户名 - 云平台
export const forgetUsernameApi = (
  data: any
): Promise<ApiResponse<{ username: string }>> => {
  return userAxios.post("/api/v1/iam/username/forget", data);
};

// 忘记密码-云平台
export const forgetPwdApi = (data: any): Promise<ApiResponse<{}>> => {
  return userAxios.post("/api/v1/iam/pwd/forget", data);
};

// 检查邮箱是否存在
export const emailCheckApi = (data: any): Promise<ApiResponse<{}>> => {
  return userAxios.post("/api/v1/iam/email/check", data);
};
