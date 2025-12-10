// src/pages/DetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import KakaoMap from '../components/KakaoMap/KakaoMap'; // 경로 수정됨
import tourService from '../services/tourService'; // ⭐ 서비스 임포트 필수
import '../styles/DetailPage.css';

const DetailPage = () => {
  const { id } = useParams(); // URL에서 클릭한 장소의 id를 가져옴
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // ⭐ 1. 하드코딩된 더미 데이터 삭제함
        // ⭐ 2. 실제 API 호출: id(contentId)를 이용해 서버에 요청
        const data = await tourService.getTourDetail(id);
        
        console.log("상세 정보 데이터:", data); // 데이터 구조 확인용 로그

        // 백엔드 응답 구조에 따라 data.response.body.items.item[0] 등 경로가 다를 수 있음
        // 만약 data가 바로 객체라면 setItem(data);
        setItem(data); 

      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        setError("정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
        <Layout>
            <div className="detail-loading">정보를 불러오는 중입니다...</div>
        </Layout>
    );
  }

  if (error || !item) {
    return (
        <Layout>
            <div className="detail-error">{error || "정보를 찾을 수 없습니다."}</div>
            <button className="back-button" onClick={() => navigate(-1)}>뒤로 가기</button>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>

        {/* 메인 이미지 (필드명 확인 필요: firstimage, firstimage2 등) */}
        {item.firstimage && (
          <div className="detail-image-wrapper">
            <img src={item.firstimage} alt={item.title} className="detail-image" />
          </div>
        )}

        <div className="detail-header">
          <h1 className="detail-title">{item.title}</h1>
          
          <div className="detail-info-group">
            <h3 className="info-label">주소</h3>
            {/* ⭐ 실제 주소 데이터 필드명 사용 (addr1, address 등) */}
            <p className="info-content">{item.addr1 || item.address || "주소 정보 없음"}</p>
          </div>

          {item.tel && (
            <div className="detail-info-group">
              <h3 className="info-label">문의처</h3>
              <p className="info-content">{item.tel}</p>
            </div>
          )}
        
          {item.homepage && (
            <div className="detail-info-group">
              <h3 className="info-label">홈페이지</h3>
              {/* HTML 태그가 포함될 수 있으므로 단순 렌더링 또는 파싱 필요 */}
              <div className="info-content" dangerouslySetInnerHTML={{ __html: item.homepage }} />
            </div>
          )}
        </div>
        
        <hr className="divider" />

        {item.overview && (
          <div className="detail-section">
            <h3>소개</h3>
            <p className="detail-overview">{item.overview}</p>
          </div>
        )}

        {/* ⭐ 지도 영역: 실제 주소(addr1)가 들어가면 지도가 해당 위치로 뜹니다 */}
        <div className="detail-section map-section">
          <h3>위치 확인하기</h3>
          {(item.addr1 || item.address) ? (
              <KakaoMap 
                address={item.addr1 || item.address} 
                placeName={item.title} 
              />
          ) : (
              <p>지도 정보를 제공할 수 없습니다 (주소 정보 누락).</p>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default DetailPage;