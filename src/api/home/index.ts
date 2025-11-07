import getReqByProxyModule from "@/config/request";

import { PROXY } from "@/config/constants";
const userAxios = getReqByProxyModule({ proxyModule: PROXY.USER });

// 查询云产品状态
export const getCloudProductsApi = (): Promise<IPaginationResponse> => {
  return userAxios.get("/apis/v1/cloud/products");
};

// 开通云产品
export const openCloudProductsApi = (
  data: any
): Promise<IPaginationResponse> => {
  return userAxios.put("/apis/v1/cloud/products", data);
};

// 联系销售
export const inquiriesSalesApi = (data: any): Promise<IPaginationResponse> => {
  return userAxios.post("/apis/v1/cloud/products/sales/inquiries", data);
};
