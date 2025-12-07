import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import attractionService from '../services/attractionService';
import '../styles/ThemePage.css';

// 테마 목록 및 검색 키워드 매핑
const THEMES = [
  { name: '캠핑', emoji: '⛺', keyword: '캠핑' },
  { name: '역사', emoji: '🏯', keyword: '역사' },
  { name: '쇼핑', emoji: '🛍️', keyword: '쇼핑' },
  { name: '축제', emoji: '🎉', keyword: '축제' },
  { name: '음식', emoji: '🍜', keyword: '맛집' },
  { name: '체험', emoji: '🎨', keyword: '체험' },
  { name: '겨울', emoji: '⛄', keyword: '스키' },
];

const ThemePage = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('캠핑');
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 선택된 테마의 여행지 조회
  useEffect(() => {
    if (selectedTheme) {
      const fetchAttractions = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // 선택된 테마의 키워드 찾기
          const theme = THEMES.find(t => t.name === selectedTheme);
          const keyword = theme?.keyword || selectedTheme;
          
          // API: GET /api/v1/tour/search/keyword?query=캠핑
          const data = await attractionService.searchByKeyword(keyword);
          console.log(`[${selectedTheme}] API 응답:`, data);
          
          // 응답 데이터 파싱
          let attractionList = [];
          if (Array.isArray(data)) {
            attractionList = data;
          } else if (data.items) {
            attractionList = Array.isArray(data.items) ? data.items : [data.items];
          } else if (data.response?.body?.items) {
            attractionList = Array.isArray(data.response.body.items) ? data.response.body.items : [data.response.body.items];
          }
          
          setAttractions(attractionList);
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
  }, [selectedTheme]);

  return (
    <Layout>
      <div className="theme-page">
        <div className="theme-container">
          {/* 제목 */}
          <div className="theme-header">
            <h1 className="theme-title">테마별 추천 여행지</h1>
            <p className="theme-subtitle">{selectedTheme} 추천 여행지</p>
          </div>

          {/* 테마 선택 탭 */}
          <div className="theme-tabs">
            {THEMES.map((theme) => (
              <button
                key={theme.name}
                className={`theme-tab ${selectedTheme === theme.name ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme.name)}
              >
                <span className="theme-emoji">{theme.emoji}</span>
                <span className="theme-name">{theme.name}</span>
              </button>
            ))}
          </div>

          {/* 여행지 카드 섹션 */}
          <div className="theme-attractions">
            {loading ? (
              <div className="theme-loading">여행지 정보를 불러오는 중입니다...</div>
            ) : error ? (
              <div className="theme-error">
                <p>{error}</p>
              </div>
            ) : attractions.length > 0 ? (
              <div className="attractions-grid">
                {attractions.map((attraction, index) => {
                  const key = `${selectedTheme}-${index}`;
                  return (
                    <AttractionCard
                      key={key}
                      attraction={attraction}
                      onClick={() => {
                        const contentId = attraction.contentid || attraction.id;
                        console.log('카드 클릭:', { title: attraction.title, contentId, index });
                        navigate(`/detail/${contentId}`);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="theme-empty">
                <p>{selectedTheme}의 여행지 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemePage;