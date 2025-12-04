import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Layout.css';

const navItems = [
  { name: '여행지 추천', path: '/' },
  { name: '지역별', path: '/region' },
  { name: '테마별', path: '/theme' },
  { name: '로그인/회원가입', path: '/login' }, 
];

const Layout = ({ children }) => { 
  return (
    <div className="app-container">
      {/* 헤더 */}
      <header className="app-header">
        {/* 로고 */}
        <Link to="/" className="logo-link">
          <div className="logo">
            {/* 사진 파일로 대체 - /public/logo.png 또는 원하는 이름의 사진을 사용하세요 */}
            <img src="/logo.png" alt="히위고 로고" className="logo-icon" />
          </div>
        </Link>
        
        {/* 네비게이션 */}
        <nav className="main-nav">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 검색 및 사용자 메뉴 */}
        <div className="header-actions">
          <button className="search-icon-btn">🔍</button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content"> 
        {children}
      </main>
      
      {/* 푸터 */}
      <footer className="app-footer">
        <p>&copy; 2024 HereWeGo. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default Layout;