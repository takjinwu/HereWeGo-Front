// src/pages/ReviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import reviewService from '../services/reviewService';
import '../styles/ReviewPage.css';

const ReviewPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 정렬
  const [sortOption, setSortOption] = useState('createdAt,desc');
  
  // 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  // 로그인 유저 정보
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 로그인 유저 확인
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('user');
    if (token && userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('유저 정보 파싱 실패:', e);
      }
    }

    fetchReviews();
  }, []);

  const fetchReviews = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      // 검색 쿼리 구성
      let search = '';
      if (searchQuery) {
        search = `${searchType === 'all' ? '' : searchType}:${searchQuery}`;
      }

      const data = await reviewService.getReviews(page, 10, sortOption, search);
      console.log('리뷰 목록 API 응답:', data);

      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.number || 0);
    } catch (err) {
      setError('리뷰를 불러올 수 없습니다.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    // 토큰 확인
    const token = localStorage.getItem('authToken');
    if (!token || !currentUser) {
      // 토스트 메시지 (간단하게 alert 사용, 실제로는 토스트 컴포넌트 사용)
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/review/new');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchReviews(0);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    setCurrentPage(0);
    // sort 변경 후 다시 조회
    setTimeout(() => {
      fetchReviews(0);
    }, 0);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    fetchReviews(pageNum);
  };

  const handleReviewClick = (reviewId) => {
    navigate(`/review/${reviewId}`);
  };

  // 정렬 옵션 변경이 반영되도록
  useEffect(() => {
    if (currentPage === 0) {
      fetchReviews(0);
    }
  }, [sortOption]);

  return (
    <Layout>
      <div className="review-page">
        <div className="review-container">
          {/* 헤더 */}
          <div className="review-header">
            <h1 className="review-title">여행지 리뷰</h1>
            <p className="review-subtitle">다른 여행객들의 생생한 여행지 후기를 확인하세요</p>
          </div>

          {/* 상단 액션 바 */}
          <div className="review-action-bar">
            {/* 검색 및 정렬 */}
            <div className="review-search-sort">
              <form className="search-form" onSubmit={handleSearch}>
                <select 
                  className="search-type"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="nickname">작성자</option>
                </select>
                <input
                  type="text"
                  className="search-input"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">검색</button>
              </form>

              {/* 정렬 */}
              <div className="sort-options">
                <button
                  className={`sort-btn ${sortOption === 'createdAt,desc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('createdAt,desc')}
                >
                  최신순
                </button>
                <button
                  className={`sort-btn ${sortOption === 'viewCount,desc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('viewCount,desc')}
                >
                  인기순
                </button>
              </div>
            </div>

            {/* 새 리뷰 작성 버튼 */}
            <button className="btn-write-review" onClick={handleWriteReview}>
              + 새 리뷰 작성
            </button>
          </div>

          {/* 리뷰 목록 */}
          <div className="review-content">
            {loading ? (
              <div className="review-loading">로딩 중입니다...</div>
            ) : error ? (
              <div className="review-error">
                <p>{error}</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="review-list">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-item"
                    onClick={() => handleReviewClick(review.id)}
                  >
                    <div className="review-item-header">
                      <h3 className="review-item-title">{review.title}</h3>
                      <span className="review-item-meta">
                        <span className="review-author">by {review.nickname}</span>
                        <span className="review-views">조회 {review.viewCount}</span>
                      </span>
                    </div>
                    <p className="review-item-content">{review.content}</p>
                    <div className="review-item-footer">
                      <span className="review-region">📍 {review.region}</span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="review-empty">
                <p>작성된 리뷰가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
              >
                처음
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-number ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                끝
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewPage;
