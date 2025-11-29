// src/pages/DetailPage.jsx (최종 정리)

import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { findAttractionById } from '../utils/data';

const DetailPage = () => {
  const { id } = useParams(); 
  const attraction = findAttractionById(id);

  if (!attraction) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>404 Not Found</h2>
          <p>존재하지 않는 여행지 ID입니다: {id}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        {/* 1. 메인 이미지/정보 섹션 */}
        <section style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ marginBottom: '10px' }}>{attraction.name}</h1>
          <p style={{ color: '#666' }}>
            ID: {attraction.id} | 카테고리: {attraction.source ? '지역 추천' : '테마 추천'}
          </p>
          
          <div style={{ height: '300px', background: '#ccc', marginTop: '20px', textAlign: 'center', lineHeight: '300px' }}>
            {attraction.image} (메인 이미지 영역)
          </div>
        </section>

        {/* 2. 상세 설명 섹션 */}
        <section>
          <h2>여행지 소개</h2>
          <p style={{ marginTop: '15px', lineHeight: '1.8' }}>
            {attraction.name}에 대한 상세한 설명이 여기에 들어갑니다.
          </p>
        </section>

        {/* 3. 리뷰 및 위치 섹션 */}
        <section style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9' }}>
          <h3>위치 및 정보</h3>
          <p>지도 컴포넌트와 주소 정보가 들어갈 자리입니다.</p>
        </section>
      </div>
    </Layout>
  );
};

export default DetailPage; // ✨ export default 확인