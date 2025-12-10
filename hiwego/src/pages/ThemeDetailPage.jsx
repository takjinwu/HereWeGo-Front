// src/pages/ThemeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AttractionCard from '../components/AttractionCard/AttractionCard';
import Pagination from '../components/Pagination/Pagination';
import { themeAttractions } from '../utils/data';

const ThemeDetailPage = () => {
  const { themeName } = useParams();
  const decodedThemeName = decodeURIComponent(themeName);
  const attractions = themeAttractions[decodedThemeName] || [];
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // 테마가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [decodedThemeName]);
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(attractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttractions = attractions.slice(startIndex, endIndex);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>{decodedThemeName} 테마 추천 여행지</h2>
        {attractions.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {currentAttractions.map(attraction => (
                // AttractionCard를 지역 목록에서와 마찬가지로 재사용합니다.
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p>아직 {decodedThemeName} 테마의 여행지 목록이 없습니다.</p>
        )}
      </div>
    </Layout>
  );
};
export default ThemeDetailPage;