// src/services/tourService.js

import api from '../utils/api';

const tourService = {
  // ⭐ [복구됨] 지역별 관광지 조회 (HomePage에서 사용)
  getSpotsByRegion: async (regionName) => {
    try {
      // API 명세에 따라 쿼리 파라미터 전송
      const response = await api.get(`/api/v1/tour/regionList?regionName=${encodeURIComponent(regionName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // [복구됨] 테마별 관광지 조회
  getSpotsByTheme: async (themeName) => {
    try {
      const response = await api.get(`/api/v1/tour/themeList?themeName=${encodeURIComponent(themeName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // [복구됨] 검색 기능
  searchSpots: async (keyword) => {
      try {
          const response = await api.get(`/api/v1/tour/search?keyword=${encodeURIComponent(keyword)}`);
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },

  // 상세 정보 조회 (DetailPage 사용)
  getTourDetail: async (contentId) => {
    try {
      const response = await api.get(`/api/v1/tour/detail/${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default tourService;