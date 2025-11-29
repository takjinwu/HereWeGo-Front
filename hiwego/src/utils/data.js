// src/utils/data.js (최종 통합 정리)

//////////////////////////////////////////////////////////////
/////이거는 백엔드 애들이 정보 가져오기 전까지 임시로 만든거/////
//////////////////////////////////////////////////////////////
export const regionalAttractions = {
  경기도: [
    { id: 1, name: '포천 아트밸리', image: '', source: 32 },
    { id: 2, name: '가평 별빛정원', image: '', source: 33 },
    { id: 3, name: '파주 마장호수 출렁다리', image: '', source: 42 },
    { id: 4, name: '포천 고모리 저수지', image: '', source: 43 },
  ],
  강원도: [
    { id: 5, name: '춘천 레고랜드', image: '', source: 53 },
    { id: 6, name: '속초 중앙시장', image: '', source: 54 },
    { id: 7, name: '정동진', image: '', source: 66 },
    { id: 8, name: '속초 울산바위', image: '', source: 67 },
  ],
  충청도: [ // 충북/충남 통합 예시
    { id: 9, name: '단양 고수동굴', image: '', source: 74 },
    { id: 10, name: '보령 대천해수욕장', image: '', source: 82 },
    { id: 11, name: '롯데 부여 리조트', image: '', source: 85 },
    { id: 12, name: '공주 마곡사', image: '', source: 86 },
  ],
};

export const themes = [
  '캠핑', '역사', '쇼핑', '축제',
  '맛집', '체험', '겨울'
]; 

export const themeAttractions = {
  캠핑: [
    { id: 101, name: '강릉 사천진해변 캠핑장', image: '[Camping Image]', theme: '캠핑' },
    { id: 102, name: '양평 유명산 자연휴양림', image: '[Camping Image]', theme: '캠핑' },
  ],
  역사: [
    { id: 201, name: '경주 불국사', image: '[History Image]', theme: '역사' },
    { id: 202, name: '공주 공산성', image: '[History Image]', theme: '역사' },
  ],
};

// ✨ ID 검색 함수 추가 및 export (9단계 핵심)
export const findAttractionById = (id) => {
  const regionalList = Object.values(regionalAttractions).flat();
  const themeList = Object.values(themeAttractions).flat();
  const allAttractions = [...regionalList, ...themeList];
  
  const numericId = parseInt(id); 
  
  return allAttractions.find(item => item.id === numericId);
};