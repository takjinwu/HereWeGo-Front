// src/components/AttractionCard/AttractionCard.jsx
import React from 'react';

const AttractionCard = ({ attraction }) => {
  return (
    <div 
      style={{ 
        border: '1px solid #ddd', 
        padding: '10px', 
        margin: '10px', 
        width: '220px', 
        cursor: 'pointer' 
      }}
      onClick={() => alert(`${attraction.name} 상세 페이지로 이동`)}
    >
      <div style={{ height: '150px', background: '#ccc', marginBottom: '10px' }}>
        {/* 임시 이미지 영역 */}
        {attraction.image}
      </div>
      <h4 style={{ margin: '0 0 5px 0' }}>{attraction.name}</h4>
      <p style={{ fontSize: '0.8em', color: '#666' }}>출처: {attraction.source}</p>
    </div>
  );
};
export default AttractionCard;