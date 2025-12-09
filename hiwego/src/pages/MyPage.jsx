import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  
  // 로딩 및 오류 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ⭐ 초기 사용자 정보 상태 (하드코딩 제거, 빈 값으로 초기화)
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    loginUserId: '',
    password: '••••••••', // 비밀번호는 항상 마스킹 처리
    region: '미지정',
    favorites: []
  });

  // ⭐ 1. 컴포넌트 로드 시 사용자 정보 로드 (필수 로직)
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            setLoading(true);
            // GET /api/v1/user 엔드포인트를 호출
            const data = await authService.getProfile(); 
            
            console.log('Profile data:', data);
            
            setUserInfo({
                nickname: data.nickname || data.userName || 'N/A',
                loginUserId: data.loginUserId || data.userDi || data.userId || 'N/A',
                password: '••••••••',
                region: data.region || '미지정', 
                favorites: data.favorites || []
            });
            
        } catch (err) {
            console.error('Profile load error:', err);
            console.error('Error response:', err.response);
            setError('사용자 정보를 불러오는 데 실패했습니다.');
            
            // 403 Forbidden 오류 시 로그인 페이지로 리다이렉트 처리
            if (err.response?.status === 403 || err.response?.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
                return;
            }
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, [navigate]);  // ⭐ 2. 정보 수정 및 계정 삭제는 전용 페이지로 라우팅 (ProfileEditPage)
  const handleGoToEdit = () => {
      // App.jsx에 정의된 /profile/edit 경로 사용
      navigate('/profile/edit'); 
  }
  
  const handleDeleteAccount = () => {
      if (window.confirm('계정 삭제는 회원 정보 수정 페이지에서 비밀번호 확인 후 진행됩니다. 이동하시겠습니까?')) {
          navigate('/profile/edit'); 
      }
  };
  
  const handleLogout = async () => {
      if (window.confirm('로그아웃 하시겠습니까?')) {
          try {
              await authService.logout(); 
          } catch(e) {
              console.error('Logout API failed but proceeding with client logout:', e);
          }
          
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          alert('로그아웃 되었습니다.');
          window.location.href = '/'; 
      }
  };

  // 로딩 및 오류 화면
  if (loading) return <Layout><div className="mypage-container"><div className="loading">프로필 로드 중...</div></div></Layout>;
  if (error) return <Layout><div className="mypage-container"><div className="error-message">{error}</div></div></Layout>;

  return (
    <Layout>
      <div className="mypage-container">
        <div className="mypage-box">
          <h1 className="mypage-title">마이페이지</h1> 

          {/* 조회 모드 (isEditing 관련 코드를 제거하여 깔끔하게 만듭니다.) */}
          <div className="profile-view">
            <div className="profile-section">
              <div className="profile-item">
                <label>닉네임</label>
                <p>{userInfo.nickname}</p>
              </div>

              <div className="profile-item">
                <label>아이디 (이메일)</label>
                <p>{userInfo.loginUserId}</p>
              </div>

              <div className="profile-item">
                <label>비밀번호</label>
                <p>{userInfo.password}</p>
              </div>

              <div className="profile-item">
                <label>선호 지역</label>
                <p>{userInfo.region}</p>
              </div>
            </div>

            <div className="profile-actions">
              
              <button 
                className="action-button edit-button"
                onClick={handleGoToEdit}
              >
                회원 정보 수정
              </button>
              <button 
                className="action-button logout-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <button 
                className="action-button delete-button"
                onClick={handleDeleteAccount}
              >
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;