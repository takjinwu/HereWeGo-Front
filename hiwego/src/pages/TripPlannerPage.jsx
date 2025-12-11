// src/pages/TripPlannerPage.jsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import KakaoMap from '../components/KakaoMap/KakaoMap';
import tourService from '../services/tourService';
import '../styles/TripPlannerPage.css';

// 백엔드 REGION_CODE_MAP (image_e05629)을 기반으로 권역명 변환 매핑 정보 정의
const REGION_GROUP_MAP = {
  '1': '수도권', '2': '수도권', '31': '수도권', 
  '32': '강원권',
  '3': '충청권', '8': '충청권', '33': '충청권', '34': '충청권',
  '5': '전라권', '37': '전라권', '38': '전라권',
  '4': '경상권', '6': '경상권', '7': '경상권', '35': '경상권', '36': '경상권',
  '39': '제주권'
};

// 상세 지역 이름 -> 코드 매핑 (역추적용)
const DETAILED_REGION_CODE_MAP = {
  '서울': '1', '인천': '2', '경기도': '31', '강원도': '32',
  '대전': '3', '세종': '8', '충북': '33', '충남': '34',
  '광주': '5', '전북': '37', '전남': '38',
  '대구': '4', '부산': '6', '울산': '7', '경북': '35', '경남': '36',
  '제주도': '39'
};

// 사용자에게 보이는 상세 지역 목록 (이름만 남김)
const detailedRegions = [
  { name: '서울'}, { name: '인천'}, { name: '경기도'}, { name: '강원도'},
  { name: '대전'}, { name: '세종'}, { name: '충북'}, { name: '충남'},
  { name: '광주'}, { name: '전북'}, { name: '전남'}, 
  { name: '대구'}, { name: '부산'}, { name: '울산'}, { name: '경북'}, { name: '경남'},
  { name: '제주도'}
];

const MAX_DAYS = 5;

