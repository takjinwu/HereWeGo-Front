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
  const [searchQuery, setSearchQuery] = useState(''); 

  // 토큰 확인
  const token = localStorage.getItem('authToken'); 
  const isLoggedIn = !!token;

  // ⭐ 1. API 데이터 호출 로직 (로그인 여부와 무관하게 시도)
  useEffect(() => {

    const fetchRecommendations = async () => {
        // 💡 API 호출 시작 전에 로딩 상태 초기화
        setLoading(true);
        setError(null);

      try {
        // ⭐ API 호출 실행: 토큰이 있으면 헤더에 실려 전송됨
        // (임시로 "서울" 지역 데이터를 가져오는 것으로 가정합니다.)
        const data = await touristService.getSpotsByRegion("서울"); 
        
        setSpots(data.list || data); 
        setError(null); // 성공 시 에러 제거

      } catch (err) {
        // 403 Forbidden 오류 시: 로그인 필요 메시지 출력
        const status = err.response?.status;
        if (status === 403) {
            setError('추천 정보는 로그인 후 확인 가능합니다.');
        } else {
            setError(`데이터 로드 실패 (오류 코드: ${status || '네트워크 오류'})`);
        }
        console.error('API 호출 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // 빈 배열로 두어 컴포넌트 마운트 시에만 실행

  // 슬라이드 로직 (변경 없음)
  const nextSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev + 1) % spots.length);
  };

  const prevSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev - 1 + spots.length) % spots.length);
  };
  
  // 검색어 입력 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭 및 API 호출 핸들러
  const handleSearchSubmit = async () => {
    if (!searchQuery) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    if (!isLoggedIn) { 
        alert('로그인 후 검색할 수 있습니다.');
        return;
    }

    try {
        const results = await touristService.getSpotsByKeyword(searchQuery);
        console.log("검색 결과:", results);
        // TODO: 검색 결과 페이지로 이동하거나, spots 상태를 업데이트하여 결과 표시 로직 추가
        
    } catch (error) {
        console.error("검색 실패:", error);
        alert("검색 중 오류가 발생했습니다.");
    }
  };
  
  // ⭐ 2. 렌더링 조건 수정 (error 상태에 따라 로그인 버튼 표시)
  let carouselContent;
  
  // 1. 로딩 중
  if (loading) {
    carouselContent = <div className="loading-message">추천 정보를 불러오는 중...</div>;
  } 
  // 2. 오류 발생 (403 포함)
  else if (error) {
    carouselContent = (
      <div className="error-message">
        {error}
        {/* 로그인 필요 메시지일 경우 버튼 표시 */}
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
  // 3. 데이터 없음
  else if (spots.length === 0) {
    carouselContent = <div className="no-data-message">추천 여행지 데이터가 없습니다.</div>;
  } 
  // 4. 성공 및 데이터 표시
  else {
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
            <div className carousel-info>
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
        {/* 2. 메인 배너 섹션 (검색 바 포함) */}
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
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="search-button" onClick={handleSearchSubmit}> 
                  🔍
                </button>
              </div>
            </div>

            {/* 배너 이미지 */}
            <div className="banner-image">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt="산 풍경" className="hero-image" />
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