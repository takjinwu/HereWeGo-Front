// src/components/ThemeList/ThemeList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { themes } from '../../utils/data';

const ThemeList = () => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {themes.map((theme, index) => (
        <li 
          key={index} 
          style={{ 
            padding: '10px', 
            borderBottom: '1px solid #eee' 
          }}
        >
          {/* Link 컴포넌트를 사용하여 테마 상세 페이지로 이동 */}
          <Link to={`/theme/${encodeURIComponent(theme)}`}>
            {theme}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default ThemeList;