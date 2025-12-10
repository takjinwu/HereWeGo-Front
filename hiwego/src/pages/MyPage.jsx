import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    loginUserId: '',
    password: '••••••••', 
    region: '미지정',
    favorites: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            setLoading(true);
            
            const data = await authService.getProfile(); 
            
            setUserInfo({
                nickname: data.userName || data.nickname || 'N/A', 
                loginUserId: data.userDi || data.loginUserId || 'N/A', 
                password: '••••••••',
                region: data.region || '미지정', 
                favorites: data.favorites || []
            });
            
        } catch (err) {
            console.error('Profile load error:', err);
            setError('회원 정보를 불러올 수 없습니다. 로그아웃 후 다시 로그인해 주세요.');
            
            if (err.response?.status === 403 || err.response?.status === 401) {
                // 403 오류 시 리다이렉트 없이 토큰만 삭제하여 UI를 유지
                localStorage.removeItem('authToken');
            }
            // userInfo는 초기값인 빈 상태를 유지하여 UI에 "N/A" 표시
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, [navigate]);

  const handleGoToEdit = () => {
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
  
  return (
    <Layout>
      <div className="mypage-container">
        <div className="mypage-box">
          <h1 className="mypage-title">마이페이지</h1> 

            {/* 오류 메시지 표시 */}
            {error && <div className="error-message">{error}</div>}

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