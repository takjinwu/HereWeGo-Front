import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Layout.css';

const baseNavItems = [
  { name: '여행지 추천', path: '/' },
  { name: '지역별', path: '/region' },
  { name: '테마별', path: '/theme' },
  { name: '여행지 리뷰', path: '/review' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const inputRef = useRef(null);

  const checkLoginStatus = () => {
    setIsLoggedIn(!!localStorage.getItem('authToken'));
  };

  useEffect(() => {
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (showHeaderSearch) {
      // 포커스 주기 (next tick)
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showHeaderSearch]);

  const handleLogout = () => {
    if (window.confirm("정말로 로그아웃하시겠습니까?")) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      navigate('/');
    }
  };

  const currentNavItems = [
    ...baseNavItems,
    isLoggedIn
      ? { name: '마이페이지', path: '/mypage', action: () => navigate('/mypage') }
      : { name: '로그인/회원가입', path: '/login', action: () => navigate('/login') }
  ];

  const toggleHeaderSearch = () => {
    setShowHeaderSearch((s) => !s);
  };

  const submitHeaderSearch = () => {
    const q = (headerQuery || '').trim();
    if (!q) {
      alert('검색어를 입력해주세요.');
      return;
    }
    if (!isLoggedIn) {
      // HomePage와 동일하게 로그인 필요 시 알림/이동
      alert('로그인 후 검색할 수 있습니다.');
      navigate('/login');
      return;
    }
    // 검색 페이지로 이동
    navigate(`/search?query=${encodeURIComponent(q)}`);
    // 토글 닫기 및 입력 초기화(optional)
    setShowHeaderSearch(false);
    setHeaderQuery('');
  };

  const onKeyDownHeaderInput = (e) => {
    if (e.key === 'Enter') {
      submitHeaderSearch();
    } else if (e.key === 'Escape') {
      setShowHeaderSearch(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src="/logo.png" alt="히위고 로고" className="logo-icon" />
          </div>
        </Link>

        <nav className="main-nav">
          {currentNavItems.map((item, index) => (
            <Link key={index} to={item.path} className="nav-link">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* 헤더 검색창 (토글) */}
          <div className={`header-search-container ${showHeaderSearch ? 'open' : ''}`}>
            <input
              ref={inputRef}
              className="header-search-input"
              type="text"
              placeholder="검색어를 입력하세요"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onKeyDown={onKeyDownHeaderInput}
            />
          </div>

          {/* 돋보기 버튼: 토글 + submit */}
          <button
            className="search-icon-btn"
            onClick={() => {
              if (showHeaderSearch && headerQuery.trim()) {
                submitHeaderSearch();
              } else {
                toggleHeaderSearch();
              }
            }}
            aria-label="검색"
          >
            🔍
          </button>

          {isLoggedIn && (
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 HereWeGo. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default Layout;