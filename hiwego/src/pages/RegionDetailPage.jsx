// src/pages/RegionDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import attractionService from '../services/attractionService';
import '../styles/RegionDetailPage.css';

const RegionDetailPage = () => {
  // URL에서 ':regionName' 파라미터를 가져옵니다.
  const { regionName } = useParams(); 
  const navigate = useNavigate();
  
  // URL 인코딩된 지역 이름을 디코딩합니다. (예: '%EA%B0%95%EC%9B%90%EB%8F%84' -> '강원도')
  const decodedRegionName = decodeURIComponent(regionName);

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 지역별 여행지 조회
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        setError(null);
        // API: GET /api/v1/tour/regionList?regionName=강원권
        const data = await attractionService.getRegionList(decodedRegionName);
        console.log(`[RegionDetailPage] ${decodedRegionName} API 응답:`, data);
        setAttractions(data.list || data || []);
      } catch (err) {
        setError('여행지 정보를 불러올 수 없습니다.');
        setAttractions([]);
        console.error('Error fetching attractions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [decodedRegionName]);

  return (
    <Layout>
      <div className="region-detail-page">
        <div className="region-detail-container">
          {/* 헤더 */}
          <div className="region-detail-header">
            <button className="back-button" onClick={() => navigate('/region')}>
              ← 돌아가기
            </button>
            <h1 className="region-detail-title">{decodedRegionName} 여행지</h1>
            <p className="region-detail-subtitle">
              {loading ? '로딩 중...' : `총 ${attractions.length}개의 여행지`}
            </p>
          </div>

          {/* 콘텐츠 */}
          <div className="region-detail-content">
            {loading ? (
              <div className="loading-message">여행지 정보를 불러오는 중입니다...</div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => navigate('/region')}>지역 목록으로 돌아가기</button>
              </div>
            ) : attractions.length > 0 ? (
              <>
                <div className="attractions-grid">
                  {currentAttractions.map((attraction, index) => {
                    const key = attraction.contentId || attraction.id || index;
                    return (
                      <AttractionCard
                        key={key}
                        attraction={attraction}
                        onClick={() => navigate(`/detail/${attraction.contentId || attraction.id}`)}
                      />
                    );
                  })}
                </div>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="no-data-message">
                <p>{decodedRegionName}의 여행지 정보가 없습니다.</p>
                <button onClick={() => navigate('/region')}>지역 목록으로 돌아가기</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegionDetailPage;