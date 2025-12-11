// src/utils/favorites.js
// localStorage를 사용한 즐겨찾기 관리 (사용자별)

/**
 * 현재 사용자의 favorites 키 생성
 */
const getFavoritesKey = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.userDi || user.loginUserId || 'guest';
  return `favorites_${userId}`;
};

/**
 * 즐겨찾기 항목 추가
 * @param {Object} item - 여행지 객체 (title, firstimage, addr1 등)
 */
export const addFavorite = (item) => {
  if (!item || !item.title) {
    console.error('Invalid item: title is required');
    return false;
  }

  const favorites = getFavorites();
  
  // title을 고유 식별자로 사용하여 중복 확인
  const exists = favorites.some(fav => fav.title === item.title);
  if (exists) {
    console.log('Already favorited:', item.title);
    return false;
  }

  // 즐겨찾기 저장
  const newFavorite = {
    title: item.title,
    firstimage: item.firstimage || '',
    addr1: item.addr1 || '',
    tel: item.tel || '',
    overview: item.overview || '',
    addedAt: new Date().toISOString()
  };

  favorites.push(newFavorite);
  localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
  
  console.log('Favorite added:', newFavorite);
  return true;
};

/**
 * 즐겨찾기 항목 제거
 * @param {string} title - 여행지 제목
 */
export const removeFavorite = (title) => {
  let favorites = getFavorites();
  const originalLength = favorites.length;
  
  favorites = favorites.filter(fav => fav.title !== title);
  
  if (favorites.length < originalLength) {
    localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
    console.log('Favorite removed:', title);
    return true;
  }
  
  return false;
};

/**
 * 모든 즐겨찾기 조회
 */
export const getFavorites = () => {
  try {
    const stored = localStorage.getItem(getFavoritesKey());
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to parse favorites:', err);
    return [];
  }
};

/**
 * 특정 항목이 즐겨찾기되어 있는지 확인
 * @param {string} title - 여행지 제목
 */
export const isFavorited = (title) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.title === title);
};

/**
 * 즐겨찾기 전체 삭제
 */
export const clearFavorites = () => {
  localStorage.removeItem(getFavoritesKey());
  console.log('All favorites cleared');
};

/**
 * 즐겨찾기 개수
 */
export const getFavoriteCount = () => {
  return getFavorites().length;
};
