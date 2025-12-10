import React, { useEffect, useState } from 'react';

const KakaoMap = ({ address, placeName, path }) => {
  const [mapUrl, setMapUrl] = useState('');

  // 길찾기 버튼 클릭 핸들러 (이 부분은 동일)
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
      level: 3,
    };
    // 매번 새 지도를 생성
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

    // 1️⃣ 단일 마커 모드 실행 (address가 있고 path가 없을 때)
    if (address && !path) {
      geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const y = result[0].y;
          const x = result[0].x;

          // 1. 마커 표시 (변수에 저장)
          const marker = new kakao.maps.Marker({ map: map, position: coords });

          // 2. 인포윈도우 표시
          if (placeName) {
            const infowindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;color:#000;text-align:center;">${placeName}</div>`,
            });
            infowindow.open(map, marker); // ⭐ 생성된 marker 객체 사용
          }
          map.setCenter(coords);

          // 3. ⭐[핵심] 길찾기 URL 생성 및 State 저장
          // https://map.kakao.com/link/to/장소명,위도,경도 (image_ec3a15.png 참조)
          const url = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${y},${x}`;
          setMapUrl(url); 
        } else {
          setMapUrl(''); // 주소 검색 실패 시 버튼 숨김
        }
      });
      return;
    } 
    
    // 2️⃣ 경로 모드 실행 (path 배열이 있을 때)
    else if (path && Array.isArray(path) && path.length > 0) {
      setMapUrl(''); // 경로 모드에서는 길찾기 버튼 숨김 (단일 장소가 아니므로)
      
      // ... (경로 그리는 Promise.all 로직: 주소-좌표 변환, Polyline, CustomOverlay)
      // 이 부분은 이전 코드와 동일하게 경로를 그립니다.
      
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
          const content = `<div style="background-color: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white;">${index + 1}</div>`;
          
          new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: content,
            yAnchor: 1
          });
          bounds.extend(coords);
        });
        
        if (validCoords.length >= 2) {
            const polyline = new kakao.maps.Polyline({
              path: validCoords,
              strokeWeight: 4,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeStyle: 'solid'
            });
            polyline.setMap(map);
        }
        
        map.setBounds(bounds);
      });
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

      {/* 대중교통 길찾기 버튼: mapUrl이 설정되었고, path 모드가 아닐 때만 표시 */}
      {mapUrl && !path && (
        <button
          onClick={handleFindWay}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#fae100', // 카카오 시그니처 노란색
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