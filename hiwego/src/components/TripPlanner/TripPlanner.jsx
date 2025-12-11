// src/components/TripPlanner/TripPlanner.jsx
import React, { useState, useEffect } from 'react';
import { useTripContext } from '../../context/TripContext';
import tripService from '../../services/tripService';
import './TripPlanner.css';

const TripPlanner = () => {
  const {
    isPanelOpen,
    setIsPanelOpen,
    tripTitle,
    setTripTitle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    schedules,
    calculateDays,
    addPlaceToDay,
    removePlaceFromDay,
    reorderPlaceInDay,
    resetTrip,
    getTripData,
    editingTripId,
    loadTrip,
  } = useTripContext();

  const [myTrips, setMyTrips] = useState([]);
  const [showMyTrips, setShowMyTrips] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);

  const isLoggedIn = !!localStorage.getItem('authToken');
  const { nights, days } = calculateDays();

  // 내 여행 목록 불러오기
  const fetchMyTrips = async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setMyTrips(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error('여행 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPanelOpen && isLoggedIn) {
      fetchMyTrips();
    }
  }, [isPanelOpen, isLoggedIn]);

  // 여행 저장
  const handleSaveTrip = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!tripTitle.trim()) {
      alert('여행 제목을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      alert('여행 날짜를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const tripData = getTripData();
      
      console.log('📤 전송할 여행 데이터:', JSON.stringify(tripData, null, 2));
      console.log('🔑 토큰:', localStorage.getItem('authToken') ? '존재' : '없음');
      
      if (editingTripId) {
        const result = await tripService.updateTrip(editingTripId, tripData);
        console.log('✅ 수정 성공:', result);
        alert('여행 일정이 수정되었습니다.');
      } else {
        const result = await tripService.createTrip(tripData);
        console.log('✅ 저장 성공:', result);
        alert('여행 일정이 저장되었습니다.');
      }
      
      fetchMyTrips();
      resetTrip();
    } catch (error) {
      console.error('❌ 여행 저장 실패:', error);
      console.error('❌ 에러 응답:', error.response?.data);
      console.error('❌ 에러 상태:', error.response?.status);
      
      if (error.response?.status === 403) {
        alert('권한이 없습니다. 로그인을 다시 해주세요.');
      } else if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else {
        alert(`여행 저장에 실패했습니다: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 여행 불러오기
  const handleLoadTrip = async (tripId) => {
    try {
      setLoading(true);
      const tripData = await tripService.getTrip(tripId);
      loadTrip(tripData);
      setShowMyTrips(false);
      setActiveDay(1);
    } catch (error) {
      console.error('여행 불러오기 실패:', error);
      alert('여행 일정을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 여행 삭제
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('정말로 이 여행 일정을 삭제하시겠습니까?')) return;
    
    try {
      setLoading(true);
      await tripService.deleteTrip(tripId);
      alert('여행 일정이 삭제되었습니다.');
      fetchMyTrips();
      if (editingTripId === tripId) {
        resetTrip();
      }
    } catch (error) {
      console.error('여행 삭제 실패:', error);
      alert('여행 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e, day, index) => {
    setDraggedItem({ day, index });
    e.dataTransfer.effectAllowed = 'move';
    // 시각적 피드백을 위해 클래스 추가
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    // 드래그 종료 시 스타일 원복
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // 외부에서 드래그하는 경우와 내부 순서 변경을 구분
    if (draggedItem) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleItemDragEnter = (e) => {
    // 드래그 오버 시 시각적 피드백
    if (draggedItem) {
      e.currentTarget.style.borderTop = '3px solid #667eea';
    }
  };

  const handleItemDragLeave = (e) => {
    // 드래그 나갈 때 스타일 제거
    e.currentTarget.style.borderTop = '';
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 특정 Day의 날짜 계산
  const getDayDate = (dayNum) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNum - 1);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}.${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  return (
    <>
      {/* 토글 버튼 */}
      <button 
        className={`trip-toggle-btn ${isPanelOpen ? 'open' : ''}`}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? '✕' : '📅'}
        {!isPanelOpen && <span className="toggle-label">여행 일정</span>}
      </button>

      {/* 사이드 패널 */}
      <div className={`trip-planner-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>🗓️ 여행 일정 플래너</h2>
          {editingTripId && (
            <span className="editing-badge">수정 중</span>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="login-required">
            <p>여행 일정을 만들려면 로그인이 필요합니다.</p>
            <a href="/login" className="login-link">로그인하기</a>
          </div>
        ) : (
          <>
            {/* 내 여행 목록 토글 */}
            <div className="my-trips-section">
              <button 
                className="my-trips-toggle"
                onClick={() => setShowMyTrips(!showMyTrips)}
              >
                📂 내 여행 목록 {showMyTrips ? '▲' : '▼'}
              </button>
              
              {showMyTrips && (
                <div className="my-trips-list">
                  {loading ? (
                    <p className="loading-text">불러오는 중...</p>
                  ) : myTrips.length > 0 ? (
                    myTrips.map(trip => (
                      <div key={trip.id} className="my-trip-item">
                        <div className="trip-info" onClick={() => handleLoadTrip(trip.id)}>
                          <span className="trip-name">{trip.title}</span>
                          <span className="trip-date">{trip.startDate} ~ {trip.endDate}</span>
                        </div>
                        <button 
                          className="delete-trip-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTrip(trip.id);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-trips">저장된 여행이 없습니다.</p>
                  )}
                </div>
              )}
            </div>

            {/* 여행 제목 입력 */}
            <div className="trip-title-section">
              <input
                type="text"
                className="trip-title-input"
                placeholder="여행 제목을 입력하세요"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
              />
            </div>

            {/* 날짜 선택 */}
            <div className="date-section">
              <div className="date-picker">
                <label>출발일</label>
                <input
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-picker">
                <label>도착일</label>
                <input
                  type="date"
                  value={endDate || ''}
                  min={startDate || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* 몇박 몇일 표시 */}
            {days > 0 && (
              <div className="trip-duration">
                <span className="duration-badge">
                  {nights > 0 ? `${nights}박 ${days}일` : '당일치기'}
                </span>
              </div>
            )}

            {/* Day별 일정 */}
            {days > 0 && (
              <div className="schedule-section">
                {/* Day 탭 */}
                <div className="day-tabs">
                  {Array.from({ length: days }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      className={`day-tab ${activeDay === day ? 'active' : ''}`}
                      onClick={() => setActiveDay(day)}
                    >
                      Day {day}
                    </button>
                  ))}
                </div>

                {/* 선택된 Day 일정 */}
                <div className="day-schedule">
                  <div className="day-header">
                    <h3>Day {activeDay}</h3>
                    <span className="day-date">{getDayDate(activeDay)}</span>
                  </div>

                  <div 
                    className="schedule-list"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.preventDefault();
                      const placeData = e.dataTransfer.getData('application/json');
                      if (placeData) {
                        try {
                          const place = JSON.parse(placeData);
                          addPlaceToDay(activeDay, place);
                        } catch (error) {
                          console.error('드래그 데이터 파싱 실패:', error);
                        }
                      }
                      setDraggedItem(null);
                    }}
                  >
                    {schedules[activeDay]?.length > 0 ? (
                      schedules[activeDay].map((place, index) => (
                        <div
                          key={`${place.placeName}-${index}`}
                          className="schedule-item"
                          draggable
                          onDragStart={(e) => handleDragStart(e, activeDay, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDragEnter={handleItemDragEnter}
                          onDragLeave={handleItemDragLeave}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.borderTop = '';
                            
                            // 외부에서 드래그한 경우 (새 장소 추가)
                            const placeData = e.dataTransfer.getData('application/json');
                            if (placeData && !draggedItem) {
                              try {
                                const place = JSON.parse(placeData);
                                addPlaceToDay(activeDay, place);
                              } catch (error) {
                                console.error('드래그 데이터 파싱 실패:', error);
                              }
                            } 
                            // 내부에서 순서 변경 (같은 Day 내에서만)
                            else if (draggedItem && draggedItem.day === activeDay && draggedItem.index !== index) {
                              reorderPlaceInDay(activeDay, draggedItem.index, index);
                            }
                            setDraggedItem(null);
                          }}
                        >
                          <div className="item-order">{index + 1}</div>
                          <div className="item-content">
                            <span className="item-name">{place.placeName}</span>
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() => removePlaceFromDay(activeDay, index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div 
                        className="empty-schedule"
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const placeData = e.dataTransfer.getData('application/json');
                          if (placeData) {
                            try {
                              const place = JSON.parse(placeData);
                              addPlaceToDay(activeDay, place);
                            } catch (error) {
                              console.error('드래그 데이터 파싱 실패:', error);
                            }
                          }
                        }}
                      >
                        <p>🎯 여행지를 드래그하여 추가하세요</p>
                        <p className="hint">추천 페이지에서 원하는 여행지를 끌어다 놓으세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="action-buttons">
              <button 
                className="btn-reset"
                onClick={resetTrip}
              >
                초기화
              </button>
              <button 
                className="btn-save"
                onClick={handleSaveTrip}
                disabled={loading || !tripTitle || !startDate || !endDate}
              >
                {loading ? '저장 중...' : editingTripId ? '수정하기' : '저장하기'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* 오버레이 (모바일) */}
      {isPanelOpen && (
        <div 
          className="panel-overlay"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </>
  );
};

export default TripPlanner;
