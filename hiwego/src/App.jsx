import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegionPage from './pages/RegionPage';
import RegionDetailPage from './pages/RegionDetailPage'; 
import ThemePage from './pages/ThemePage';
import ThemeDetailPage from './pages/ThemeDetailPage'; 
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        
        {/* 지역별 라우트 */}
        <Route path="/region" element={<RegionPage />} />
        <Route path="/region/:regionName" element={<RegionDetailPage />} />
        
        {/* 테마별 라우트 */}
        <Route path="/theme" element={<ThemePage />} />
        <Route path="/theme/:themeName" element={<ThemeDetailPage />} /> 

        {/* 상세 페이지 라우트 */}
        <Route path="/detail/:id" element={<DetailPage />} />
        
        {/* 인증 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;