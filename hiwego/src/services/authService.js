// src/services/authService.js
import api from '../utils/api';

const authService = {
  // 회원가입 (JSON 데이터 전송용 - 프로필 이미지 없을 때)
  signup: async (loginUserId, password, nickname) => {
    try {
      const response = await api.post('/api/v1/auth/signup', {
        loginUserId,
        password,
        nickname,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 로그인 (수정됨: loginUserId 사용)
  login: async (loginUserId, password) => { 
    try {
      const response = await api.post('/api/v1/auth/login', {
        loginUserId, // 백엔드 요구 사항: loginUserId 키 사용
        password,
      });
      
      // 토큰 저장 
      if (response.data.accessToken) { // Postman 응답 기반: accessToken 키 사용
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 

  // 로그아웃 (수정됨: 상대 경로 사용)
  logout: async () => {
    try {
      // api 인스턴스의 baseURL을 사용하여 상대 경로 호출
      await api.post('/api/v1/auth/logout'); 
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error.response?.data || error.message;
    }
  }, 

  // 사용자 정보 조회
  getProfile: async () => {
    try {
      const response = await api.get('/api/v1/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 

  // 사용자 정보 수정
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/v1/user/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 

  // 계정 삭제
  deleteAccount: async () => {
    try {
      const response = await api.delete('/api/v1/user/account');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error.response?.data || error.message;
    }
  },
};

export default authService;