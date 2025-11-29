// src/components/RegionList/RegionList.jsx (수정)
import React from 'react';
import { Link } from 'react-router-dom'; // ✨ Link 컴포넌트 import

const regions = [
  '강원도', '경기도', '충청북도', '충청남도', 
  '경상북도', '전라북도', '경상남도', '전라남도', '제주도'
]; 

const RegionList = () => { // props onSelect는 이제 필요 없습니다.
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {regions.map((region, index) => (
        <li 
          key={index} 
          style={{ 
            padding: '10px', 
            borderBottom: '1px solid #eee' 
          }}
        >
          {/* Link 컴포넌트를 사용하여 지역 상세 페이지로 이동 */}
          <Link to={`/region/${encodeURIComponent(region)}`}>
            {region}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default RegionList;