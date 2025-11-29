// src/components/Layout/Layout.jsx (수정)

import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: '여행지 추천', path: '/recommend' },
  { name: '지역별', path: '/region' },
  { name: '테마별', path: '/theme' },
  { name: '로그인/회원가입', path: '/login' }, 
];

const Layout = ({ children }) => { 
  return (
    <div className="app-container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '10px 40px', 
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
        position: 'sticky', 
        top: 0,
        zIndex: 100 
      }}>
        {/* 로고: 홈으로 연결 */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">
            {/* ✨ 로고 이미지에 스타일 조정 */}
            <img 
              src="/hiwego_logo.png" 
              alt="히위고 로고" 
              style={{ 
                height: '35px',
                // 흰색 배경과 맞추기 위해 배경색을 흰색으로 지정합니다. (혹시 이미지에 투명하지 않은 부분이 있을 경우 대비)
                backgroundColor: 'white', 
                padding: '5px' // 클릭 영역 및 시각적 여백 확보
              }} 
            /> 
          </div>
        </Link>
        
        {/* 네비게이션 */}
        <nav>
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              style={{ 
                margin: '0 15px', 
                textDecoration: 'none', 
                color: '#333',
                fontSize: '1.1em',
                fontWeight: '500',
                transition: 'color 0.2s ease-in-out' // 호버 효과
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#007bff'} // 호버 시 색상 변경
              onMouseOut={(e) => e.currentTarget.style.color = '#333'} // 마우스 아웃 시 원래 색상
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}> {/* 헤더/푸터 높이 고려 */}
        {children}
      </main>
      
      {/* Footer (간단하게 추가) */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #eee', 
        backgroundColor: '#f8f8f8',
        color: '#666',
        fontSize: '0.9em'
      }}>
        <p>&copy; 2023 Hiwego. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;