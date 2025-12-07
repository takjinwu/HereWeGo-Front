// src/components/AttractionCard/AttractionCard.jsx
import React from 'react';

const AttractionCard = ({ attraction, onClick }) => {
  // 필드명이 여러 가지일 수 있으므로 대체 필드 제공
  const imageUrl = attraction.firstimage || attraction.image || attraction.imageUrl || '';
  const title = attraction.title || attraction.name || '';
  const address = attraction.addr1 || attraction.address || '';
  const category = attraction.cat3 || attraction.category || '';

  return (
    <div 
      style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        overflow: 'hidden',
        padding: '0', 
        width: '100%', 
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ height: '200px', background: '#f0f0f0', overflow: 'hidden' }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#e0e0e0',
            color: '#999'
          }}>
            이미지 없음
          </div>
        )}
      </div>
      <div style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          {title}
        </h4>
        {address && (
          <p style={{ fontSize: '0.85em', color: '#666', margin: '0 0 4px 0' }}>
            📍 {address}
          </p>
        )}
        {category && (
          <p style={{ fontSize: '0.8em', color: '#999', margin: '0' }}>
            카테고리: {category}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttractionCard;