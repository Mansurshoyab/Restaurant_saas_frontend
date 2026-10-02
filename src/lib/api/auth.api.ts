import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  AuthTokens,
  ChangePasswordPayload,
  CurrentUser,
  LoginPayload,
  RegisterPayload,
  RequestOtpPayload,
  VerifyOtpPayload,
} from '@/types/auth.types';

interface RegisterResponse extends AuthTokens {
  organization: { _id: string; name: string };
  branch: { _id: string; name: string };
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', payload).then((r) => r.data.data),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/login', payload).then((r) => r.data.data),

  requestOtp: (payload: RequestOtpPayload) =>
    apiClient.post<ApiResponse<null>>('/auth/otp/request', payload).then((r) => r.data),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/otp/verify', payload).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }).then((r) => r.data.data),

  logout: (refreshToken: string) =>
    apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken }).then((r) => r.data),

  logoutAll: () => apiClient.post<ApiResponse<null>>('/auth/logout-all').then((r) => r.data),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.post<ApiResponse<null>>('/auth/change-password', payload).then((r) => r.data),

  me: () => apiClient.get<ApiResponse<CurrentUser>>('/auth/me').then((r) => r.data.data),
};


