// src/context/TripContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  // 패널 열림/닫힘 상태
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // 여행 일정 데이터
  const [tripTitle, setTripTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [schedules, setSchedules] = useState({}); // { 1: [...], 2: [...] } day별 일정
  
  // 현재 편집 중인 여행 ID (수정 모드일 때)
  const [editingTripId, setEditingTripId] = useState(null);

  // 날짜 수 계산 (몇박 몇일)
  const calculateDays = () => {
    if (!startDate || !endDate) return { nights: 0, days: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return { nights: diffDays - 1, days: diffDays };
  };

  // 날짜가 변경되면 일정 초기화
  useEffect(() => {
    if (startDate && endDate) {
      const { days } = calculateDays();
      const newSchedules = {};
      for (let i = 1; i <= days; i++) {
        newSchedules[i] = schedules[i] || [];
      }
      setSchedules(newSchedules);
    }
  }, [startDate, endDate]);

  // 일정에 장소 추가
  const addPlaceToDay = (day, place) => {
    setSchedules(prev => {
      const daySchedule = prev[day] || [];
      // 중복 체크
      const exists = daySchedule.some(p => p.placeName === place.placeName);
      if (exists) {
        alert('이미 추가된 장소입니다.');
        return prev;
      }
      return {
        ...prev,
        [day]: [...daySchedule, { 
          ...place, 
          order: daySchedule.length 
        }]
      };
    });
  };

  // 일정에서 장소 삭제
  const removePlaceFromDay = (day, placeIndex) => {
    setSchedules(prev => {
      const daySchedule = [...(prev[day] || [])];
      daySchedule.splice(placeIndex, 1);
      // order 재정렬
      const reordered = daySchedule.map((p, idx) => ({ ...p, order: idx }));
      return { ...prev, [day]: reordered };
    });
  };

  // 일정 내 장소 순서 변경
  const reorderPlaceInDay = (day, fromIndex, toIndex) => {
    setSchedules(prev => {
      const daySchedule = [...(prev[day] || [])];
      const [removed] = daySchedule.splice(fromIndex, 1);
      daySchedule.splice(toIndex, 0, removed);
      // order 재정렬
      const reordered = daySchedule.map((p, idx) => ({ ...p, order: idx }));
      return { ...prev, [day]: reordered };
    });
  };

  // 전체 일정 초기화
  const resetTrip = () => {
    setTripTitle('');
    setStartDate(null);
    setEndDate(null);
    setSchedules({});
    setEditingTripId(null);
  };

  // 저장용 데이터 포맷
  const getTripData = () => {
    const allSchedules = [];
    Object.keys(schedules).forEach(day => {
      schedules[day].forEach(place => {
        allSchedules.push({
          day: parseInt(day),
          order: place.order,
          placeId: place.placeId || `PLACE_${Date.now()}_${place.order}`,
          placeName: place.placeName
        });
      });
    });

    return {
      title: tripTitle,
      startDate: startDate,
      endDate: endDate,
      schedules: allSchedules
    };
  };

  // 기존 일정 불러오기
  const loadTrip = (tripData) => {
    setEditingTripId(tripData.id);
    setTripTitle(tripData.title);
    setStartDate(tripData.startDate);
    setEndDate(tripData.endDate);
    
    // schedules를 day별로 그룹핑
    const groupedSchedules = {};
    tripData.schedules.forEach(schedule => {
      if (!groupedSchedules[schedule.day]) {
        groupedSchedules[schedule.day] = [];
      }
      groupedSchedules[schedule.day].push({
        placeId: schedule.placeId,
        placeName: schedule.placeName,
        order: schedule.order
      });
    });
    
    // 각 day 내에서 order로 정렬
    Object.keys(groupedSchedules).forEach(day => {
      groupedSchedules[day].sort((a, b) => a.order - b.order);
    });
    
    setSchedules(groupedSchedules);
  };

  const value = {
    isPanelOpen,
    setIsPanelOpen,
    tripTitle,
    setTripTitle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    schedules,
    setSchedules,
    editingTripId,
    calculateDays,
    addPlaceToDay,
    removePlaceFromDay,
    reorderPlaceInDay,
    resetTrip,
    getTripData,
    loadTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
