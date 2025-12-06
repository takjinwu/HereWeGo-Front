import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import attractionService from '../services/attractionService';
import '../styles/RegionPage.css';

const RegionPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regions, setRegions] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 지역 목록 조회
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await attractionService.getRegionList();
        setRegions(data.regions || []);
        // 첫 번째 지역 자동 선택
        if (data.regions && data.regions.length > 0) {
          setSelectedRegion(data.regions[0].name);
        }
      } catch (err) {
        setError('지역 목록을 불러올 수 없습니다.');
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // 선택된 지역의 여행지 조회
  useEffect(() => {
    if (selectedRegion) {
      const fetchAttractions = async () => {
        try {
          setLoading(true);
          const data = await attractionService.getTourDetail(selectedRegion);
          setAttractions(data.attractions || []);
        } catch (err) {
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
  };

  if (loading && regions.length === 0) {
    return (
      <Layout>
        <div className="region-page">
          <div className="region-container">
            <p>지역 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="region-page">
        <div className="region-container">
          {/* 제목 */}
          <div className="region-header">
            <h1 className="region-title">지역별 추천 여행지</h1>
            <p className="region-subtitle">
              {selectedRegion ? `${selectedRegion} 추천 여행지 목록` : '지역을 선택하세요'}
            </p>
          </div>

          <div className="region-content">
            {/* 지역 선택 섹션 */}
            <div className="region-map-section">
              <div className="region-map">
                {regions.map((region) => (
                  <div
                    key={region.name}
                    className={`region-button ${selectedRegion === region.name ? 'active' : ''}`}
                    style={{
                      backgroundColor: selectedRegion === region.name ? '#4CAF50' : '#e0e0e0',
                      opacity: selectedRegion === region.name ? 1 : 0.6
                    }}
                    onClick={() => handleRegionClick(region.name)}
                  >
                    {region.name}
                  </div>
                ))}
              </div>
            </div>

            {/* 여행지 카드 섹션 */}
            <div className="attractions-section">
              {selectedRegion ? (
                <>
                  <h2 className="attractions-title">{selectedRegion} 추천 여행지</h2>
                  {loading ? (
                    <p>여행지 정보를 불러오는 중입니다...</p>
                  ) : attractions.length > 0 ? (
                    <div className="attractions-grid">
                      {attractions.map((attraction) => (
                        <div key={attraction.id || attraction.contentId} className="attraction-card">
                          <div className="attraction-image">
                            <img src={attraction.image || 'https://via.placeholder.com/300x200'} alt={attraction.name} />
                          </div>
                          <div className="attraction-info">
                            <h3>{attraction.name || attraction.title}</h3>
                            <p>{attraction.address || ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-selection">
                      <p>이 지역의 여행지 정보가 없습니다.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-selection">
                  <p>왼쪽 지역을 선택하면 추천 여행지를 볼 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegionPage;