import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import '../styles/Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 실제 로그인 로직은 여기에 구현
    console.log('로그인 시도:', { email, password });
    // 임시로 홈으로 이동
    navigate('/');
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">히위고</h1>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="아이디"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="비밀번호"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="show-password-btn">
                👁️
              </button>
            </div>

            <button type="submit" className="auth-button login-button">
              로그인
            </button>
          </form>

          <p className="auth-link">
            회원이 아니신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
