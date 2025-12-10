// src/services/tourService.js

import api from '../utils/api';

// ⭐ [필수 추가] 권역명 변환을 위한 매핑 정보 정의 (TripPlannerPage.jsx와 동일해야 함)
const REGION_GROUP_MAP = {
  '1': '수도권', '2': '수도권', '31': '수도권', 
  '32': '강원권',
  '3': '충청권', '8': '충청권', '33': '충청권', '34': '충청권',
  '5': '전라권', '37': '전라권', '38': '전라권',
  '4': '경상권', '6': '경상권', '7': '경상권', '35': '경상권', '36': '경상권',
  '39': '제주권'
};

const tourService = {
  // 1. 지역별 관광지 조회 (단일 지역 API)
  getSpotsByRegion: async (regionName) => {
    try {
      const response = await api.get(`/api/v1/tour/regionList?regionName=${encodeURIComponent(regionName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. 테마별 관광지 조회 (누락된 함수 복원)
  getSpotsByTheme: async (themeName) => {
    try {
      const response = await api.get(`/api/v1/tour/themeList?themeName=${encodeURIComponent(themeName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 3. 키워드 검색 (누락된 함수 복원)
  getSpotsByKeyword: async (keyword) => {
    try {
      const response = await api.get(`/api/v1/tour/search/keyword?query=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 4. 상세 정보 조회 (누락된 함수 복원)
  getTourDetail: async (contentId) => {
    try {
      const response = await api.get(`/api/v1/tour/detail/common?contentId=${contentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ⭐ [경로 추천] 다중 지역 코드를 권역명으로 변환하여 GET 요청
  getRecommendedPath: async (codeList) => { 
    try {
      // 1. 숫자 코드 배열을 권역명 배열로 변환
      const regionNames = codeList.map(code => {
          const regionGroup = REGION_GROUP_MAP[code];
          if (!regionGroup) {
              throw new Error(`유효하지 않은 지역 코드입니다: ${code}`); 
          }
          return regionGroup;
      });
      
      // 2. 권역명 배열을 URL 쿼리 문자열로 변환
      const queryString = regionNames.map(name => `regionName=${encodeURIComponent(name)}`).join('&');
      
      const token = localStorage.getItem('authToken'); 
      
      console.log(`✈️ API 요청 시작: /api/v1/tour/regionList?${queryString}`);
      console.log("✈️ 요청 데이터 (권역명):", regionNames);

      // 3. GET 요청 실행
      const response = await api.get(`/api/v1/tour/regionList?${queryString}`, {
          headers: {
              ...(token && { Authorization: `Bearer ${token}` }), 
          }
      });
      
      console.log("✅ API 응답 성공! HTTP Status:", response.status);
      return response.data;

    } catch (error) {
      if (error.response) {
          console.error("❌ API 응답 실패! HTTP Status:", error.response.status);
          console.error("❌ 서버 오류 메시지 (Data):", error.response.data);
      } else {
          console.error("❌ 네트워크 오류:", error.message);
      }
      throw error.response?.data || error.message;
    }
  },
};

export default tourService;