// src/pages/ThemeDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import { themeAttractions } from '../utils/data';

const ThemeDetailPage = () => {
  const { themeName } = useParams();
  const decodedThemeName = decodeURIComponent(themeName);
  const attractions = themeAttractions[decodedThemeName] || [];

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>{decodedThemeName} 테마 추천 여행지</h2>
        {attractions.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {attractions.map(attraction => (
              // AttractionCard를 지역 목록에서와 마찬가지로 재사용합니다.
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        ) : (
          <p>아직 {decodedThemeName} 테마의 여행지 목록이 없습니다.</p>
        )}
      </div>
    </Layout>
  );
};
export default ThemeDetailPage;