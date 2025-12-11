import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import { getFavorites, removeFavorite } from '../utils/favorites';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [favorites, setFavorites] = useState([]);
  
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    loginUserId: '',
    password: '••••••••', 
    region: '미지정',
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
        });
      } catch (err) {
        console.error('Profile load error:', err);
        setError('회원 정보를 불러올 수 없습니다. 로그아웃 후 다시 로그인해 주세요.');
        
        if (err.response?.status === 403 || err.response?.status === 401) {
          localStorage.removeItem('authToken');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const favList = getFavorites();
    setFavorites(favList);
  }, []);

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

  const handleRemoveFavorite = (title) => {
    if (window.confirm('이 여행지를 즐겨찾기에서 제거하시겠습니까?')) {
      removeFavorite(title);
      setFavorites(favorites.filter(fav => fav.title !== title));
      alert('즐겨찾기가 제거되었습니다.');
    }
  };

  if (loading) return <Layout><div className="mypage-container"><div className="loading">프로필 로드 중...</div></div></Layout>;
  
  return (
    <Layout>
      <div className="mypage-container">
        <div className="mypage-box">
          <h1 className="mypage-title">마이페이지</h1> 

          {error && <div className="error-message">{error}</div>}

          {/* 탭 버튼 */}
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              회원 정보
            </button>
            <button 
              className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              즐겨찾기 ({favorites.length})
            </button>
          </div>

          {/* 프로필 탭 */}
          {activeTab === 'profile' && (
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
          )}

          {/* 즐겨찾기 탭 */}
          {activeTab === 'favorites' && (
            <div className="favorites-view">
              {favorites.length === 0 ? (
                <div className="empty-message">
                  <p>❤️ 아직 즐겨찾기한 여행지가 없습니다.</p>
                  <p>마음에 드는 여행지를 추가해보세요!</p>
                </div>
              ) : (
                <div className="favorites-list">
                  {favorites.map((fav, index) => (
                    <div key={index} className="favorite-card">
                      {fav.firstimage && (
                        <div className="fav-image-wrapper">
                          <img src={fav.firstimage} alt={fav.title} className="fav-image" />
                        </div>
                      )}
                      
                      <div className="fav-info">
                        <h3 className="fav-title">{fav.title}</h3>
                        <p className="fav-address">📍 {fav.addr1}</p>
                        {fav.tel && <p className="fav-tel">📞 {fav.tel}</p>}
                        {fav.overview && (
                          <p className="fav-overview">{fav.overview.substring(0, 100)}...</p>
                        )}
                      </div>
                      
                      <div className="fav-actions">
                        <button 
                          className="fav-remove-button"
                          onClick={() => handleRemoveFavorite(fav.title)}
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
