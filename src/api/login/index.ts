import getReqByProxyModule from "@/config/request";
import type { LoginParams, getCodeParams, registryParams } from "./types";

import { PROXY } from "@/config/constants";
const userAxios = getReqByProxyModule({ proxyModule: PROXY.USER });

// 用户登录接口
export const loginApi = (data: LoginParams) => {
  return userAxios.post("/api/v1/iam/login", data);
};

// 发送验证码邮件
export const getCodeApi = (data: getCodeParams) => {
  return userAxios.post("/api/v1/iam/code", data);
};

// 用户注册接口
export const registryApi = (data: registryParams) => {
  return userAxios.post("/api/v1/iam/registry", data);
};
