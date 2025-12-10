import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/ProfileEditPage.css';

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    
    // 프론트엔드 상태 관리
    const [formData, setFormData] = useState({
        userDi: '', 
        nickname: '', 
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    
    const [deletePassword, setDeletePassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d|.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // 1. 사용자 프로필 정보 로드 
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                console.log('🔵 [프로필 로드 시작] API 호출 중...');
                
                const data = await authService.getProfile(); 
                console.log('🟢 [프로필 로드 성공] 응답 데이터:', data);
                
                setProfile(data);
                
                setFormData(prev => ({
                    ...prev,
                    userDi: data.loginUserId || data.userId || data.userDi || '', 
                    nickname: data.userName || data.nickname || '', 
                }));
                console.log('🔹 [상태 초기화 완료] formData:', {
                    userDi: data.loginUserId || data.userId || data.userDi || '', 
                    nickname: data.userName || data.nickname || ''
                });

            } catch (err) {
                console.error('🔴 [프로필 로드 실패]:', err);
                setError('프로필 정보를 불러오는 데 실패했습니다.');
                
                if (err.response?.status === 403 || err.response?.status === 401) {
                    console.warn('⚠️ 인증 실패 (403/401) -> 로그인 페이지 이동');
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
        
        const currentNickname = profile.userName || profile.nickname;
        console.log(`🔸 [닉네임 수정 시도] 입력값: "${formData.nickname}", 기존값: "${currentNickname}"`);

        if (formData.nickname === currentNickname) { 
            console.log('🚫 [중단] 닉네임 변경사항 없음');
            setError('닉네임을 변경해야 저장할 수 있습니다.');
            return;
        }

        if (!isEditMode) {
             return; 
        }
        
        try {
            const apiPayload = { newNickname: formData.nickname };
            console.log('🚀 [API 전송] updateNickname 요청:', apiPayload);

            const response = await authService.updateNickname(apiPayload); 
            console.log('✅ [API 성공] 응답:', response);
            
            alert('닉네임이 성공적으로 변경되었습니다.');
            
            setProfile(prev => ({ 
                ...prev, 
                nickname: formData.nickname,
                userName: formData.nickname 
            })); 
            setIsEditMode(false); 
        } catch (err) {
            console.error('🔴 [닉네임 수정 실패]:', err);
            setError('닉네임 변경에 실패했습니다. (중복, 서버 오류 등)');
            setIsEditMode(true); 
        }
    };

    // 3. 비밀번호 수정 처리
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');
        console.log('🔸 [비밀번호 변경 시도]');

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
            console.log('🚀 [API 전송] updatePassword 요청');
            await authService.updatePassword(formData.currentPassword, formData.newPassword); 
            console.log('✅ [API 성공] 비밀번호 변경 완료');
            
            alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
            
            localStorage.removeItem('authToken');
            navigate('/login');
            
        } catch (err) {
            console.error('🔴 [비밀번호 변경 실패]:', err);
            setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
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
            console.log('🚀 [API 전송] deleteAccount 요청');
            await authService.deleteAccountWithPassword(deletePassword); 
            console.log('✅ [API 성공] 회원 탈퇴 완료');
            
            alert('계정 삭제가 완료되었습니다. 이용해주셔서 감사합니다.');
            localStorage.clear(); 
            navigate('/'); 
        } catch (err) {
            console.error('🔴 [회원 탈퇴 실패]:', err);
            setError('회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
        }
    };
    
    // 닉네임 수정 취소
    const handleCancelEdit = () => {
        console.log('🔹 [취소] 닉네임 수정 취소');
        setFormData(prev => ({
            ...prev,
            nickname: profile.userName || profile.nickname || ''
        }));
        setIsEditMode(false);
        setError('');
    }

    if (loading) return <Layout><div className="loading">프로필 로드 중...</div></Layout>;

    return (
        <Layout>
            <div className="profile-edit-page">
                <div className="edit-container">
                    <h1>회원 정보 수정</h1>
                    {error && <p className="error-message">{error}</p>}
                    
                    {/* 1. 아이디 */}
                    <div className="profile-section">
                        <h3>아이디</h3>
                        <input type="text" value={formData.userDi} readOnly className="read-only-input" />
                    </div>

                    {/* 2. 닉네임 수정 */}
                    <form onSubmit={handleNicknameUpdate} className="profile-section">
                        <h3>닉네임 수정</h3>
                        <div className="input-with-button">
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                required
                            />
                            {isEditMode ? (
                                <button type="button" onClick={handleCancelEdit}>수정 취소</button>
                            ) : (
                                <button type="button" onClick={() => setIsEditMode(true)}>수정</button>
                            )}

                            {isEditMode && (
                                <button type="submit" className="save-btn">저장</button>
                            )}
                        </div>
                    </form>

                    <hr />

                    {/* 3. 비밀번호 변경 */}
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