import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Layout from '../components/Layout/Layout';
import touristService from '../services/touristService';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); 
  
  const [spots, setSpots] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [query, setQuery] = useState(''); 

  // 로컬 스토리지에서 토큰 확인
  const token = localStorage.getItem('authToken'); 
  const isLoggedIn = !!token;

  // 💡 API 데이터 호출 로직 및 리다이렉션
  useEffect(() => {

    //  비로그인 상태 처리: API 호출을 막고 안내 메시지 설정
    const fetchRecommendations = async () => {
      
      // 비로그인 상태이므로 API 호출을 시도하지 않고 메시지 설정
      setError('로그인이 필요한 서비스입니다. 회원가입 또는 로그인을 해주세요.'); 
      setLoading(false);
      return; 
    };
      if (!isLoggedIn) {
            setError('로그인이 필요한 서비스입니다. 회원가입 또는 로그인을 해주세요.'); 
            setLoading(false);
            return; // API 호출 중단
          }

    fetchRecommendations();
  }, [isLoggedIn, navigate]);

  // 슬라이드 로직
  const nextSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev + 1) % spots.length);
  };

  const prevSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev - 1 + spots.length) % spots.length);
  };
  
  // 💡 검색어 입력 변경 핸들러
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // 💡 검색 버튼 클릭 및 API 호출 핸들러
  const handleSearchSubmit = async () => {
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    if (!isLoggedIn) { // 로그인 안 했으면 검색 차단
        alert('로그인 후 검색할 수 있습니다.');
        return;
    }

    try {
        const results = await touristService.getSpotsByKeyword(query);
        console.log("검색 결과:", results);
        // TODO: 검색 결과 페이지로 이동하거나, spots 상태를 업데이트하여 결과 표시 로직 추가
        
    } catch (error) {
        console.error("검색 실패:", error);
        alert("검색 중 오류가 발생했습니다.");
    }
  };
  
  // 렌더링 조건: 로딩, 에러, 데이터 없음 처리
  let carouselContent;
  if (loading) {
    carouselContent = <div className="loading-message">정보를 확인 중입니다...</div>;
  } else if (error) {
    // 비로그인 시 표시할 메시지와 버튼
    carouselContent = (
      <div className="error-message">
        {error}
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/login" className="login-prompt-button" style={{ padding: '10px 20px', backgroundColor: '#64B5F6', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
            로그인
          </Link>
          <Link to="/signup" className="signup-prompt-button" style={{ padding: '10px 20px', border: '1px solid #64B5F6', color: '#64B5F6', borderRadius: '5px', textDecoration: 'none' }}>
            회원가입
          </Link>
        </div>
      </div>
    );
  } else if (spots.length === 0) {
    carouselContent = <div className="no-data-message">추천 여행지 데이터가 없습니다.</div>;
  } else {
    carouselContent = (
      <div className="carousel-items">
        {spots.map((item, index) => (
          <div 
            key={item.contentId || index} 
            className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={item.firstimage || item.image || '기본_이미지_URL'} 
              alt={item.title || item.name} 
              className="carousel-image"
            />
            <div className="carousel-info">
              <p className="carousel-name">{item.title || item.name}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="home-container">
        {/* 2. 메인 배너 섹션 */}
        <section className="main-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1 className="banner-title">Here we go!</h1>
              <p className="banner-subtitle">가보고 싶은 추천 여행지</p>
              
              {/* 검색 바 */}
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="추천 여행지를 찾아보세요"
                  className="search-input"
                  value={query} // 💡 상태 연결
                  onChange={handleSearchChange} // 💡 입력 변경 핸들러 연결
                />
                <button className="search-button" onClick={handleSearchSubmit}> 
                  🔍
                </button>
              </div>
            </div>

            {/* 배너 이미지 (정적) */}
            <div className="banner-image">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" 
                alt="산 풍경"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* 3. 추천 여행지 카루셀 섹션 */}
        <section className="recommendations-section">
          <h2 className="section-title">가보고 싶은 추천 여행지</h2>
          
          <div className="carousel-container">
            {/* 왼쪽 버튼 */}
            <button 
                className="carousel-button prev-button" 
                onClick={prevSlide}
                disabled={loading || spots.length <= 1 || !isLoggedIn} 
            >
              ❮
            </button>

            {/* 카루셀 아이템들 - 동적 컨텐츠 */}
            {carouselContent}

            {/* 오른쪽 버튼 */}
            <button 
                className="carousel-button next-button" 
                onClick={nextSlide}
                disabled={loading || spots.length <= 1 || !isLoggedIn} 
            >
              ❯
            </button>
          </div>
        </section>

        {/* 4. 지역별/테마별 버튼 섹션 (그대로 유지) */}
        <section className="category-section">
          <div className="category-buttons">
            <Link to="/region" className="category-button region-btn">
              지역별
            </Link>
            <Link to="/theme" className="category-button theme-btn">
              테마별
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;