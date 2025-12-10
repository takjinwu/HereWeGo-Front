// src/pages/LoginPage.jsx (수정)

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/Auth.css';

const LoginPage = () => {
  const [loginUserId, setLoginUserId] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginUserId || !password) { 
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await authService.login(loginUserId, password); 
      
      const token = response?.accessToken || response?.token;

      if (token) {
          localStorage.setItem('authToken', token);
          
          // 사용자 정보 가져오기
          try {
            const userProfile = await authService.getProfile();
            console.log('User profile:', userProfile);
            localStorage.setItem('user', JSON.stringify(userProfile));
          } catch (profileErr) {
            console.error('프로필 로드 실패:', profileErr);
          }
          
          alert('로그인에 성공했습니다!');
          
          // 이전 페이지로 돌아가기 (없으면 메인 페이지)
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
      } else {
          setError('로그인에 성공했으나, 인증 토큰을 받지 못했습니다. 서버 설정을 확인해주세요.');
      }
      
    } catch (err) {
      console.error('로그인 실패:', err);
      const errorMessage = (typeof err === 'string' ? err : err.message) || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      setError(errorMessage);
    }
  };
    
    // ... (return JSX 유지) ...

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">히위고</h1>
          
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <input
                type="text" 
                name="loginUserId"
                placeholder="아이디"
                className="auth-input"
                value={loginUserId} 
                onChange={(e) => setLoginUserId(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>

            <button type="submit" className="auth-button login-button">
              로그인
            </button>
          </form>

          <p className="auth-link">
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;