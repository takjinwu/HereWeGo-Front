// src/components/RegionAttractionsList/RegionAttractionsList.jsx
import React from 'react';
import AttractionCard from '../AttractionCard/AttractionCard';
import { regionalAttractions } from '../../utils/data';

const RegionAttractionsList = ({ region }) => {
  const attractions = regionalAttractions[region] || [];

  if (attractions.length === 0) {
    return <p>{region}의 추천 여행지가 없습니다.</p>;
  }

  return (
    <div>
      <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        {region} 추천 여행지 목록
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {attractions.map(attraction => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
    </div>
  );
};
export default RegionAttractionsList;