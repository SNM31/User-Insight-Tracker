// src/utils/tokenUtils.ts
export const isTokenValid = (token: string): boolean => {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const expiry = payload.exp;
     const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return expiry > currentTime;
  } catch (err) {
    console.error("Invalid token format", err);
    return false;
  }
};
