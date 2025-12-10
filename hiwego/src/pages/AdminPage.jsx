import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
// CSS 파일 경로가 맞는지 확인해주세요. 없으면 주석 처리해도 됩니다.
import '../styles/AdminPage.css'; 

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ⭐ [핵심] 브라우저 호환 토큰 디코딩 함수 (Buffer 사용 안 함)
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

  // 1. 페이지 진입 시 관리자 권한 확인
  useEffect(() => {
    console.log('=== AdminPage 권한 확인 시작 ===');
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // ⭐ 안전한 함수로 토큰 디코딩
    const decoded = parseJwt(token);
    console.log('Decoded Token:', decoded);

    let isAdmin = false;

    if (decoded) {
      // auth 또는 role 필드 확인 (백엔드 설정에 따라 다름)
      const roles = decoded.auth || decoded.role || '';
      console.log('User Roles:', roles);

      if (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')) {
        isAdmin = true;
      }
    }

    console.log('Final isAdmin:', isAdmin);

    if (!isAdmin) {
      alert('관리자만 접근할 수 있는 페이지입니다.');
      navigate('/'); // 권한 없으면 홈으로 이동
      return;
    }

    // 관리자 확인 완료되면 데이터 로드
    fetchUsers();
  }, [navigate]);

  // 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getUsers();
      // 데이터가 배열인지, 객체 안의 list인지 확인하여 처리
      setUsers(Array.isArray(data) ? data : data.list || []);
    } catch (err) {
      console.error('회원 목록 로드 실패:', err);
      // 403 에러일 경우 메시지 처리
      if (err.response && err.response.status === 403) {
          setError('데이터 접근 권한이 없습니다. (403)');
      } else {
          setError('회원 목록을 불러오지 못했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 회원 강제 탈퇴 핸들러
  const handleDeleteUser = async (userId, nickname) => {
    if (!window.confirm(`정말 '${nickname}' 회원을 강제 탈퇴시키겠습니까?`)) {
      return;
    }

    try {
      await authService.adminDeleteUser(userId);
      alert('회원이 성공적으로 탈퇴 처리되었습니다.');
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      console.error('회원 삭제 실패:', err);
      alert('회원 삭제에 실패했습니다.\n' + (err.message || '알 수 없는 오류'));
    }
  };

  if (loading) return <Layout><div className="loading" style={{textAlign:'center', marginTop:'50px'}}>관리자 권한 확인 및 데이터 로드 중...</div></Layout>;

  return (
    <Layout>
      <div className="admin-container" style={{maxWidth: '1000px', margin: '40px auto', padding: '20px'}}>
        <h1 className="admin-title" style={{textAlign: 'center', marginBottom: '30px'}}>관리자 페이지</h1>
        
        {error && <div className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</div>}

        <div className="user-table-container">
          <table className="user-table" style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#f4f4f4'}}>
                <th style={{padding: '12px', borderBottom: '1px solid #ddd'}}>ID (DB)</th>
                <th style={{padding: '12px', borderBottom: '1px solid #ddd'}}>아이디</th>
                <th style={{padding: '12px', borderBottom: '1px solid #ddd'}}>닉네임</th>
                <th style={{padding: '12px', borderBottom: '1px solid #ddd'}}>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId || user.userDi || user.id}> 
                    <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{user.userId || user.id}</td>
                    <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{user.loginUserId || user.userDi}</td>
                    <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>{user.userName || user.nickname}</td>
                    <td style={{padding: '12px', borderBottom: '1px solid #ddd'}}>
                      <button 
                        onClick={() => handleDeleteUser(user.userId || user.id, user.userName || user.nickname)}
                        style={{
                            backgroundColor: '#ff4d4f', color: 'white', border: 'none', 
                            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        강제 탈퇴
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>가입된 회원이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;