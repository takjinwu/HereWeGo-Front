// src/pages/RegionDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import RegionAttractionsList from '../components/RegionAttractionsList/RegionAttractionsList';

const RegionDetailPage = () => {
  // URL에서 ':regionName' 파라미터를 가져옵니다.
  const { regionName } = useParams(); 
  // URL 인코딩된 지역 이름을 디코딩합니다. (예: '%EA%B0%95%EC%9B%90%EB%8F%84' -> '강원도')
  const decodedRegionName = decodeURIComponent(regionName);

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <RegionAttractionsList region={decodedRegionName} />
      </div>
    </Layout>
  );
};

export default RegionDetailPage;