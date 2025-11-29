// src/pages/ThemePage.jsx
import React from 'react';
import Layout from '../components/Layout/Layout';
import ThemeList from '../components/ThemeList/ThemeList';

const ThemePage = () => {
  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>테마별 추천 여행지</h2>
        <div style={{ display: 'flex' }}>
          {/* 테마 목록 표시 */}
          <div style={{ width: '20%', borderRight: '1px solid #ccc' }}>
            <ThemeList />
          </div>

          {/* 테마별 설명 또는 초기 콘텐츠 */}
          <div style={{ width: '80%', paddingLeft: '20px' }}>
            <h3>원하는 테마를 선택해 주세요.</h3>
            <p>선택하신 테마에 맞는 추천 여행지 목록이 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ThemePage;