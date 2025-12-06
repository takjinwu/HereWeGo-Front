import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import authService from '../services/authService';
import '../styles/Auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      await authService.signup(
        formData.email,
        formData.password,
        formData.nickname
      );
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-box signup-box">
          <h1 className="auth-title">히위고</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSignup} className="auth-form signup-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="아이디"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="show-password-btn">
                👁️
              </button>
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                className="auth-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="show-password-btn">
                👁️
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
              disabled={loading}
            >
              {loading ? '가입 중...' : '회원가입'}
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
