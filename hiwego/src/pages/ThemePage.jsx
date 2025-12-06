import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import '../styles/ThemePage.css';

const ThemePage = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const themes = [
    { name: '자연경관', color: '#90EE90', icon: '🏞️' },
    { name: '문화유산', color: '#FFD700', icon: '🏯' },
    { name: '도시관광', color: '#87CEEB', icon: '🏙️' },
    { name: '맛집투어', color: '#FFB6C1', icon: '🍜' },
    { name: '야경/야생동물', color: '#DDA0DD', icon: '🌙' },
    { name: '액티비티', color: '#F08080', icon: '🏃' },
    { name: '휴양지', color: '#98FB98', icon: '🏖️' },
    { name: '유명관광지', color: '#87CEEB', icon: '⭐' }
  ];

  const themeAttractions = {
    '자연경관': [
      { id: 1, name: '설악산', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
      { id: 2, name: '남이섬', image: 'https://images.unsplash.com/photo-1519225421122-fdbf58dc3f35?w=300&h=200&fit=crop' }
    ],
    '문화유산': [
      { id: 1, name: '경복궁', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop' },
      { id: 2, name: '불국사', image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=200&fit=crop' }
    ],
    '도시관광': [
      { id: 1, name: '서울 강남역', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
      { id: 2, name: '부산 해운대', image: 'https://images.unsplash.com/photo-1519225421122-fdbf58dc3f35?w=300&h=200&fit=crop' }
    ],
    '맛집투어': [
      { id: 1, name: '전주 한옥마을 맛집', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop' },
      { id: 2, name: '강릉 영동해변 회센터', image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=200&fit=crop' }
    ],
    '야경/야생동물': [
      { id: 1, name: '서울 남산타워 야경', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
      { id: 2, name: '에버랜드 야생동물원', image: 'https://images.unsplash.com/photo-1519225421122-fdbf58dc3f35?w=300&h=200&fit=crop' }
    ],
    '액티비티': [
      { id: 1, name: '스키장', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop' },
      { id: 2, name: '래프팅', image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=200&fit=crop' }
    ],
    '휴양지': [
      { id: 1, name: '제주도 해변', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
      { id: 2, name: '남해 여행지', image: 'https://images.unsplash.com/photo-1519225421122-fdbf58dc3f35?w=300&h=200&fit=crop' }
    ],
    '유명관광지': [
      { id: 1, name: '명동', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop' },
      { id: 2, name: '인사동', image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=200&fit=crop' }
    ]
  };

  const handleThemeClick = (themeName) => {
    setSelectedTheme(themeName);
  };

  return (
    <Layout>
      <div className="theme-page">
        <div className="theme-container">
          {/* 제목 */}
          <div className="theme-header">
            <h1 className="theme-title">테마별 추천 여행지</h1>
            <p className="theme-subtitle">
              {selectedTheme ? `${selectedTheme} 추천 여행지 목록` : '테마를 선택하세요'}
            </p>
          </div>

          <div className="theme-content">
            {/* 테마 선택 섹션 */}
            <div className="theme-selector-section">
              <div className="theme-selector">
                {themes.map((theme) => (
                  <div
                    key={theme.name}
                    className={`theme-button ${selectedTheme === theme.name ? 'active' : ''}`}
                    style={{
                      backgroundColor: selectedTheme === theme.name ? theme.color : '#e0e0e0',
                      opacity: selectedTheme === theme.name ? 1 : 0.6
                    }}
                    onClick={() => handleThemeClick(theme.name)}
                  >
                    <div className="theme-icon">{theme.icon}</div>
                    <div className="theme-name">{theme.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 여행지 카드 섹션 */}
            <div className="attractions-section">
              {selectedTheme ? (
                <>
                  <h2 className="attractions-title">{selectedTheme} 추천 여행지</h2>
                  <div className="attractions-grid">
                    {(themeAttractions[selectedTheme] || []).map((attraction) => (
                      <div key={attraction.id} className="attraction-card">
                        <div className="attraction-image">
                          <img src={attraction.image} alt={attraction.name} />
                        </div>
                        <div className="attraction-info">
                          <h3>{attraction.name}</h3>
                          <p></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-selection">
                  <p>위의 테마를 선택하면 추천 여행지를 볼 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemePage;