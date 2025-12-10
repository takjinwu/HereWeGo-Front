import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import tourService from '../services/tourService';
import '../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log(`검색어 '${query}'로 API 요청 시작...`);
        const data = await tourService.getSpotsByKeyword(query);
        console.log("📌 검색 API 원본 응답:", data);

        // ⭐ [핵심] 데이터 구조 유연하게 파싱하기
        let items = [];
        
        // 1. response > body > items > item 경로 체크
        if (data?.response?.body?.items?.item) {
          const rawItems = data.response.body.items.item;
          // 배열이면 그대로, 객체(1개일 때)면 배열로 감싸기
          items = Array.isArray(rawItems) ? rawItems : [rawItems];
        } 
        // 2. 혹은 바로 list 형태로 들어오는 경우 (백엔드 구조에 따라 다름)
        else if (Array.isArray(data)) {
          items = data;
        }
        else if (data?.list) {
          items = data.list;
        }

        console.log("✅ 추출된 최종 목록:", items);
        setResults(items);

      } catch (err) {
        console.error("검색 에러:", err);
        setError("검색 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleItemClick = (item) => {
    // ⭐ ID 값 찾기 (대소문자 모두 체크)
    const id = item.contentid || item.contentId || item.id;
    
    if (id) {
        console.log("상세 페이지로 이동 ID:", id);
        navigate(`/detail/${id}`); 
    } else {
        console.error("ID가 없는 아이템:", item);
        alert("상세 정보를 확인할 수 없는 항목입니다.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: '#666' }}>
          ⏳ '{query}' 검색 중입니다...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="theme-container">
        <h2 className="theme-title">'{query}' 검색 결과</h2>
        
        {error ? (
           <div className="error-msg" style={{textAlign:'center', color:'red'}}>{error}</div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '50px 0' }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="places-grid">
            {results.map((item, index) => {
               // 이미지 주소 찾기 (firstimage, firstimage2 등)
               const imgSrc = item.firstimage || item.firstimage2 || item.imageUrl;
               
               return (
                <div 
                  key={index} // ID가 중복되거나 없을 때를 대비해 index 사용
                  className="place-card"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image-wrapper">
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.title} />
                    ) : (
                      <div className="no-image" style={{
                          display:'flex', 
                          justifyContent:'center', 
                          alignItems:'center', 
                          height:'100%', 
                          background:'#eee', 
                          color:'#aaa'
                      }}>
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className="place-info">
                    <h3 className="place-title">{item.title}</h3>
                    <p className="place-addr">
                        {item.addr1 || item.address || "주소 정보 없음"}
                    </p>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;