// src/services/tourService.js
import api from '../utils/api';

const tourService = {
  // 키워드 검색
// src/services/tourService.js (getSpotsByKeyword 부분만 교체)
getSpotsByKeyword: async (keyword) => {
  try {
    console.log(`[Tour API] 요청 시도: ${keyword}`);
    const response = await api.get('/api/v1/tour/search/keyword', {
      params: { query: keyword }
    });

    // 디버그: 전체 응답 로그 (브라우저 콘솔에서 확인)
    console.log('[Tour API] raw response.data:', response.data);

    // 다양한 백엔드 응답 구조 대비 정규화
    let list = [];

    // 1) 흔한 케이스: response.data.list 또는 data.spots
    if (response.data?.list) {
      list = response.data.list;
    } else if (response.data?.spots) {
      list = response.data.spots;
    }
    // 2) 공공 API 스타일: response.data.response.body.items.item
    else if (response.data?.response?.body?.items?.item) {
      list = response.data.response.body.items.item;
    }
    // 3) 응답이 배열 자체일 때
    else if (Array.isArray(response.data)) {
      list = response.data;
    }
    // 4) fallback: response.data 자체가 객체(아이템 포함)
    else if (response.data) {
      // 시도: data.data, data.items 등
      list = response.data.data || response.data.items || response.data;
      if (!Array.isArray(list)) {
        // 마지막으로 객체 내부의 첫 배열을 찾아본다
        const firstArr = Object.values(response.data).find(v => Array.isArray(v));
        if (firstArr) list = firstArr;
      }
    }

    console.log('[Tour API] normalized list length:', (list||[]).length);
    return list || [];
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