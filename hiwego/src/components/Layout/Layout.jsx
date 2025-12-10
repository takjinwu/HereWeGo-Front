import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Layout.css';

const baseNavItems = [
  { name: '여행지 추천', path: '/' },
  { name: '지역별', path: '/region' },
  { name: '테마별', path: '/theme' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const inputRef = useRef(null);

  // [내부 함수] 토큰 디코딩
  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Token decode failed:', e);
      return null;
    }
  };

  // ⭐ 관리자 권한 확인 함수 (수정됨: 문자열 포함 여부 확인)
  const checkStatus = () => {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);

    let isAdmin = false;

    // 1. 토큰 직접 확인
    if (token) {
        const decoded = parseJwt(token);
        if (decoded) {
            // auth 또는 role 필드 값 가져오기
            const roles = decoded.role || decoded.auth || '';
            console.log("🔑 [Layout] 토큰 권한 확인:", roles);
            
            // ⭐ 수정: 'ROLE_ADMIN'이나 'ADMIN'이 포함되어 있으면 관리자로 인정
            if (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')) {
                isAdmin = true;
            }
        }
    }

    // 2. user 객체 확인 (백업)
    if (!isAdmin && userJson) {
      try {
        const user = JSON.parse(userJson);
        const userRoles = user.role || '';
        // ⭐ 수정: 여기서도 포함 여부 확인
        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ADMIN')) {
            isAdmin = true;
        }
      } catch (e) {
        console.error("User parsing error", e);
      }
    }

    console.log("🏁 [Layout] 최종 관리자 여부:", isAdmin);
    setIsUserAdmin(isAdmin);
  };

  useEffect(() => {
    checkStatus();
    window.addEventListener('storage', checkStatus);
    window.addEventListener('loginStateChange', checkStatus);
    return () => {
      window.removeEventListener('storage', checkStatus);
      window.removeEventListener('loginStateChange', checkStatus);
    };
  }, []);

  // ... (이하 검색창 및 UI 로직은 기존 코드 그대로 유지) ...
  useEffect(() => {
    if (showHeaderSearch) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showHeaderSearch]);

  const toggleHeaderSearch = () => setShowHeaderSearch((s) => !s);

  const submitHeaderSearch = () => {
    const q = (headerQuery || '').trim();
    if (!q) return alert('검색어를 입력해주세요.');
    if (!isLoggedIn) {
        alert('로그인 후 검색할 수 있습니다.');
        return navigate('/login');
    }
    navigate(`/search?query=${encodeURIComponent(q)}`);
    setShowHeaderSearch(false);
    setHeaderQuery('');
  };

  const onKeyDownHeaderInput = (e) => {
    if (e.key === 'Enter') submitHeaderSearch();
    else if (e.key === 'Escape') setShowHeaderSearch(false);
  };

  const handleLogout = () => {
    if (window.confirm("정말로 로그아웃하시겠습니까?")) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('loginStateChange'));
      alert("로그아웃 되었습니다.");
      navigate('/');
    }
  };

  const currentNavItems = [
    ...baseNavItems,
    isLoggedIn
      ? { name: '마이페이지', path: '/mypage' }
      : { name: '로그인/회원가입', path: '/login' }
  ];

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

          {/* ⭐ 관리자 버튼 */}
          {isUserAdmin && (
             <Link to="/admin" className="nav-link admin-link" style={{color: '#ff4d4f', fontWeight: 'bold'}}>
                관리자
             </Link>
          )}
        </nav>

        <div className="header-actions">
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
          <button
            className="search-icon-btn"
            onClick={() => (showHeaderSearch && headerQuery.trim() ? submitHeaderSearch() : toggleHeaderSearch())}
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