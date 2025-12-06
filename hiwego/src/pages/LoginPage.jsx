import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/Auth.css';

const LoginPage = () => {
  const [loginUserId, setLoginUserId] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginUserId || !password) { 
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      await authService.login(loginUserId, password); 
      alert('로그인에 성공했습니다! 메인 페이지로 이동합니다.');
      navigate('/'); 
    } catch (err) {
      console.error('로그인 실패:', err);
      const errorMessage = (typeof err === 'string' ? err : err.message) || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      setError(errorMessage);
    }
  };

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
                name="loginUserId" // name도 명확하게 변경
                placeholder="아이디" // 메시지를 '아이디'로 변경
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