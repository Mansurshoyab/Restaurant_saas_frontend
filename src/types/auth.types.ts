export interface AccessTokenPayload {
  userId: string;
  organizationId: string | null;
  branchId: string | null;
  roleId: string | null;
  role: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterPayload {
  restaurantName: string;
  ownerName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CurrentUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  organizationId: string;
  branchId: string;
  roleId: { _id: string; key: string; name: string; permissions: string[] } | null;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
}

