// src/pages/ReviewDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import reviewService from '../services/reviewService';
import '../styles/ReviewDetailPage.css';

const ReviewDetailPage = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 작성
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // 편집 모드
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // 로그인 유저 정보
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 로그인 유저 확인
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('user');
    console.log('ReviewDetailPage - Token:', token ? 'exists' : 'null');
    console.log('ReviewDetailPage - UserInfo:', userInfo);
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        console.log('ReviewDetailPage - Parsed User:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('유저 정보 파싱 실패:', e);
      }
    }

    fetchReviewDetail();
  }, [reviewId]);

  const fetchReviewDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewData = await reviewService.getReviewDetail(reviewId);
      console.log('리뷰 상세 API 응답:', reviewData);
      setReview(reviewData);

      // 댓글 조회
      await fetchComments();
    } catch (err) {
      setError('리뷰를 불러올 수 없습니다.');
      console.error('Error fetching review detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsData = await reviewService.getComments(reviewId);
      console.log('댓글 목록 API 응답:', commentsData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    // 토큰 확인
    const token = localStorage.getItem('authToken');
    console.log('handleAddComment - Token:', token ? 'exists' : 'null');
    console.log('handleAddComment - CurrentUser:', currentUser);
    
    if (!token || !currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login', { state: { from: { pathname: `/review/${reviewId}` } } });
      return;
    }

    if (!commentContent.trim()) {
      alert('댓글을 입력하세요.');
      return;
    }

    try {
      setCommentLoading(true);
      await reviewService.createComment(reviewId, { content: commentContent });
      setCommentContent('');
      fetchComments(); // 댓글만 새로고침
    } catch (err) {
      console.error('Error creating comment:', err);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent.trim()) {
      alert('댓글을 입력하세요.');
      return;
    }

    try {
      await reviewService.updateComment(commentId, { content: editingCommentContent });
      setEditingCommentId(null);
      setEditingCommentContent('');
      fetchComments();
    } catch (err) {
      console.error('Error updating comment:', err);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await reviewService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditReview = () => {
    navigate(`/review/${reviewId}/edit`);
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      navigate('/review');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleBackToList = () => {
    navigate('/review');
  };

  if (loading) {
    return (
      <Layout>
        <div className="review-detail-page">
          <div className="loading">로딩 중입니다...</div>
        </div>
      </Layout>
    );
  }

  if (error || !review) {
    return (
      <Layout>
        <div className="review-detail-page">
          <div className="error">
            <p>{error || '리뷰를 찾을 수 없습니다.'}</p>
            <button className="btn-back" onClick={handleBackToList}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const isAuthor = currentUser && currentUser.nickname === review.nickname;

  return (
    <Layout>
      <div className="review-detail-page">
        <div className="review-detail-container">
          {/* 헤더 */}
          <div className="review-detail-header">
            <button className="btn-back" onClick={handleBackToList}>
              ← 목록으로
            </button>
          </div>

          {/* 리뷰 내용 */}
          <div className="review-detail-content">
            <div className="review-detail-title-section">
              <h1 className="review-detail-title">{review.title}</h1>
              {isAuthor && (
                <div className="review-actions">
                  <button className="btn-edit" onClick={handleEditReview}>
                    수정
                  </button>
                  <button className="btn-delete" onClick={handleDeleteReview}>
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="review-detail-meta">
              <span className="meta-author">작성자: {review.nickname}</span>
              <span className="meta-region">📍 {review.region}</span>
              <span className="meta-views">조회: {review.viewCount}</span>
              <span className="meta-date">
                {new Date(review.createdAt).toLocaleString()}
              </span>
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <span className="meta-updated">
                  (수정: {new Date(review.updatedAt).toLocaleString()})
                </span>
              )}
            </div>

            <div className="review-detail-body">
              <p>{review.content}</p>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="review-comments-section">
            <h2 className="comments-title">
              댓글 <span className="comment-count">{comments.length}</span>
            </h2>

            {/* 댓글 작성 폼 */}
            <form className="comment-form" onSubmit={handleAddComment}>
              {!currentUser && (
                <div className="login-prompt">
                  <p>로그인 후 댓글을 작성할 수 있습니다.</p>
                  <button 
                    type="button"
                    className="btn-login-prompt"
                    onClick={() => navigate('/login', { state: { from: { pathname: `/review/${reviewId}` } } })}
                  >
                    로그인하기
                  </button>
                </div>
              )}
              {currentUser && (
                <div className="comment-input-group">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="댓글을 입력하세요..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn-comment-submit"
                    disabled={commentLoading}
                  >
                    {commentLoading ? '작성 중...' : '작성'}
                  </button>
                </div>
              )}
            </form>

            {/* 댓글 목록 */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.nickname}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      {currentUser && currentUser.nickname === comment.nickname && (
                        <div className="comment-actions">
                          <button
                            className="btn-comment-edit"
                            onClick={() => handleEditComment(comment)}
                          >
                            수정
                          </button>
                          <button
                            className="btn-comment-delete"
                            onClick={() => handleDeleteComment(comment.commentId)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment.commentId ? (
                      <div className="comment-edit-form">
                        <input
                          type="text"
                          className="comment-edit-input"
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                        />
                        <div className="comment-edit-buttons">
                          <button
                            className="btn-comment-save"
                            onClick={() => handleUpdateComment(comment.commentId)}
                          >
                            저장
                          </button>
                          <button
                            className="btn-comment-cancel"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentContent('');
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-content">{comment.content}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  <p>아직 댓글이 없습니다. 첫 댓글을 작성해주세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewDetailPage;
