import React, { useState, useEffect } from 'react'; // 💡 useState, useEffect 추가
import { Link, useNavigate } from 'react-router-dom'; // 💡 useNavigate 추가
import '../../styles/Layout.css';

// 💡 기본 네비게이션 항목 (로그인과 마이페이지는 동적으로 처리)
const baseNavItems = [
  { name: '여행지 추천', path: '/' },
  { name: '지역별', path: '/region' },
  { name: '테마별', path: '/theme' },
];

const Layout = ({ children }) => { 
    const navigate = useNavigate(); // 💡 useNavigate 훅 사용
    // 💡 토큰 유무에 따라 로그인 상태를 초기화
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    // 💡 토큰 변화를 감지하고 상태를 업데이트하는 함수
    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem('authToken'));
    };

    // 💡 로그인/로그아웃 이벤트 리스너 설정
    useEffect(() => {
        // [옵션] window 객체에 커스텀 이벤트를 설정하여 로그인 성공 시 상태 업데이트를 강제할 수 있습니다.
        // 이 코드가 없더라도, 페이지 이동(navigate) 시 Layout은 다시 마운트되어 상태를 확인합니다.
        window.addEventListener('storage', checkLoginStatus); // localStorage 변경 감지
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    // 💡 로그아웃 핸들러
const handleLogout = () => {
        if (window.confirm("정말로 로그아웃하시겠습니까?")) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsLoggedIn(false); 
            
            alert("로그아웃 되었습니다."); 
            
            navigate('/'); 
        }
    };

    // 💡 현재 로그인 상태에 따라 네비게이션 항목 동적 생성
    const currentNavItems = [
        ...baseNavItems,
        isLoggedIn
            ? { name: '마이페이지', path: '/mypage', action: () => navigate('/mypage') } // 💡 로그인 시 마이페이지
            : { name: '로그인/회원가입', path: '/login', action: () => navigate('/login') } // 💡 비로그인 시 로그인
    ];


  return (
    <div className="app-container">
      {/* 헤더 */}
      <header className="app-header">
        {/* 로고 (변경 없음) */}
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src="/logo.png" alt="히위고 로고" className="logo-icon" />
          </div>
        </Link>
        
        {/* 네비게이션 */}
        <nav className="main-nav">
          {currentNavItems.map((item, index) => (
            <Link 
              key={index} 
              // 마이페이지/로그인 링크는 to 속성을 사용
              to={item.path}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
                  <button className="search-icon-btn">🔍</button>
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="logout-btn">
                            로그아웃
                        </button>
                    )}
        </div>
      </header>

      {/* 메인 콘텐츠 및 푸터 (변경 없음) */}
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