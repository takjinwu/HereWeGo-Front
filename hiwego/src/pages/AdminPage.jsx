import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import { decodeTokenPayload } from '../utils/jwtUtils';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 페이지 진입 시 관리자 권한 확인
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
    }

    // ⭐ 안전한 디코딩 함수 사용
    const decoded = decodeTokenPayload(token);
    let isAdmin = false;

    if (decoded) {
        // auth 또는 role 필드 확인 (includes 사용)
        const userRoles = decoded.auth || decoded.role || '';
        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ADMIN')) {
            isAdmin = true;
        }
    }

    if (!isAdmin) {
        alert('관리자만 접근할 수 있습니다.');
        navigate('/');
        return;
    }

    // 권한 확인되면 데이터 로드
    fetchUsers();
  }, [navigate]);

  // 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getUsers();
      setUsers(Array.isArray(data) ? data : data.list || []);
    } 
     finally {
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
      fetchUsers();
    } catch (err) {
      alert('회원 삭제에 실패했습니다.');
    }
  };

  if (loading) return <Layout><div className="loading">데이터 로드 중...</div></Layout>;

  return (
    <Layout>
      <div className="admin-container">
        <h1 className="admin-title">관리자 페이지</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>아이디</th>
                <th>닉네임</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                  <tr key={user.userId || user.id}> 
                    <td>{user.userId || user.id}</td>
                    <td>{user.loginUserId || user.userDi}</td>
                    <td>{user.userName || user.nickname}</td>
                    <td>
                      <button className="admin-delete-btn" onClick={() => handleDeleteUser(user.userId || user.id, user.userName || user.nickname)}>탈퇴</button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;