import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import '../styles/HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 추천 여행지 데이터 (실제로는 API에서 가져올 수 있음)
  const recommendations = [
    {
      id: 1,
      name: '산 위의 성',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      region: '겨울'
    },
    {
      id: 2,
      name: '야경 도시',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      region: '야경'
    },
    {
      id: 3,
      name: '눈 덮인 집',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      region: '겨울'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <Layout>
      <div className="home-container">
        {/* 1. 네비게이션 (헤더는 Layout에서 처리) */}
        
        {/* 2. 메인 배너 섹션 - 큰 히어로 배너 */}
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
                />
                <button className="search-button">
                  🔍
                </button>
              </div>
            </div>

            {/* 배너 이미지 */}
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
            <button className="carousel-button prev-button" onClick={prevSlide}>
              ❮
            </button>

            {/* 카루셀 아이템들 */}
            <div className="carousel-items">
              {recommendations.map((item, index) => (
                <div 
                  key={item.id}
                  className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="carousel-image"
                  />
                  <div className="carousel-info">
                    <p className="carousel-name">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽 버튼 */}
            <button className="carousel-button next-button" onClick={nextSlide}>
              ❯
            </button>
          </div>
        </section>

        {/* 4. 지역별/테마별 버튼 섹션 */}
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