import { ref } from "vue";
import { defineStore } from "pinia";
import { setToken } from "@/utils/auth";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore(
  "userState",
  () => {
    const router = useRouter();
    const route = useRoute();
    const userInfo = ref({
      username: "",
      email: "",
      accountType: "",
    });
    const userOrg = ref({
      userId: "",
      orgId: "",
      tenantId: "",
    });
    const roles = ref<string[]>(
      localStorage.roles ? JSON.parse(localStorage.roles) : []
    );
    const setUserEmail = (email: string) => {
      userInfo.value.email = email;
    };
    // const login = async (user: { username: string; password: string }) => {
    //   try {
    //     const res: Record<string, any> = await loginApi(user)
    //     if (res.code === 200 && res.message === 'success') {
    //       const token = res.data.token
    //       // setToken(token)
    //       // 解析 jwt
    //       const decoded = jwtDecode<
    //         JwtPayload & { tenantId: string; orgId: string; username: string }
    //       >(token)
    //       userOrg.tenantId = decoded.tenantId
    //       userOrg.orgId = decoded.orgId
    //       userOrg.userId = res.data.uid
    //       userInfo.username = decoded.username
    //     } else {
    //       ElMessage.error(res.data)
    //     }
    //     return Promise.resolve(res)
    //   } catch (error) {
    //     return Promise.reject(error)
    //   }
    // }
    const setLoginInfo = (
      token: string,
      uid: string,
      decoded: any,
      accountType: string
    ) => {
      setToken(token);
      userOrg.value.tenantId = decoded.tenantId;
      userOrg.value.orgId = decoded.orgId;
      userOrg.value.userId = uid;
      userInfo.value.username = decoded.username;
      userInfo.value.accountType = accountType;

      // 调试信息
      console.log("setLoginInfo 调用后，userInfo:", userInfo.value);
      console.log("setLoginInfo 调用后，userOrg:", userOrg.value);
      console.log(
        "localStorage 中的 userState:",
        localStorage.getItem("userState")
      );
    };
    const getRoles = () => {
      return new Promise<string[]>((resolve) => {
        roles.value = ["admin"];
        localStorage.roles = JSON.stringify(roles.value);
        resolve(roles.value);
      });
    };
    const getInfo = (newRoles: string[]) => {
      return new Promise<string[]>((resolve) => {
        roles.value = newRoles;
        resolve(newRoles);
      });
    };
    const clearInfo = () => {
      // 清空状态
      userInfo.value.username = "";
      userInfo.value.email = "";
      userOrg.value.userId = "";
      userOrg.value.orgId = "";
      userOrg.value.tenantId = "";
      roles.value = [];
      // 清空存储
      localStorage.clear();
      sessionStorage.clear();
    };
    /** 重置app状态，重新登录 */
    const resetApp = async () => {
      try {
        localStorage.clear();
        clearInfo();
        ElMessage({
          type: "success",
          message: "token失效，已自动登出",
        });
        router.push({ path: "/login", query: { redirect: route.path } });
      } catch (error: any) {
        console.error(`登出失败，失败原因：${error}`);
      }
    };
    return {
      userInfo,
      userOrg,
      roles,
      setUserEmail,
      setLoginInfo,
      getRoles,
      getInfo,
      clearInfo,
      resetApp,
    };
  },
  {
    // 持久化
    persist: {
      key: "userState",
      storage: window.localStorage,
    },
  }
);
