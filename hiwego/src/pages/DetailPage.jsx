import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import KakaoMap from '../components/KakaoMap/KakaoMap';
import tourService from '../services/tourService';
import '../styles/DetailPage.css';

const DetailPage = () => {
  // 1. URL에서 :id (예: 3576903)를 가져옵니다.
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleCopyAddress = async (text) => {
    if (!text) return;
  
      await navigator.clipboard.writeText(text);
      alert('주소가 복사되었습니다! 📋');
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // ⭐ [핵심 수정] URL에서 가져온 id를 백엔드가 원하는 contentId 변수에 담습니다.
        const contentId = id; 
        
        console.log("백엔드로 보낼 contentId:", contentId);

        // 2. 서비스 호출 (이제 contentId가 들어갑니다)
        const data = await tourService.getTourDetail(contentId);
        
        console.log("API 응답 원본:", data); 

        // ⭐ 3. 데이터 껍질 까기 (공공데이터 구조: response -> body -> items -> item)
        let targetItem = null;

        // 데이터가 깊숙이 숨겨져 있으므로 안전하게 꺼냅니다.
        if (data?.response?.body?.items?.item) {
           const rawItem = data.response.body.items.item;
           
           // item이 배열([...])이면 첫 번째 것, 객체({...})면 그대로 사용
           targetItem = Array.isArray(rawItem) ? rawItem[0] : rawItem;
        } else if (data?.response?.body?.items) {
           // 가끔 구조가 다를 때를 대비
           targetItem = data.response.body.items;
        }

        if (targetItem) {
          console.log("화면에 뿌릴 최종 데이터:", targetItem);
          setItem(targetItem); 
        } else {
          console.error("데이터 구조를 찾을 수 없음:", data);
          // 데이터가 없어도 에러 띄우지 않고 빈 화면 방지
        }

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

        {/* 메인 이미지 */}
        {item.firstimage && (
          <div className="detail-image-wrapper">
            <img src={item.firstimage} alt={item.title} className="detail-image" />
          </div>
        )}

        <div className="detail-header">
          <h1 className="detail-title">{item.title}</h1>
          
          <div className="detail-info-group">
            <h3 className="info-label">주소</h3>
            {/* addr1이 없으면 address라도 보여주도록 처리 */}
            <p className="info-content">{item.addr1 || item.address || "주소 정보 없음"}</p>
          <button 
                  className="copy-btn"
                  onClick={() => handleCopyAddress(item.addr1 || item.address)}
                >
                  복사
          </button>
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
              {/* HTML 태그 제거 및 렌더링 */}
              <div 
                className="info-content" 
                dangerouslySetInnerHTML={{ __html: item.homepage }} 
              />
            </div>
          )}  
        </div>
        
        <hr className="divider" />

        {item.overview && (
          <div className="detail-section">
            <h3>소개</h3>
            <p className="detail-overview">{item.overview.replace(/<br\s*\/?>/gi, '\n')}</p>
          </div>
        )}

        {/* 지도 영역 */}
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