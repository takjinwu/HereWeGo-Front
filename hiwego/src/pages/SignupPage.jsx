import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/Auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    loginUserId: '', 
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setLoading(true);

    try {
      const { loginUserId, password, nickname } = formData;
      await authService.signup(loginUserId, password, nickname);
      
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login'); 
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMessage = error.message || '다시 시도해주세요.';
      setError('회원가입에 실패했습니다. ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-box signup-box">
          <h1 className="auth-title">히위고</h1>
          
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSignup} className="auth-form signup-form">
            <div className="form-group">
              <input
                type="text" 
                name="loginUserId" // 💡 name 속성 변경
                placeholder="아이디" // 💡 placeholder 메시지 변경
                className="auth-input"
                value={formData.loginUserId} // 💡 상태 값 변경
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="비밀번호 확인"
                className="auth-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="nickname"
                placeholder="닉네임"
                className="auth-input"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button signup-button"
              disabled={loading} // 로딩 중 비활성화
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          <p className="auth-link">
            이미 회원이신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;