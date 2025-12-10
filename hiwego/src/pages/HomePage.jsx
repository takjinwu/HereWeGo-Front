import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Layout from '../components/Layout/Layout';
import tourService from '../services/tourService';
import attractionService from '../services/attractionService';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); 
  
  const [spots, setSpots] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const [searchError, setSearchError] = useState(null);

  const token = localStorage.getItem('authToken'); 
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        setError('추천 정보는 로그인 후 확인 가능합니다.');
        setLoading(false);
        return;
      }

      try {
        // 기본 해시태그로 추천 여행지 가져오기
        const defaultHashtags = ['자연경관', '힐링여행', '숨은명소'];
        const data = await attractionService.searchByHashtags(defaultHashtags);
        
        setSpots(Array.isArray(data) ? data : []);
        setError(null);

      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError(`데이터 로드 실패 (오류 코드: ${status || '네트워크 오류'})`);
        }
        console.error('API 호출 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isLoggedIn]);

  // 3개씩 표시하므로 3씩 이동
  const nextSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => {
      const next = prev + 3;
      return next >= spots.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => {
      const next = prev - 3;
      return next < 0 ? Math.max(0, spots.length - 3) : next;
    });
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery) {
      alert('검색어를 입력해주세요.');
      return;
    }
    
    if (!isLoggedIn) { 
      alert('로그인 후 검색할 수 있습니다.');
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  // 현재 슬라이드에서 3개의 아이템 가져오기
  const getVisibleItems = () => {
    if (spots.length === 0) return [];
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % spots.length;
      if (spots[index]) {
        items.push(spots[index]);
      }
    }
    return items;
  };
  
  let carouselContent;
  
  if (loading) {
    carouselContent = <div className="loading-message">추천 정보를 불러오는 중...</div>;
  } 
  else if (error) {
    carouselContent = (
      <div className="error-message">
        {error}
        {error.includes('로그인') && (
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/login" className="login-prompt-button" style={{ padding: '10px 20px', backgroundColor: '#64B5F6', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
              로그인
            </Link>
            <Link to="/signup" className="signup-prompt-button" style={{ padding: '10px 20px', border: '1px solid #64B5F6', color: '#64B5F6', borderRadius: '5px', textDecoration: 'none' }}>
              회원가입
            </Link>
          </div>
        )}
      </div>
    );
  } 
  else if (spots.length === 0) {
    carouselContent = <div className="no-data-message">추천 여행지 데이터가 없습니다.</div>;
  } 
  else {
    const visibleItems = getVisibleItems();
    carouselContent = (
      <div className="carousel-triple-items">
        {visibleItems.map((item, index) => (
          <div 
            key={item.contentId || index} 
            className="carousel-card"
            onClick={() => navigate(`/detail/${item.contentId}`)}
          >
            <div className="carousel-card-image">
              <img 
                src={item.firstImage || item.firstimage || item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                alt={item.title || item.name} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>
            <div className="carousel-card-info">
              <h3 className="carousel-card-title">{item.title || item.name}</h3>
              {item.address && <p className="carousel-card-address">{item.address}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="home-container">
        <section className="main-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1 className="banner-title">Here we go!</h1>
              <p className="banner-subtitle">당신만을 위한 맞춤 여행지를 추천해드립니다</p>
              
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="가고 싶은 여행지를 검색해보세요"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                <button className="search-button" onClick={handleSearchSubmit}> 
                  🔍
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="recommendations-section">
          <h2 className="section-title">가보고 싶은 추천 여행지</h2>
          
          <div className="carousel-container">
            <button 
              className="carousel-button prev-button" 
              onClick={prevSlide}
              disabled={loading || spots.length <= 3 || !isLoggedIn} 
            >
              ❮
            </button>

            {carouselContent}

            <button 
              className="carousel-button next-button" 
              onClick={nextSlide}
              disabled={loading || spots.length <= 3 || !isLoggedIn} 
            >
              ❯
            </button>
          </div>

          {spots.length > 0 && (
            <div className="carousel-pagination">
              {Math.ceil(spots.length / 3) > 1 && (
                <span className="pagination-text">
                  {Math.floor(currentSlide / 3) + 1} / {Math.ceil(spots.length / 3)}
                </span>
              )}
            </div>
          )}
        </section>

        <section className="category-section">
          <h2 className="category-title">여행지 둘러보기</h2>
          <div className="category-buttons">
            <Link to="/region" className="category-button region-btn">
              <span className="category-icon">📍</span>
              <span className="category-text">지역별</span>
            </Link>
            <Link to="/theme" className="category-button theme-btn">
              <span className="category-icon">🎯</span>
              <span className="category-text">테마별</span>
            </Link>
            <Link to="/recommend" className="category-button recommend-btn">
              <span className="category-icon">✨</span>
              <span className="category-text">맞춤 추천</span>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
