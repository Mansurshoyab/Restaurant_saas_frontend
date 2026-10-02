import { jwtDecode } from 'jwt-decode';
import type { AccessTokenPayload } from '@/types/auth.types';

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwtDecode<AccessTokenPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeAccessToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function hasPermission(userPermissions: string[], required: string | string[]): boolean {
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.some((p) => userPermissions.includes(p));
}


