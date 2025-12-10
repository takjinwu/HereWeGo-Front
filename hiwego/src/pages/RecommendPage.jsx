// src/pages/RecommendPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import attractionService from '../services/attractionService';
import '../styles/RecommendPage.css';

const RecommendPage = () => {
  const navigate = useNavigate();
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 해시태그 카테고리별 분류
  const hashtagCategories = [
    {
      category: '자연 경관 및 생태',
      tags: ['#숨은명소', '#자연경관', '#청정지역', '#자연', '#자연관광지', '#자연생태관광지', '#습지공원', '#철새도래지', '#수목원', '#식물도감', '#테마정원']
    },
    {
      category: '등산 및 산악 활동',
      tags: ['#정상정복', '#등산코스', '#산']
    },
    {
      category: '해변 및 수상 관광',
      tags: ['#해수욕장', '#일몰명소', '#모래사장', '#항구_포구', '#어선정박', '#어촌체험', '#선상투어', '#해저탐험', '#유람선_잠수함관광']
    },
    {
      category: '도시 공원 및 휴식',
      tags: ['#도시공원', '#공원', '#산책로']
    },
    {
      category: '역사 및 문화 유산',
      tags: ['#인문문화_예술_역사', '#역사탐방', '#문화유산', '#옛이야기', '#사적지', '#문화재', '#유적지_사적지', '#역사관광지', '#고대유적', '#탄생지', '#위인발자취', '#생가', '#역사기념']
    },
    {
      category: '건축물 및 도시 시설',
      tags: ['#랜드마크', '#유명건물', '#건축물', '#독특한외관', '#도시경관', '#건축_조형물', '#기념탑_기념비_전망대', '#시티뷰', '#강변도로', '#다리_대교', '#야경명소', '#방어시설', '#성벽길', '#성']
    },
    {
      category: '종교 및 성지 순례',
      tags: ['#신성한장소', '#종교성지', '#순례길']
    },
    {
      category: '체험 및 이색 활동',
      tags: ['#이색활동', '#체험관광지', '#직접만들기', '#이색체험', '#미디어아트', '#신기술체험', '#전자-반도체', '#IT산업', '#첨단기술', '#농.산.어촌 체험', '#농작물수확', '#갯벌체험']
    },
    {
      category: '전통 체험 및 교육',
      tags: ['#예절교육', '#한복체험', '#전통체험']
    },
    {
      category: '산업 및 기업 관광',
      tags: ['#생산현장', '#기업견학', '#산업관광지', '#커피박물관', '#양조장', '#식음료', '#에너지생산', '#산업시설', '#발전소']
    },
    {
      category: '휴양 및 웰빙',
      tags: ['#재충전', '#웰빙여행', '#힐링여행', '#휴양관광지', '#온천_욕장_스파', '#노천탕', '#피부미용', '#수면실', '#테마별', '#이색찜질방', '#리조트', '#관광단지', '#종합휴양시설']
    },
    {
      category: '지역/테마 거리',
      tags: ['#젊음의거리', '#이색거리', '#특화거리']
    },
    {
      category: '테마파크/놀이시설',
      tags: ['#캐릭터파크', '#테마공원', '#놀이시설']
    }
  ];

  useEffect(() => {
    // 로그인 유저 확인
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('user');
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('유저 정보 파싱 실패:', e);
      }
    }
  }, []);

  const handleTagClick = (tag) => {
    if (selectedHashtags.includes(tag)) {
      // 이미 선택된 태그면 제거
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      // 새로 선택
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const handleGetRecommendations = async () => {
    if (selectedHashtags.length < 3) {
      alert('해시태그를 최소 3개 이상 선택해주세요.');
      return;
    }

    // 로그인 확인
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login', { state: { from: { pathname: '/recommend' } } });
      return;
    }

    try {
      setLoading(true);
      // 해시태그에서 # 제거
      const tagsWithoutHash = selectedHashtags.map(tag => tag.replace('#', ''));
      const data = await attractionService.searchByHashtags(tagsWithoutHash);
      console.log('추천 여행지 API 응답:', data);
      setRecommendations(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (error) {
      console.error('추천 여행지 조회 실패:', error);
      alert('추천 여행지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedHashtags([]);
    setRecommendations([]);
    setShowResults(false);
  };

  const handleAttractionClick = (contentId) => {
    navigate(`/detail/${contentId}`);
  };

  if (showResults) {
    return (
      <Layout>
        <div className="recommend-page">
          <div className="recommend-container">
            <div className="recommend-header">
              <h1 className="recommend-title">맞춤 여행지 추천</h1>
              <button className="btn-reset" onClick={handleReset}>
                다시 선택하기
              </button>
            </div>

            <div className="selected-tags-section">
              <h3>선택한 해시태그</h3>
              <div className="selected-tags-list">
                {selectedHashtags.map((tag, index) => (
                  <span key={index} className="selected-tag">{tag}</span>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="loading">추천 여행지를 찾고 있습니다...</div>
            ) : (
              <>
                <div className="results-header">
                  <h2>추천 여행지 {recommendations.length}곳</h2>
                </div>

                {recommendations.length === 0 ? (
                  <div className="no-results">
                    <p>선택하신 해시태그와 일치하는 여행지가 없습니다.</p>
                    <p>다른 해시태그를 선택해보세요.</p>
                  </div>
                ) : (
                  <div className="recommendations-grid">
                    {recommendations.map((attraction) => (
                      <div 
                        key={attraction.contentId} 
                        className="recommendation-card"
                        onClick={() => handleAttractionClick(attraction.contentId)}
                      >
                        <div className="card-image">
                          {attraction.firstImage ? (
                            <img 
                              src={attraction.firstImage} 
                              alt={attraction.title}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="no-image">이미지 없음</div>
                          )}
                        </div>
                        <div className="card-content">
                          <h3 className="card-title">{attraction.title}</h3>
                          <p className="card-address">{attraction.address}</p>
                          {attraction.tag && (
                            <div className="card-tags">
                              {attraction.tag.split(',').slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="card-tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="recommend-page">
        <div className="recommend-container">
          <div className="recommend-header">
            <h1 className="recommend-title">나에게 맞는 여행지 찾기</h1>
            <p className="recommend-subtitle">
              나와 어울리는 해시태그를 최소 3개 이상 선택해주세요
            </p>
          </div>

          <div className="selected-count">
            선택한 해시태그: <strong>{selectedHashtags.length}개</strong>
            {selectedHashtags.length > 0 && (
              <button className="btn-clear" onClick={() => setSelectedHashtags([])}>
                전체 해제
              </button>
            )}
          </div>

          <div className="hashtag-categories">
            {hashtagCategories.map((category, catIndex) => (
              <div key={catIndex} className="hashtag-category">
                <h3 className="category-title">{category.category}</h3>
                <div className="hashtag-list">
                  {category.tags.map((tag, tagIndex) => (
                    <button
                      key={tagIndex}
                      className={`hashtag-btn ${selectedHashtags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="recommend-actions">
            <button 
              className="btn-get-recommendations"
              onClick={handleGetRecommendations}
              disabled={selectedHashtags.length < 3}
            >
              {selectedHashtags.length < 3 
                ? `해시태그를 ${3 - selectedHashtags.length}개 더 선택해주세요` 
                : '추천 여행지 보기'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecommendPage;
