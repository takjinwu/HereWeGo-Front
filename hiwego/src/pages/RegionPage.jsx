import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import attractionService from '../services/attractionService';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import Pagination from '../components/Pagination/Pagination';
import '../styles/RegionPage.css';

// 지역 목록 (6개 지역)
const REGIONS = [
  { name: '수도권', emoji: '🏛️' },
  { name: '강원권', emoji: '⛰️' },
  { name: '충청권', emoji: '🌾' },
  { name: '전라권', emoji: '🏞️' },
  { name: '경상권', emoji: '🏯' },
  { name: '제주권', emoji: '🏝️' },
];

const RegionPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('수도권');
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 선택된 지역의 여행지 조회
  useEffect(() => {
    if (selectedRegion) {
      const fetchAttractions = async () => {
        try {
          setLoading(true);
          setError(null);
          // API: GET /api/v1/tour/regionList?regionName=수도권
          const data = await attractionService.getRegionList(selectedRegion);
          console.log(`[${selectedRegion}] API 응답:`, data);
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
    }
  }, [selectedRegion]);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(attractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttractions = attractions.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="region-page">
        <div className="region-container">
          {/* 제목 */}
          <div className="region-header">
            <h1 className="region-title">지역별 추천 여행지</h1>
            <p className="region-subtitle">{selectedRegion} 추천 여행지</p>
          </div>

          {/* 지역 선택 탭 */}
          <div className="region-tabs">
            {REGIONS.map((region) => (
              <button
                key={region.name}
                className={`region-tab ${selectedRegion === region.name ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region.name)}
              >
                <span className="region-emoji">{region.emoji}</span>
                <span className="region-name">{region.name}</span>
              </button>
            ))}
          </div>

          {/* 여행지 카드 섹션 */}
          <div className="region-attractions">
            {loading ? (
              <div className="region-loading">여행지 정보를 불러오는 중입니다...</div>
            ) : error ? (
              <div className="region-error">
                <p>{error}</p>
              </div>
            ) : attractions.length > 0 ? (
              <>
                <div className="attractions-grid">
                  {currentAttractions.map((attraction, index) => {
                  // 다양한 필드명 대응 (contentid, contentId, id 등)
                  const contentId = attraction.contentid || attraction.contentId || attraction.id;
                  const key = contentId || index;
                  console.log(`[${selectedRegion}] 여행지 #${index}:`, {
                    name: attraction.title || attraction.name,
                    contentid: attraction.contentid,
                    contentId: attraction.contentId,
                    id: attraction.id,
                    전체데이터: attraction,
                    key: key,
                  });
                  
                  return (
                    <AttractionCard
                      key={key}
                      attraction={attraction}
                      onClick={() => {
                        const id = contentId;
                        console.log('카드 클릭:', { name: attraction.title, contentId: id, 전체: attraction });
                        if (id) {
                          navigate(`/detail/${id}`);
                        } else {
                          console.warn('⚠️ contentId가 없습니다!');
                        }
                      }}
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
              <div className="region-empty">
                <p>이 지역의 여행지 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegionPage;