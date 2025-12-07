// src/services/tourService.js
import api from '../utils/api';

const tourService = {
  // 키워드 검색
  getSpotsByKeyword: async (keyword) => {
    try {
      const response = await api.get('/api/v1/tour/search/keyword', {
        params: { query: keyword }
      });
      return response.data.list || response.data.spots || response.data;
    } catch (error) {
      console.error(`[Tour API] API 호출 실패!`, error.response || error.message);
      throw error.response?.data || error.message;
    }
  },

  // 특정 지역 목록 검색
  getSpotsByRegion: async (regionName) => {
    try {
      const response = await api.get('/api/v1/tour/regionList', {
        params: { regionName }
      });
      return response.data.list || response.data.spots || response.data;
    } catch (error) {

    }
  },

  // 상세 정보 조회
  getSpotDetail: async (contentId) => {
    try {
      const response = await api.get('/api/v1/tour/detail/common', {
        params: { contentId }
      });
      return response.data;
    } catch (error) {
      console.error('[Tour API] getSpotDetail 실패', error.response || error.message);
      throw error.response?.data || error.message;
    }
  }
};

export default tourService;