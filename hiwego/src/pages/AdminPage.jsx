import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; 
import '../../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState(null); // 접근 권한 오류

  // 1. 관리자 권한 확인 및 회원 목록 API 호출
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAccessError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const checkAdminAndFetchUsers = async () => {
      try {
        // 토큰 디코딩하여 권한 확인
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.auth; // 토큰 페이로드에 'auth' 필드로 권한이 있다고 가정

        if (userRole !== 'ROLE_ADMIN') {
          setAccessError('접근 권한이 없습니다. 관리자만 접근 가능합니다.');
          return;
        }

        // 권한이 있으면 회원 목록 API 호출
        const data = await authService.getUsers(); 
        
        // API 응답 데이터 구조에 맞게 사용자 목록 설정 (예시: data.users)
        setUserList(data.users || data.list || data); 

      } catch (err) {
        console.error('관리자 데이터 로드 실패:', err);
        setAccessError('데이터 로드 실패 또는 토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [navigate]);

  // ⭐ 2. 회원 삭제 핸들러
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`${userId} 님의 계정을 정말로 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // API 엔드포인트: /api/v1/admin/delete-user/{userId}
      await authService.adminDeleteUser(userId); 
      
      // 삭제 성공 후 목록에서 해당 사용자 제거
      setUserList(userList.filter(user => user.userId !== userId)); 
      alert(`${userId} 님의 계정이 성공적으로 삭제되었습니다.`);

    } catch (err) {
      console.error('계정 삭제 실패:', err);
      alert('계정 삭제에 실패했습니다: 권한 또는 서버 문제');
    }
  };
  
  // 3. 로딩, 오류, 접근 거부 시 렌더링
  if (loading) {
    return <Layout><div className="admin-container"><div className="loading-message">회원 목록을 불러오는 중입니다...</div></div></Layout>;
  }
  if (accessError) {
    return <Layout><div className="admin-container"><div className="error-message">❌ 접근 오류: {accessError}</div></div></Layout>;
  }


  return (
    <Layout>
      <div className="admin-container">
        <h1 className="admin-title">회원 관리</h1>

        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>가입일자</th>
                <th>아이디</th>
                <th>닉네임</th> {/* '성명' 대신 닉네임 사용 가정 */}
                <th>회원 관리</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.userId || user.loginUserId}>
                  <td>{user.joinDate || 'N/A'}</td> {/* 필드명은 백엔드 응답에 맞게 수정 필요 */}
                  <td>{user.loginUserId}</td>
                  <td>{user.nickname}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.loginUserId)}
                    >
                      삭제 버튼?
                    </button>
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