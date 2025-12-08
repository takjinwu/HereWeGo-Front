// src/pages/SearchResultsPage.jsx (전체 교체 권장)
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import tourService from "../services/tourService";
import Layout from "../components/Layout/Layout";
import "../styles/HomePage.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PLACEHOLDER = "https://via.placeholder.com/420x260?text=No+Image";

function normalizeItem(item) {
  if (!item) return { id: null, title: "제목 없음", image: PLACEHOLDER, addr: "" };

  // 가능한 이미지 필드들 우선순위로 시도
  const image =
    item.firstimage ||
    item.image ||
    item.imageUrl ||
    item.img ||
    item.thumbnail ||
    item.thumb ||
    (Array.isArray(item.images) && item.images[0]) ||
    (item.pictures && item.pictures[0]) ||
    "";

  const title = item.title || item.name || item.placeName || item.facltNm || item.tourName || "";
  const addr = item.addr1 || item.addr || item.address || item.roadAddr || "";

  // contentId / id 추출
  const id = item.contentId || item.id || item._id || item.code || null;

  return {
    id,
    title: title || "제목 없음",
    image: image || PLACEHOLDER,
    addr: addr || ""
  };
}

export default function SearchResultsPage() {
  const q = useQuery().get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(q));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const list = await tourService.getSpotsByKeyword(q);
        console.log('RAW ITEMS:', list);
        // normalize
        const normalized = (list || []).map(normalizeItem);
        if (!mounted) return;
        setResults(normalized.slice(0, Math.min(5, normalized.length)));
      } catch (err) {
        console.error("검색 중 오류:", err);
        if (!mounted) return;
        setError("검색 중 오류가 발생했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [q]);

  return (
    <Layout>
      <div className="home-container">
        <section className="recommendations-section">
          <h2 className="section-title">검색 결과: {q}</h2>

          {loading && <div>검색 중...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && results.length === 0 && (
            <div className="no-data-message">검색 결과가 없습니다.</div>
          )}

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
            {results.map((item) => (
              <Link key={item.id || item.title} to={`/detail/${item.id || item.title}`}>
                <div style={{ width: 260, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", margin: 6, textAlign: "center", background: "#fff" }}>
                  <img src={item.image} alt={item.title} style={{ width: "100%", height: 150, objectFit: "cover" }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>{item.addr}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}   