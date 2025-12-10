// src/services/reviewService.js
import api from '../utils/api';

const reviewService = {
  // 리뷰 목록 조회 (페이지네이션, 정렬)
  getReviews: async (page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      const params = {
        page,
        size,
        sort,
      };
      
      console.log('Review API params:', params);
      const response = await api.get('/api/v1/reviews', { params });
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

  // 댓글 작성
  createComment: async (reviewId, commentData) => {
    try {
      const response = await api.post(`/api/v1/reviews/comments/${reviewId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 댓글 목록 조회
  getComments: async (reviewId) => {
    try {
      const response = await api.get(`/api/v1/reviews/comments/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 댓글 수정
  updateComment: async (commentId, commentData) => {
    try {
      const response = await api.put(`/api/v1/reviews/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/api/v1/reviews/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default reviewService;
