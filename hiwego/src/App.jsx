// src/App.jsx (수정)

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegionPage from './pages/RegionPage';
// ✨ 누락된 RegionDetailPage import 추가
import RegionDetailPage from './pages/RegionDetailPage'; 

import ThemePage from './pages/ThemePage';
import ThemeDetailPage from './pages/ThemeDetailPage'; 
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* 지역별 라우트 */}
        <Route path="/region" element={<RegionPage />} />
        <Route path="/region/:regionName" element={<RegionDetailPage />} />
        
        {/* 테마별 라우트 */}
        <Route path="/theme" element={<ThemePage />} />
        <Route path="/theme/:themeName" element={<ThemeDetailPage />} /> 

        {/* 상세 페이지 라우트 */}
        <Route path="/detail/:id" element={<DetailPage />} /> 
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;