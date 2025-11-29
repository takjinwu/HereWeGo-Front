// src/pages/HomePage.jsx (최종 정리 및 오류 제거)

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
// 임시로 SearchContainer 대신 기본 UI를 사용합니다.
// 10단계에서 SearchContainer를 다시 연결할 예정입니다.
// import SearchContainer from '../components/Search/SearchContainer'; 

const HomePage = () => {
  return (
    <Layout>
      <div className="home-container">
        {/* 1. 메인 배너 영역 */}
        <section style={{ 
          background: '#f8f8f8', 
          padding: '80px 0', 
          textAlign: 'center' 
        }}>
          {/* ✨ 모든 [cite_start]및 텍스트 완전히 제거 */}
          <h2>Here we go!</h2> 
          <p>가보고 싶은 추천 여행지</p>
          
          {/* 2. 검색 영역 (디자인 적용) */}
          <div style={{ margin: '20px auto', width: '80%', maxWidth: '600px', display: 'flex' }}>
            <input 
              type="text" 
              placeholder="추천 여행지를 찾아보세요" // ✨ [cite: 7] 제거
              style={{ 
                padding: '15px', 
                flexGrow: 1, 
                border: '2px solid #007bff', 
                borderRadius: '5px 0 0 5px',
                fontSize: '1em',
                outline: 'none'
              }} 
            />
            <button style={{ 
                padding: '15px 30px', 
                marginLeft: '-2px', 
                border: '2px solid #007bff', 
                background: '#007bff', 
                color: 'white',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold'
              }}>
              검색
            </button>
          </div>
        </section>

        {/* 3. 섹션: 지역별 & 테마별 버튼/링크 */}
        <section style={{ padding: '40px', textAlign: 'center' }}>
          <h3>추천 기준 선택</h3>
          <div style={{ marginTop: '20px' }}>
            {/* ✨ 중첩된 Link 태그 및 불필요한 닫는 태그 제거 */}
            <Link 
              to="/region" 
              style={{ 
                margin: '0 15px', 
                padding: '12px 25px', 
                border: '1px solid #ccc', 
                textDecoration: 'none', 
                color: '#333',
                borderRadius: '5px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              지역별
            </Link>

            <Link 
              to="/theme" 
              style={{ 
                margin: '0 15px', 
                padding: '12px 25px', 
                border: '1px solid #ccc', 
                textDecoration: 'none', 
                color: '#333',
                borderRadius: '5px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              테마별
            </Link>
          </div>
        </section>

        {/* 4. 이미지 갤러리 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
          <p>대표 이미지들이 표시될 영역입니다.</p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;