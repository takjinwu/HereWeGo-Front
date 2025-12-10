// src/components/KakaoMap.jsx

import React, { useEffect, useState } from 'react';

const KakaoMap = ({ address, placeName, path }) => {
  const [mapUrl, setMapUrl] = useState(''); 

  // 길찾기 버튼 클릭 핸들러 (단일 주소 모드에서 사용)
  const handleFindWay = () => {
    if (mapUrl) {
      window.open(mapUrl, '_blank');
    } else {
      alert("위치 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 2,
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

    // 2️⃣ 경로 모드 실행 (path 배열이 있을 때)
    if (path && Array.isArray(path) && path.length > 0) {
      setMapUrl(''); // 경로 모드에서는 길찾기 버튼 숨김
      
      const promises = path.map((addr) => {
        return new Promise((resolve) => {
          geocoder.addressSearch(addr, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              resolve(new kakao.maps.LatLng(result[0].y, result[0].x));
            } else {
              resolve(null); 
            }
          });
        });
      });

      Promise.all(promises).then((results) => {
        const validCoords = results.filter((c) => c !== null);
        
        if (validCoords.length < 1) return;

        const bounds = new kakao.maps.LatLngBounds();

        validCoords.forEach((coords, index) => {
          // (1) 커스텀 오버레이로 순번 마커 표시 (클래식한 지도 마커 대신 모던한 원형 마커 사용)
          const content = `
            <div style="
              background-color: #3b82f6; 
              color: white; 
              width: 28px; /* 크기 약간 키움 */
              height: 28px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: 700; /* 폰트 두껍게 */
              font-size: 16px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.25); /* 그림자 강조 */
              border: 3px solid #ffffff; /* 흰색 테두리 추가 */
              transform: translate(-50%, -100%); /* 중심 위치 조정 */
            ">
              ${index + 1}
            </div>
          `;
          
          new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: content,
            yAnchor: 0 // yAnchor 조정 (CSS에서 transform으로 대체)
          });

          bounds.extend(coords);
        });
        
        // ❌ Polyline (선 그리기) 코드는 완전히 제거함 ❌

        // (3) 지도 범위 확정 (모든 마커가 보이도록)
        map.setBounds(bounds);
      });
      
    } 
    
    // 1️⃣ 단일 마커 모드 실행 (address가 있고 path가 없을 때)
    else if (address) {
      geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const y = result[0].y;
          const x = result[0].x;

          // 마커 표시
          const marker = new kakao.maps.Marker({ map: map, position: coords });

          // 인포윈도우 표시
          if (placeName) {
            const infowindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;color:#000;text-align:center;">${placeName}</div>`,
            });
            infowindow.open(map, marker); 
          }
          map.setCenter(coords);

          // 길찾기 URL 생성 및 State 저장 (버튼 표시 활성화)
          const url = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${y},${x}`;
          setMapUrl(url); 
        } else {
          setMapUrl(''); // 주소 검색 실패 시 버튼 숨김
        }
      });
    } else {
        setMapUrl('');
    }

  }, [address, placeName, path]);

  return (
    <div style={{ width: '100%' }}>
      {/* 지도 영역 */}
      <div
        id="map"
        style={{
          width: '100%',
          height: '400px',
          marginTop: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      ></div>

      {/* 대중교통 길찾기 버튼: 단일 주소 모드에서만 표시 */}
      {mapUrl && !path && (
        <button
          onClick={handleFindWay}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#fae100',
            color: '#3b1e1e',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#fceb5a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fae100'}
        >
          🚦 카카오맵으로 길찾기 (시간 확인)
        </button>
      )}
    </div>
  );
};

export default KakaoMap;