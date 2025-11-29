// src/components/RegionList/RegionList.jsx
import React from 'react';

const regions = [
  '강원도', '경기도', '충청북도', '충청남도', 
  '경상북도', '전라북도', '경상남도', '전라남도', '제주도'
]; // Source 16~24

const RegionList = ({ onSelect }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {regions.map((region, index) => (
        <li 
          key={index} 
          onClick={() => onSelect(region)} 
          style={{ 
            padding: '10px', 
            cursor: 'pointer', 
            borderBottom: '1px solid #eee' 
          }}
        >
          {region}
        </li>
      ))}
    </ul>
  );
};
export default RegionList;