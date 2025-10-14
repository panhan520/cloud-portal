export interface LoginParams {
  username: string;
  password: string;
  email?: string;
  type?: string;
  phone?: string; // 预留：手机号
}

export interface LoginResponse {
  token: string;
  expiresIn?: number; // 秒
  user?: {
    id: string;
    name: string;
    email?: string;
    // 其他用户信息
  };
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