const TripPlannerPage = () => {
  const [days, setDays] = useState(3); 
  const [selectedRegionNames, setSelectedRegionNames] = useState(Array(days).fill('')); 
  const [activeDay, setActiveDay] = useState(1);
  
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ [수정] 지역별 최대 갯수 및 전체 최대 갯수 상수 정의
  const MAX_SPOTS_PER_REGION = 1; // 각 지역에서 가져올 최대 갯수
  const TOTAL_MAX_SPOTS = 3;      // 최종적으로 보여줄 전체 최대 갯수

  useEffect(() => {
    setSelectedRegionNames(prev => {
        const newArr = Array(days).fill('');
        for(let i=0; i < Math.min(prev.length, days); i++) {
            newArr[i] = prev[i];
        }
        return newArr;
    });
  }, [days]);

  const handleRegionSelect = (dayIndex, name) => { 
    const newNames = [...selectedRegionNames];
    newNames[dayIndex] = name;
    setSelectedRegionNames(newNames);
  };

  const handleRecommend = async () => {
    const regionNameList = selectedRegionNames.filter(name => name.length > 0); 

    if (regionNameList.length < 2) {
      setError("최소 2개 이상의 날짜에 지역을 선택해주세요.");
      setResults([]);
      return;
    }

    // 2. 지역 이름(Name)을 권역명으로 변환
    const regionNamesForAPI = regionNameList.map(name => {
        const code = DETAILED_REGION_CODE_MAP[name]; 
        if (!code) {
             throw new Error(`유효하지 않은 지역 이름: ${name}`);
        }
        const regionGroup = REGION_GROUP_MAP[code]; 
        if (!regionGroup) {
            throw new Error(`지역 코드 ${code}에 대한 권역 매핑이 없습니다.`); 
        }
        return regionGroup; // 예: '수도권'
    });
    
    try {
      setLoading(true);
      setError(null);
      setResults([]);
      
      let allUniqueItems = [];
      const seenContentIds = new Set(); // ⭐ [중복 제거용 Set]

      // 3. 권역명 목록을 순서대로 순회하며 API를 각각 호출하고 결과를 합침
      for (const regionName of regionNamesForAPI) {
        // 단일 지역 API (getSpotsByRegion) 호출!
        const data = await tourService.getSpotsByRegion(regionName); 
        
        console.log(`📌 API 응답 [${regionName}]:`, data); 
        
        let extractedItems = [];
        // 데이터 추출 로직
        if (data?.list) { 
            extractedItems = data.list;
        } else if (data?.response?.body?.items?.item) {
            const rawItems = data.response.body.items.item;
            extractedItems = Array.isArray(rawItems) ? rawItems : [rawItems];
        } else if (Array.isArray(data)) {
            extractedItems = data;
        }

        // ⭐ [핵심 수정] 중복 제거 및 갯수 제한 로직
        // 지역별로 최대 1개의 고유한 항목을 찾습니다.
        let addedCount = 0;
        for (const item of extractedItems) {
            // contentId 또는 contentid 필드를 고유 키로 사용합니다.
            const id = item.contentId || item.contentid; 
            
            if (id && !seenContentIds.has(id)) {
                // 아직 추가되지 않은 고유한 항목일 경우
                allUniqueItems.push(item);
                seenContentIds.add(id);
                addedCount++;
            }
            // 지역당 1개만 가져오고 루프를 종료
            if (addedCount >= MAX_SPOTS_PER_REGION) { 
                break;
            }
        }
      }
      
      // ⭐ [수정] 총 갯수를 최종적으로 3개로 제한 (순서 유지)
      const finalResults = allUniqueItems.slice(0, TOTAL_MAX_SPOTS);

      if (finalResults.length > 0) {
        setResults(finalResults); 
      } else {
        setError("추천 여행지가 없습니다. (선택된 모든 지역에서 데이터 없음)");
      }

    } catch (err) {
      console.error("경로 추천 실패:", err);
      const serverErrorMessage = err.response?.data?.message || err.message;
      setError(`추천 정보를 불러오는 중 오류가 발생했습니다: ${serverErrorMessage}`); 
    } finally {
      setLoading(false);
    }
  };

  const routeAddresses = results
    .map(item => item.addr1 || item.address)
    .filter(addr => addr && addr.length > 0);

  const currentRegionNamesDisplay = selectedRegionNames
    .filter(name => name.length > 0);


  return (
    <Layout>
      <div className="trip-planner-container">
        <h1 className="planner-title">나만의 여행 만들기</h1>
        <p className="planner-subtitle">여행 기간과 지역 순서를 선택하면 최적의 여행지를 추천해 드립니다.</p>

        {/* 1. 기간 및 Day 탭 선택 섹션 */}
        <div className="day-select-section">
          <label htmlFor="day-count" className="day-label">총 여행 기간:</label>
          <select 
            id="day-count" 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="day-select"
          >
            {Array.from({ length: MAX_DAYS }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>

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
        </div>

        {/* 2. 지역 선택 드롭다운 섹션 */}
        <div className="region-select-area">
          <h3>Day {activeDay} 지역 선택 (선택 순서대로 경로가 정해집니다.)</h3>
          
          <select 
            value={selectedRegionNames[activeDay - 1]} 
            onChange={(e) => handleRegionSelect(activeDay - 1, e.target.value)}
            className="region-dropdown"
          >
            <option value="">-- 지역 선택 --</option>
            {/* name을 사용자에게 보여주고 name을 값으로 저장 */}
            {detailedRegions.map(region => (
              <option key={region.name} value={region.name}>{region.name}</option>
            ))}
          </select>
        </div>

        {/* 요약 출력: 이름으로 보여줍니다. */}
        <div className="summary-display">
          현재 경로: {currentRegionNamesDisplay.join(' → ') || '지역을 선택해주세요'}
        </div>

        {/* 3. 추천 버튼 */}
        <button 
          className="recommend-btn large"
          onClick={handleRecommend}
          disabled={loading || currentRegionNamesDisplay.length < 2} 
        >
          {loading ? '추천 중...' : '경로 추천 시작'}
        </button>

        {error && <div className="planner-error">{error}</div>}

        {/* 4. 지도 및 결과 표시 (하단은 동일) */}
        <div className="map-visualization">
          <h2>🗺️ 추천 관광지 지도</h2>
          {routeAddresses.length > 0 ? (
            <KakaoMap path={routeAddresses} />
          ) : (
            <div className="map-placeholder">경로를 추천하면 지도에 표시됩니다.</div>
          )}
        </div>

        {/* 결과 목록 */}
        <div className="results-list">
          <h2>📌 추천 여행지 목록 ({results.length}곳)</h2>
          
          {results.length > 0 ? (
            <ol className="spot-list">
              {results.map((spot, index) => (
                <li key={index} className="spot-item">
                  {/* 이미지 표시 */}
                  {spot.firstimage && (
                    <div className="spot-image-wrapper">
                      <img 
                        src={spot.firstimage} 
                        alt={spot.title} 
                        className="spot-image"
                      />
                    </div>
                  )}
                  
                  <span className="spot-number">{index + 1}</span>
                  <div className="spot-details">
                    <h3 className="spot-title">{spot.title}</h3> 
                    <p className="spot-addr">{spot.addr1 || spot.address}</p>
                    {/* 선택된 지역 이름을 표시 (지역당 1개만 가져오므로 순서대로 매핑) */}
                    <p className="spot-city">[{currentRegionNamesDisplay[index] || '지역 정보 없음'}]</p> 
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            !loading && !error && <p className="no-results-text">아직 추천 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TripPlannerPage;