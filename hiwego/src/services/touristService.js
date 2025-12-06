// src/services/touristService.js
import api from '../utils/api'; 

const touristService = {
  // 1. 키워드 검색 API 연동
  getSpotsByKeyword: async (keyword) => {
    try {
      // 엔드포인트: /api/v1/tourist/search/keyword
      // 쿼리 파라미터: query (검색어)
      //이게로그//
      const token = localStorage.getItem('authToken') ? '토큰 존재' : '토큰 없음';
      console.log(`[Tourist API] 요청 시도: ${keyword}, 인증 상태: ${token}`);

      const response = await api.get('/api/v1/tourist/search/keyword', { 
        params: { query: keyword }
      });
      // 데이터가 list 또는 spots 필드에 담겨있다고 가정합니다.
      //이게로그//
      console.log(`[Tourist API] 성공! 상태 코드: ${response.status}`, response.data);
      return response.data.list || response.data.spots || response.data; 
    } catch (error) {
            
      
      //이게로그//
      console.error(`[Tourist API] API 호출 실패! 상태 코드: ${error.response?.status || '네트워크 오류'}`, error);
      throw error.response?.data || error.message;
    }
  },

  // 2. 특정 지역 목록 검색 API 연동
  getSpotsByRegion: async (regionName) => {
    try {
      // 엔드포인트: /api/v1/tourist/search/regionList
      // 쿼리 파라미터: regionName
      const response = await api.get('/api/v1/tourist/search/regionList', { 
        params: { regionName: regionName }
      });
      return response.data.list || response.data.spots || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // 3. 상세 정보 조회 API (컨텐츠 ID 기반)
  getSpotDetail: async (contentId) => {
    try {
      // 엔드포인트: /api/v1/tourist/detail/common
      // 쿼리 파라미터: contentId
      const response = await api.get('/api/v1/tourist/detail/common', {
        params: { contentId: contentId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default touristService;