// src/services/tripService.js
import api from '../utils/api';

const tripService = {
  // 여행 일정 생성
  createTrip: async (tripData) => {
    console.log('🚀 POST /api/v1/trips 요청:', tripData);
    const response = await api.post('/api/v1/trips', tripData);
    console.log('✅ POST 응답:', response.data);
    return response.data;
  },

  // 여행 일정 조회
  getTrip: async (tripId) => {
    console.log(`🔍 GET /api/v1/trips/${tripId} 요청`);
    const response = await api.get(`/api/v1/trips/${tripId}`);
    console.log('✅ GET 응답:', response.data);
    return response.data;
  },

  // 내 여행 일정 목록 조회
  getMyTrips: async () => {
    console.log('📋 GET /api/v1/trips 요청 (내 여행 목록)');
    const response = await api.get('/api/v1/trips');
    console.log('✅ 내 여행 목록 응답:', response.data);
    return response.data;
  },

  // 여행 일정 수정
  updateTrip: async (tripId, tripData) => {
    console.log(`🔄 PUT /api/v1/trips/${tripId} 요청:`, tripData);
    const response = await api.put(`/api/v1/trips/${tripId}`, tripData);
    console.log('✅ PUT 응답:', response.data);
    return response.data;
  },

  // 여행 일정 삭제
  deleteTrip: async (tripId) => {
    console.log(`🗑️ DELETE /api/v1/trips/${tripId} 요청`);
    const response = await api.delete(`/api/v1/trips/${tripId}`);
    console.log('✅ DELETE 응답:', response.data);
    return response.data;
  },
};

export default tripService;
