// src/services/tourService.js

import api from '../utils/api';

const tourService = {
  // 1. 지역별 관광지 조회
  getSpotsByRegion: async (regionName) => {
    try {
      const response = await api.get(`/api/v1/tour/regionList?regionName=${encodeURIComponent(regionName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. 테마별 관광지 조회
  getSpotsByTheme: async (themeName) => {
    try {
      const response = await api.get(`/api/v1/tour/themeList?themeName=${encodeURIComponent(themeName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 3. 키워드 검색 (함수명 수정됨: searchSpots -> getSpotsByKeyword)
  getSpotsByKeyword: async (keyword) => {
    try {
      // 백엔드 파라미터가 query라고 하셨으므로 그대로 유지
      const response = await api.get(`/api/v1/tour/search/keyword?query=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 4. 상세 정보 조회
  getTourDetail: async (contentId) => {
    try {
      const response = await api.get(`/api/v1/tour/detail/common?contentId=${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default tourService;