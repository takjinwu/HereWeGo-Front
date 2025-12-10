// src/services/attractionService.js
import api from '../utils/api';

const attractionService = {
  // 지역별 목록 조회 (수정됨: regionName 파라미터 추가)
  getRegionList: async (regionName) => {
    try {
      const response = await api.get('/api/v1/tour/regionList', {
        params: { regionName } // 명세에 따라 regionName 파라미터 추가
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 투어 검색 (키워드)
  searchByKeyword: async (keyword) => {
    try {
      const response = await api.get('/api/v1/tour/search/keyword', {
        params: { query: keyword }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 해시태그 기반 여행지 추천
  searchByHashtags: async (hashtags) => {
    try {
      // hashtags는 배열로 받아서 콤마로 구분된 문자열로 변환
      const hashtagString = Array.isArray(hashtags) ? hashtags.join(',') : hashtags;
      const response = await api.get('/api/v1/tour/search-tags', {
        params: { hashtags: hashtagString }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 축제 검색
  searchFestival: async () => {
    try {
      const response = await api.get('/api/v1/festival/search');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 투어 상세 정보 조회
  getTourDetail: async (tourId) => {
    try {
      const response = await api.get('/api/v1/tour/detail/common', {
        params: { contentId: tourId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 리뷰 목록 조회
  getReviews: async (tourId) => {
    try {
      const response = await api.get('/api/v1/reviews', {
        params: { id: tourId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 리뷰 상세 조회
  getReviewDetail: async (reviewId) => {
    try {
      const response = await api.get(`/api/v1/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 리뷰 작성
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/api/v1/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 리뷰 수정
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/api/v1/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 리뷰 삭제
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/api/v1/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default attractionService;
