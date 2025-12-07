// src/pages/DetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import attractionService from '../services/attractionService';
import '../styles/DetailPage.css';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[DetailPage] contentId:', id);
        
        if (!id) {
          setError('유효하지 않은 관광지 ID입니다.');
          setLoading(false);
          return;
        }
        
        // API: GET /api/v1/tour/detail/common?contentId=123
        const data = await attractionService.getTourDetail(id);
        console.log('[DetailPage] 상세정보 API 응답 전체:', data);
        console.log('[DetailPage] 응답 타입:', typeof data);
        
        // 응답 구조 상세 로깅
        if (data.response) {
          console.log('[DetailPage] response 있음:', data.response);
          console.log('[DetailPage] response.body:', data.response.body);
          console.log('[DetailPage] response.body.items:', data.response.body?.items);
          console.log('[DetailPage] response.body.items 타입:', typeof data.response.body?.items);
        }
        
        // 다양한 응답 구조에 대응
        let detailData = null;
        
        // 1. API 명세: response.body.items.item[0]
        if (data.response?.body?.items?.item?.[0]) {
          detailData = data.response.body.items.item[0];
          console.log('[DetailPage] 파싱 경로: response.body.items.item[0]');
        }
        // 2. response.body.items가 배열이면
        else if (Array.isArray(data.response?.body?.items) && data.response.body.items.length > 0) {
          detailData = data.response.body.items[0];
          console.log('[DetailPage] 파싱 경로: response.body.items[0] (배열)');
        }
        // 3. response.body.item이 있으면
        else if (data.response?.body?.item) {
          detailData = Array.isArray(data.response.body.item) ? data.response.body.item[0] : data.response.body.item;
          console.log('[DetailPage] 파싱 경로: response.body.item');
        }
        // 4. 기타 경로들
        else if (data.item) {
          detailData = data.item;
          console.log('[DetailPage] 파싱 경로: data.item');
        }
        else if (data.items?.[0]) {
          detailData = data.items[0];
          console.log('[DetailPage] 파싱 경로: data.items[0]');
        }
        else if (typeof data === 'object' && data.title) {
          detailData = data;
          console.log('[DetailPage] 파싱 경로: data (직접)');
        }
        else {
          console.warn('[DetailPage] ⚠️ 데이터를 찾을 수 없음! API 응답 구조 확인 필요');
          detailData = data;
        }
        
        console.log('[DetailPage] 파싱된 상세정보:', detailData);
        
        if (!detailData || Object.keys(detailData).length === 0) {
          setError('관광지 정보를 찾을 수 없습니다. API 응답이 비어있습니다.');
        } else {
          setAttraction(detailData);
        }
      } catch (err) {
        setError('관광지 정보를 불러올 수 없습니다.');
        console.error('Error fetching detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="detail-page">
          <div className="detail-loading">로딩 중입니다...</div>
        </div>
      </Layout>
    );
  }

  if (error || !attraction) {
    return (
      <Layout>
        <div className="detail-page">
          <div className="detail-error">
            <p>{error || '관광지 정보를 찾을 수 없습니다.'}</p>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
          </div>
        </div>
      </Layout>
    );
  }

  // 데이터 필드명 호환성 처리
  const imageUrl = attraction.firstimage || attraction.firstImage || '';
  const title = attraction.title || attraction.name || '';
  const address = attraction.addr1 || attraction.address || '';
  const description = attraction.overview || attraction.description || '';
  const tel = attraction.tel || '';
  const category = attraction.cat3 || attraction.category || '';

  return (
    <Layout>
      <div className="detail-page">
        <div className="detail-container">
          {/* 헤더 */}
          <div className="detail-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 돌아가기
            </button>
          </div>

          {/* 메인 이미지 */}
          <div className="detail-image-section">
            {imageUrl ? (
              <img src={imageUrl} alt={title} />
            ) : (
              <div className="no-image">이미지 없음</div>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="detail-info">
            <h1 className="detail-title">{title}</h1>

            {address && (
              <div className="detail-section">
                <h3>주소</h3>
                <p>{address}</p>
              </div>
            )}

            {tel && (
              <div className="detail-section">
                <h3>연락처</h3>
                <p>{tel}</p>
              </div>
            )}

            {description && (
              <div className="detail-section">
                <h3>소개</h3>
                <p>{description}</p>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="detail-actions">
            <button className="btn-back" onClick={() => navigate(-1)}>
              뒤로가기
            </button>
            <button className="btn-share" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: title,
                  text: `${title}을 확인해보세요!`,
                  url: window.location.href,
                });
              }
            }}>
              공유하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailPage;