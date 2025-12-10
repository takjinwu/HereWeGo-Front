// src/pages/ReviewFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import reviewService from '../services/reviewService';
import attractionService from '../services/attractionService';
import '../styles/ReviewFormPage.css';

const ReviewFormPage = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams();

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    region: '',
    spotContentId: ''
  });

  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [showAttractionDropdown, setShowAttractionDropdown] = useState(false);
  const [attractionSearch, setAttractionSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 유저 정보
  const [currentUser, setCurrentUser] = useState(null);

  // 지역 목록
  const REGIONS = ['수도권', '강원권', '충청권', '전라권', '경상권', '제주도'];

  useEffect(() => {
    // 로그인 유저 확인
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('user');
    if (!token || !userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      setCurrentUser(JSON.parse(userInfo));
    } catch (e) {
      console.error('유저 정보 파싱 실패:', e);
      navigate('/login');
    }

    // 수정 모드인 경우 기존 리뷰 데이터 로드
    if (reviewId) {
      loadReviewData();
    }
  }, [reviewId, navigate]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      const reviewData = await reviewService.getReviewDetail(reviewId);
      setFormData({
        title: reviewData.title,
        content: reviewData.content,
        region: reviewData.region,
        spotContentId: reviewData.spotContentId || ''
      });
    } catch (err) {
      setError('리뷰 데이터를 불러올 수 없습니다.');
      console.error('Error loading review:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttractionsByRegion = async (region) => {
    if (!region) {
      setAttractions([]);
      setFilteredAttractions([]);
      return;
    }

    try {
      const data = await attractionService.getRegionList(region);
      console.log('지역 여행지 API 응답:', data);
      setAttractions(data || []);
      setFilteredAttractions(data || []);
      setAttractionSearch('');
    } catch (err) {
      console.error('Error fetching attractions:', err);
      setAttractions([]);
      setFilteredAttractions([]);
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData({ ...formData, region, spotContentId: '' });
    fetchAttractionsByRegion(region);
  };

  const handleAttractionSearch = (value) => {
    setAttractionSearch(value);
    if (value.trim()) {
      const filtered = attractions.filter(
        (attraction) =>
          attraction.title?.toLowerCase().includes(value.toLowerCase()) ||
          attraction.addr1?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAttractions(filtered);
    } else {
      setFilteredAttractions(attractions);
    }
  };

  const handleAttractionSelect = (attraction) => {
    setFormData({
      ...formData,
      spotContentId: attraction.contentid || attraction.id || ''
    });
    setAttractionSearch(attraction.title);
    setShowAttractionDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    if (!formData.region) {
      alert('지역을 선택하세요.');
      return;
    }

    if (!formData.spotContentId) {
      alert('여행지를 선택하세요.');
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      if (reviewId) {
        // 수정 모드
        await reviewService.updateReview(reviewId, formData);
        alert('리뷰가 수정되었습니다.');
        navigate(`/review/${reviewId}`);
      } else {
        // 생성 모드
        const result = await reviewService.createReview(formData);
        alert('리뷰가 작성되었습니다.');
        navigate(`/review/${result.id || ''}`);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || '리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    if (reviewId) {
      navigate(`/review/${reviewId}`);
    } else {
      navigate('/review');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="review-form-page">
          <div className="loading">로딩 중입니다...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="review-form-page">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">
              {reviewId ? '리뷰 수정' : '새 리뷰 작성'}
            </h1>
            <p className="form-subtitle">
              {reviewId
                ? '리뷰를 수정하세요'
                : '다른 사람들과 여행지 경험을 공유하세요'}
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form className="review-form" onSubmit={handleSubmit}>
            {/* 제목 */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                제목 <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="form-input"
                placeholder="리뷰 제목을 입력하세요"
                value={formData.title}
                onChange={handleInputChange}
                maxLength="100"
              />
              <span className="char-count">
                {formData.title.length}/100
              </span>
            </div>

            {/* 지역 선택 */}
            <div className="form-group">
              <label htmlFor="region" className="form-label">
                지역 <span className="required">*</span>
              </label>
              <select
                id="region"
                name="region"
                className="form-select"
                value={formData.region}
                onChange={handleRegionChange}
              >
                <option value="">지역을 선택하세요</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* 여행지 선택 */}
            {formData.region && (
              <div className="form-group">
                <label htmlFor="attraction" className="form-label">
                  여행지 <span className="required">*</span>
                </label>
                <div className="attraction-search-wrapper">
                  <input
                    id="attraction"
                    type="text"
                    className="form-input"
                    placeholder="여행지를 검색하세요"
                    value={attractionSearch}
                    onChange={(e) =>
                      handleAttractionSearch(e.target.value)
                    }
                    onFocus={() => setShowAttractionDropdown(true)}
                  />

                  {showAttractionDropdown && (
                    <div className="attraction-dropdown">
                      {filteredAttractions.length > 0 ? (
                        <ul className="attraction-list">
                          {filteredAttractions.slice(0, 10).map((attraction) => (
                            <li
                              key={attraction.contentid || attraction.id}
                              className="attraction-item"
                              onClick={() =>
                                handleAttractionSelect(attraction)
                              }
                            >
                              <div className="attraction-name">
                                {attraction.title}
                              </div>
                              <div className="attraction-address">
                                {attraction.addr1}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="attraction-empty">
                          결과가 없습니다
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {formData.spotContentId && (
                  <div className="selected-attraction">
                    <span className="checkmark">✓</span>
                    {attractionSearch}
                  </div>
                )}
              </div>
            )}

            {/* 내용 */}
            <div className="form-group">
              <label htmlFor="content" className="form-label">
                내용 <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                className="form-textarea"
                placeholder="여행지에 대한 경험과 후기를 자유롭게 작성하세요"
                value={formData.content}
                onChange={handleInputChange}
                rows="12"
                maxLength="3000"
              />
              <span className="char-count">
                {formData.content.length}/3000
              </span>
            </div>

            {/* 버튼 */}
            <div className="form-buttons">
              <button
                type="submit"
                className="btn-submit"
                disabled={submitLoading}
              >
                {submitLoading
                  ? reviewId
                    ? '수정 중...'
                    : '작성 중...'
                  : reviewId
                  ? '수정 완료'
                  : '작성 완료'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={submitLoading}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewFormPage;
