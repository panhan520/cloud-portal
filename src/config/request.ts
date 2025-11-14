import axios, {
  AxiosError,
  type InternalAxiosRequestConfig, // 修改导入
  type AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import qs from "qs";
// import { errorCodeType } from "../api/errorCodeType";
import { PROXY } from "./constants";
import { filterEmptyParams } from "./utils.ts";
import { getToken, removeToken } from "@/utils/auth";

import type { AxiosInstance } from "axios";
import { useUserStore } from "@/store/modules/user";
function getRouter() {
  return window.__MICRO_ROUTER__;
}

/** 根据模块获取请求实例 */
const getReqByProxyModule = ({
  proxyModule,
}: {
  proxyModule: keyof typeof PROXY;
}): AxiosInstance => {
  // 创建axios实例 进行基本参数配置
  const axiosInstance = axios.create({
    baseURL: proxyModule,
    timeout: 20000,
    withCredentials: true,
  });

  // request interceptor 接口请求拦截
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 修改类型
      if (config.params) config.params = filterEmptyParams(config.params);
      if (config.data) config.data = filterEmptyParams(config.data);

      if (config.method === "get" && config.params) {
        config.paramsSerializer = (params) => {
          return qs.stringify(params, {
            arrayFormat: "brackets",
            allowDots: true,
          });
        };
      }

      // 确保 headers 存在
      if (!config.headers) {
        config.headers = {} as any; // 类型断言保证兼容性
      }

      if (getToken()) {
        config.headers["Authorization"] = `Bearer ${getToken()}`;
      }

      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // response interceptor 接口响应拦截
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): any => {
      const resData = response.data as {
        code?: number | string;
        message?: string;
        [key: string]: any;
      };

      if (resData.code === 401 || resData.code === 403) {
        const UserStore = useUserStore();
        removeToken();
        UserStore.clearInfo();
        const router = getRouter();
        router?.push("/login");
        ElMessage.error(resData.message);
        return Promise.reject(new Error(resData.message || "登录已过期"));
      }

      if (resData.code && resData.code !== 200) {
        // 检查是否是忘记密码接口且code为10010001
        const isForgetPassword =
          response.config.url.includes("/username/forget");
        const isSpecialCase = isForgetPassword && resData.code === 10010001;

        // 如果不是特殊情况，就提示失败
        if (!isSpecialCase) {
          ElMessage.error(resData.message || "请求失败");
          return Promise.reject(new Error(resData.message || "请求失败"));
        }
      }
      return resData;
    },
    async (error: AxiosError) => {
      const status = error.response?.status || 500;

      if (status === 401 || status === 403) {
        const UserStore = useUserStore();
        removeToken();
        UserStore.clearInfo();
        const router = getRouter();
        router?.push("/login");
      }

      const customMessage = (error?.response?.data as Record<string, any>)
        ?.message;
      ElMessage.error(customMessage);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default getReqByProxyModule;
