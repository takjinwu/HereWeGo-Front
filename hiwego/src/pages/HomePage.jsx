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
  const [featured, setFeatured] = useState(null); // 랜덤 추천 항목
  const [recommendations, setRecommendations] = useState([]); // 해시태그 기반 추천

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
        
        setRecommendations(Array.isArray(data) ? data : []);
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
  }, [isLoggedIn]);  const nextSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev + 1) % spots.length);
  };

  const prevSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev - 1 + spots.length) % spots.length);
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


try {
        const results = await tourService.getSpotsByKeyword(searchQuery);
        
        // 성공 시: 검색 결과를 상태에 저장
        setSearchResults(results.list || results); // 백엔드 응답 구조에 따라 조정
        setSearchError(null);
        
    } catch (error) {
        console.error("검색 실패:", error);
        setSearchResults([]); // 실패 시 결과 초기화
        setSearchError('검색 중 오류가 발생했습니다. (토큰 만료 혹은 서버 오류)');
    }
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
    const currentItem = spots[currentSlide];
    carouselContent = (
      <div className="carousel-single-item" onClick={() => navigate(`/detail/${currentItem.contentId}`)}>
        <img 
          src={currentItem.firstImage || currentItem.firstimage || currentItem.image || 'https://via.placeholder.com/600x400?text=No+Image'} 
          alt={currentItem.title || currentItem.name} 
          className="carousel-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
          }}
        />
        <div className="carousel-info">
          <h3 className="carousel-name">{currentItem.title || currentItem.name}</h3>
          {currentItem.address && <p className="carousel-address">{currentItem.address}</p>}
        </div>
        <div className="carousel-counter">
          {currentSlide + 1} / {spots.length}
        </div>
      </div>
    );
  }  return (
    <Layout>
      <div className="home-container">
        <section className="main-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1 className="banner-title">Here we go!</h1>
              <p className="banner-subtitle">가보고 싶은 추천 여행지</p>
              
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="추천 여행지를 찾아보세요"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="search-button" onClick={handleSearchSubmit}> 
                  🔍
                </button>
              </div>
            </div>

            <div className="banner-image">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt="산 풍경" className="hero-image" />
            </div>
          </div>
        </section>

        <section className="recommendations-section">
          <h2 className="section-title">가보고 싶은 추천 여행지</h2>
          
          <div className="carousel-container">
            <button 
                className="carousel-button prev-button" 
                onClick={prevSlide}
                disabled={loading || spots.length <= 1 || !isLoggedIn} 
            >
              ❮
            </button>

            {carouselContent}

            <button 
                className="carousel-button next-button" 
                onClick={nextSlide}
                disabled={loading || spots.length <= 1 || !isLoggedIn} 
            >
              ❯
            </button>
          </div>
        </section>

        <section className="category-section">
          <div className="category-buttons">
            <Link to="/region" className="category-button region-btn">
              지역별
            </Link>
            <Link to="/theme" className="category-button theme-btn">
              테마별
            </Link>
            <Link to="/recommend" className="category-button recommend-btn">
              맞춤 추천
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;