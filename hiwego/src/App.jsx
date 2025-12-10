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
import ProfileEditPage from './pages/ProfileEditPage';
import ReviewPage from './pages/ReviewPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ReviewFormPage from './pages/ReviewFormPage';

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
        
        {/* 마이페이지 라우트 */}
        <Route path="/mypage" element={<MyPage />} /> 

        {/* 회원 정보 수정 (편집 화면) 컴포넌트 연결 */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />

        {/* 리뷰 라우트 */}
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/review/new" element={<ReviewFormPage />} />
        <Route path="/review/:reviewId" element={<ReviewDetailPage />} />
        <Route path="/review/:reviewId/edit" element={<ReviewFormPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;