export interface LoginParams {
  username: string;
  password: string;
  email?: string;
  type?: string;
  phone?: string; // 预留：手机号
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
export interface getCodeParams {
  channel?: string;
  recipient: string;
  type: string;
}
export interface registryParams {
  username: string;
  email: string;
  password: string;
  type?: string;
  code?: string;
}

export interface verifyCodeParams {
  recipient: string;
  code: string;
  type: string;
}
