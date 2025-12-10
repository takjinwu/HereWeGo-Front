// src/components/KakaoMap.jsx

import React, { useEffect } from 'react';

const KakaoMap = ({ address, placeName }) => {
  useEffect(() => {
    const { kakao } = window;

    if (!kakao || !address) return;

    const container = document.getElementById('map'); // 지도를 표시할 div
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심좌표 (제주)
      level: 3, // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체 생성
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색
    geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시 (선택사항)
        if (placeName) {
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;color:black;">${placeName}</div>`,
            });
            infowindow.open(map, marker);
        }

        // 지도의 중심을 결과값으로 받은 위치로 이동
        map.setCenter(coords);
      }
    });
  }, [address, placeName]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '400px',
        marginTop: '20px',
        borderRadius: '12px', // 디자인 요소
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // 디자인 요소
      }}
    ></div>
  );
};

export default KakaoMap;