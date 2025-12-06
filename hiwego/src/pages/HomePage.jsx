import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import touristService from '../services/touristService';
import '../styles/HomePage.css';

const HomePage = () => {
  // 💡 API에서 가져온 데이터를 저장할 상태
  const [spots, setSpots] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  // 💡 API 데이터 호출 로직
  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('로그인이 필요합니다.'); 
        setLoading(false);
        // 로그인 페이지로 리다이렉트하거나 데이터 로드를 중단합니다.
        // navigate('/login'); 
        return;
      }
      try {
        // ⭐ [API 호출] 지역 목록 검색 API를 사용하여 데이터를 가져옵니다.
        // (추천 목록이므로, 임시로 "서울" 지역 데이터를 가져오는 것으로 가정합니다.)
        // 백엔드 친구분께 이 함수에 사용할 적절한 키워드나 지역을 확인해 보세요.
        const data = await touristService.getSpotsByRegion("서울"); 
        
        // 💡 백엔드 응답 구조에 맞게 데이터 경로를 지정합니다. 
        // data.list 또는 data.spots 등에 목록이 담겨 있다면 경로를 수정해야 합니다.
        setSpots(data.list || data); 

      } catch (err) {
        setError('추천 여행지 정보를 불러오는 데 실패했습니다.');
        console.error('API 호출 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 슬라이드 로직은 spots 상태를 사용하도록 변경
  const nextSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev + 1) % spots.length);
  };

  const prevSlide = () => {
    if (spots.length === 0) return; 
    setCurrentSlide((prev) => (prev - 1 + spots.length) % spots.length);
  };
  
  // 렌더링 조건: 로딩, 에러, 데이터 없음 처리
  let carouselContent;
  if (loading) {
    carouselContent = <div className="loading-message">추천 여행지 정보를 불러오는 중입니다...</div>;
  } else if (error) {
    carouselContent = <div className="error-message">데이터 로드 실패: {error}</div>;
  } else if (spots.length === 0) {
    carouselContent = <div className="no-data-message">추천 여행지 데이터가 없습니다.</div>;
  } else {
    carouselContent = (
      <div className="carousel-items">
        {/* spots 상태를 사용하여 동적 렌더링 */}
        {spots.map((item, index) => (
          <div 
            key={item.contentId || index} // API 명세에 따라 contentId를 key로 사용
            className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              // ⭐ 백엔드 응답 데이터의 필드명(예: firstimage, title)에 맞게 키를 사용합니다.
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
        {/* 2. 메인 배너 섹션 (그대로 유지) */}
        <section className="main-banner">
          {/* ... */}
        </section>

        {/* 3. 추천 여행지 카루셀 섹션 */}
        <section className="recommendations-section">
          <h2 className="section-title">가보고 싶은 추천 여행지</h2>
          
          <div className="carousel-container">
            {/* 왼쪽 버튼 */}
            <button 
                className="carousel-button prev-button" 
                onClick={prevSlide}
                disabled={loading || spots.length <= 1} 
            >
              ❮
            </button>

            {/* 카루셀 아이템들 - 동적 컨텐츠 */}
            {carouselContent}

            {/* 오른쪽 버튼 */}
            <button 
                className="carousel-button next-button" 
                onClick={nextSlide}
                disabled={loading || spots.length <= 1} 
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