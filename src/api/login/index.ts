import getReqByProxyModule from "@/config/request";
import type { LoginParams } from "./types";

import { PROXY } from "@/config/constants";
const userAxios = getReqByProxyModule({ proxyModule: PROXY.USER });

// 登录
export const loginApi = (data: LoginParams) => {
  return userAxios.post("/v1/login", data);
};
