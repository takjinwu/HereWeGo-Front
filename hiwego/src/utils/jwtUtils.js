// src/utils/jwtUtils.js

export const decodeTokenPayload = (token) => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // URL Safe Base64 문자열을 표준 Base64로 변환
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // atob()를 사용하여 디코딩 (브라우저 내장 함수)
    // 한글 등 유니코드 문자가 깨지는 것을 방지하기 위해 URI 컴포넌트로 변환 후 디코딩
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token decoding failed:", e);
    return null;
  }
};