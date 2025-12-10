// src/services/authService.js
import api from '../utils/api';

const authService = {

  // [관리자] 회원 전체 목록 조회
  getUsers: async () => {
      try {
        const response = await api.get('/api/v1/user/users');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

  // [관리자] 회원 강제 탈퇴
  adminDeleteUser: async (userId) => {
      try {
        // 1. 명세에 따라 정확한 경로와 메서드(DELETE) 사용
        const response = await api.delete(`/api/v1/admin/delete-user/${userId}`);
        return response.data;
      } catch (error) {
        // 2. 403 오류 발생 시 더 구체적인 메시지 전달
        if (error.response?.status === 403) {
          throw new Error("관리자 권한이 부족하거나 토큰이 만료되었습니다. (403 Forbidden)");
        }
        throw error.response?.data || error.message;
      }
    },
  // 회원가입
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

  // 로그인
  login: async (loginUserId, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', {
        loginUserId,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        console.log('Token saved to localStorage');
        
        // user 정보가 응답에 포함되어 있다면 저장
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('User info saved to localStorage:', response.data.user);
        } else {
            console.warn('User info not found in login response');
        }
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
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // 성공하든 실패하든 로컬 정보 삭제
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // 사용자 정보 조회
  getProfile: async () => {
    try {
      const response = await api.get('/api/v1/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 닉네임 수정 (함수명 updateNickname으로 변경, 파라미터 구조 확인)
  updateNickname: async (payload) => {
    try {
      // payload는 { newNickname: "변경할닉네임" } 형태여야 함
      const response = await api.put('/api/v1/user/nickname', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 비밀번호 수정
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/v1/user/password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 계정 삭제 (비밀번호 확인 포함)
  deleteAccountWithPassword: async (password) => {
    try {
      // DELETE 메서드에 body(비밀번호)를 포함하여 전송
      const response = await api.delete('/api/v1/auth/deleteaccount', {
        data: { password } 
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // (구버전 호환용) 단순 삭제
  deleteAccount: async () => {
      try {
        const response = await api.delete('/api/v1/auth/deleteaccount');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
  }
};

export default authService;