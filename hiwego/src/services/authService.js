// src/services/authService.js
import api from '../utils/api';

const authService = {
  // 회원가입
  signup: async (email, password, nickname) => {
    try {
      const response = await api.post('/api/v1/auth/signup', {
        email,
        password,
        nickname,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 로그인
  login: async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });
      // 토큰 저장
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
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
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
