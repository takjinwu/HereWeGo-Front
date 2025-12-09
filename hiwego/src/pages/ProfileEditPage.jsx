// src/pages/ProfileEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/ProfileEditPage.css';

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [formData, setFormData] = useState({
        userDi: '', // 아이디 (읽기 전용)
        userName: '', // 닉네임
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [deletePassword, setDeletePassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false); // 닉네임 수정 모드

    // 비밀번호 정규식 (8자 이상, 영문/숫자/특수문자 중 2가지 이상 조합 가정)
    const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d|.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // 1. 사용자 프로필 정보 로드 (마이페이지 진입 시 실행)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                // '자신 정보 조회' API 호출: GET /api/v1/user/me
                const data = await authService.getProfile(); 
                
                setProfile(data);
                setFormData(prev => ({
                    ...prev,
                    // ⭐ 백엔드 파라미터: 아이디(userDi), 닉네임(userName) 사용
                    userDi: data.loginUserId || data.userId || data.loginUserId || '', 
                    userName: data.userName || data.nickname || '',
                }));
            } catch (err) {
                setError('프로필 정보를 불러오는 데 실패했습니다.');
                console.error('Profile load error:', err);
                if (err.response?.status === 403 || err.response?.status === 401) {
                    // 토큰 만료 시 로그인 페이지로 리다이렉트
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    // 2. 닉네임 수정 처리
    const handleNicknameUpdate = async (e) => {
        e.preventDefault();
        setError('');
        // ⭐ 백엔드 파라미터 'userName' 사용
        if (formData.userName === (profile.userName || profile.nickname)) { 
            setError('닉네임을 변경해야 저장할 수 있습니다.');
            return;
        }
        
        try {
            // ⭐ 닉네임 변경 API: PUT /api/v1/user/nickname
            await authService.updateNickname(formData.userName); 
            alert('닉네임이 성공적으로 변경되었습니다.');
            setProfile(prev => ({ ...prev, userName: formData.userName, nickname: formData.userName })); 
            setIsEditMode(false);
        } catch (err) {
            setError('닉네임 변경에 실패했습니다. (중복, 서버 오류 등)');
            console.error('Nickname update error:', err);
        }
    };

    // 3. 비밀번호 수정 처리
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
            setError('모든 비밀번호 필드를 채워주세요.');
            return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!PASSWORD_COMPLEXITY_REGEX.test(formData.newPassword)) {
            setError('새 비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.');
            return;
        }

        try {
            // ⭐ 비밀번호 변경 API: PUT /api/v1/user/password
            await authService.updatePassword(formData.currentPassword, formData.newPassword); 
            alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
            
            // 변경 후 로그아웃 처리
            localStorage.removeItem('authToken');
            navigate('/login');
            
        } catch (err) {
            setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
            console.error('Password update error:', err);
        }
    };

    // 4. 회원 탈퇴 처리
    const handleDeleteAccount = async () => {
        setError('');
        if (!deletePassword) {
            alert('탈퇴를 위해 비밀번호를 입력해주세요.');
            return;
        }
        if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        try {
            // ⭐ 계정 삭제 API: DELETE /api/v1/user/account
            await authService.deleteAccountWithPassword(deletePassword); 
            alert('계정 삭제가 완료되었습니다. 이용해주셔서 감사합니다.');
            localStorage.clear(); 
            navigate('/'); 
        } catch (err) {
            setError('회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
            console.error('Delete account error:', err);
        }
    };

    if (loading) return <Layout><div className="loading">프로필 로드 중...</div></Layout>;

    return (
        <Layout>
            <div className="profile-edit-page">
                <div className="edit-container">
                    <h1>회원 정보 수정</h1>
                    {error && <p className="error-message">{error}</p>}
                    
                    {/* 1. 아이디 (읽기 전용 - userDi) */}
                    <div className="profile-section">
                        <h3>아이디</h3>
                        <input type="text" value={formData.userDi} readOnly className="read-only-input" />
                    </div>

                    {/* 2. 닉네임 수정 (userName) */}
                    <form onSubmit={handleNicknameUpdate} className="profile-section">
                        <h3>닉네임 수정</h3>
                        <div className="input-with-button">
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                required
                            />
                            <button type="button" onClick={() => setIsEditMode(!isEditMode)}>
                                {isEditMode ? '수정 취소' : '수정'}
                            </button>
                            {isEditMode && (
                                <button type="submit" className="save-btn">저장</button>
                            )}
                        </div>
                    </form>

                    <hr />

                    {/* 3. 비밀번호 변경 (userPw) */}
                    <form onSubmit={handlePasswordUpdate} className="profile-section">
                        <h3>비밀번호 변경</h3>
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="현재 비밀번호"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="새 비밀번호 (8자 이상, 복잡성 요구)"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="새 비밀번호 확인"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="change-pw-btn">비밀번호 변경</button>
                    </form>

                    <hr />

                    {/* 4. 회원 탈퇴 */}
                    <div className="profile-section delete-section">
                        <h3>회원 탈퇴</h3>
                        <input
                            type="password"
                            placeholder="탈퇴를 위해 비밀번호를 입력하세요"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            className="delete-btn" 
                            onClick={handleDeleteAccount}
                        >
                            회원 탈퇴하기
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileEditPage;