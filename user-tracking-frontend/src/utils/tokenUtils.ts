// src/utils/tokenUtils.ts
export interface JwtPayload {
  exp?: number;
  role?: string;
  scope?: string;
  sub?: string;
  [key: string]: unknown;
}

const decodeJwtSegment = (segment: string) => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
};

export const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) {
      return null;
    }

    return JSON.parse(decodeJwtSegment(payloadBase64)) as JwtPayload;
  } catch (err) {
    console.error('Invalid token format', err);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  const payload = getTokenPayload(token);
  if (!payload?.exp) {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
};

export const getDashboardRole = (token: string | null): string | null => {
  if (!token) {
    return null;
  }

  const role = getTokenPayload(token)?.role;
  if (typeof role !== 'string' || role.trim() === '') {
    return null;
  }

  if (role.startsWith('ROLE_')) {
    return role;
  }

  return `ROLE_${role}`;
};
