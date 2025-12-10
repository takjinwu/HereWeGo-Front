// src/components/Pagination/Pagination.jsx
import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 10개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 페이지 표시
      let startPage = Math.max(1, currentPage - 4);
      let endPage = Math.min(totalPages, currentPage + 5);
      
      if (currentPage <= 5) {
        endPage = maxVisible;
      } else if (currentPage > totalPages - 5) {
        startPage = totalPages - maxVisible + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-first"
        onClick={handleFirst}
        disabled={currentPage === 1}
        title="첫 페이지"
      >
        «
      </button>
      
      <button
        className="pagination-btn pagination-prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        title="이전 페이지"
      >
        ‹
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        title="다음 페이지"
      >
        ›
      </button>

      <button
        className="pagination-btn pagination-last"
        onClick={handleLast}
        disabled={currentPage === totalPages}
        title="마지막 페이지"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
