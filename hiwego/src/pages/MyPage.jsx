import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: '여행자1',
    loginUserId: 'traveler@example.com',
    password: '••••••••',
    region: '서울',
    favorites: []
  });

  const [editData, setEditData] = useState({
    nickname: userInfo.nickname,
    loginUserId: userInfo.loginUserId,
    password: '',
    confirmPassword: ''
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = () => {
    if (editData.password && editData.password !== editData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setUserInfo(prev => ({
      ...prev,
      nickname: editData.nickname,
      loginUserId: editData.loginUserId,
      password: editData.password ? '••••••••' : prev.password
    }));

    setIsEditing(false);
    alert('정보가 수정되었습니다.');
  };

  const handleCancel = () => {
    setEditData({
      nickname: userInfo.nickname,
      loginUserId: userInfo.loginUserId,
      password: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await authService.logout();
      alert('로그아웃 되었습니다.');
      // 페이지를 새로고침하여 전체 상태를 초기화하고 헤더를 업데이트합니다.
      window.location.href = '/';
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="mypage-container">
        <div className="mypage-box">
          <h1 className="mypage-title">히위고</h1>

          {!isEditing ? (
            // 조회 모드
            <div className="profile-view">
              <div className="profile-section">
                <div className="profile-item">
                  <label>닉네임</label>
                  <p>{userInfo.nickname}</p>
                </div>

                <div className="profile-item">
                  <label>아이디</label>
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
                  onClick={() => setIsEditing(true)}
                >
                  정보 수정
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
          ) : (
            // 편집 모드
            <div className="profile-edit">
              <form className="edit-form">
                <div className="form-group">
                  <label>닉네임</label>
                  <input
                    type="text"
                    name="nickname"
                    className="edit-input"
                    value={editData.nickname}
                    onChange={handleEditChange}
                    placeholder="닉네임"
                  />
                </div>

                <div className="form-group">
                  <label>이메일</label>
                  <input
                    type="loginUserId"
                    name="loginUserId"
                    className="edit-input"
                    value={editData.loginUserId}
                    onChange={handleEditChange}
                    placeholder="이메일"
                  />
                </div>

                <div className="form-group">
                  <label>새 비밀번호 (선택사항)</label>
                  <input
                    type="password"
                    name="password"
                    className="edit-input"
                    value={editData.password}
                    onChange={handleEditChange}
                    placeholder="새 비밀번호"
                  />
                </div>

                <div className="form-group">
                  <label>비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="edit-input"
                    value={editData.confirmPassword}
                    onChange={handleEditChange}
                    placeholder="비밀번호 확인"
                  />
                </div>

                <div className="edit-actions">
                  <button
                    type="button"
                    className="save-button"
                    onClick={handleSaveEdit}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
