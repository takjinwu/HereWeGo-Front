import api from '../utils/api';

const authService = {
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
      
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
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
      const response = await api.get('/api/v1/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ⭐ [수정됨] 관리자 - 회원 목록 조회 (헤더 강제 주입)
  getUsers: async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get('/api/v1/admin/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
  // ⭐ [수정됨] 관리자 - 회원 삭제 (헤더 강제 주입)
  adminDeleteUser: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.delete(`/api/v1/admin/delete-user/${userId}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }); 
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

  // 닉네임 수정
  updateNickname: async (userName) => {
    try {
      const response = await api.put('/api/v1/user/nickname', { userName });
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

  // 계정 삭제
  deleteAccount: async () => {
    try {
      const response = await api.delete('/api/v1/auth/deleteaccount');
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