/**
 * Cosmic Portfolio - 포트폴리오 데이터
 * 전체 포트폴리오 데이터를 한 곳에서 관리하는 모듈
 */

// 포트폴리오 프로젝트 데이터 객체
export const portfolioData = {
  // 트로피카나 프로젝트
  섬네일_트로피카나: {
    title: "트로피카나 스파클링 패키지 리디자인",
    imagePath: "images/트로피카나/상세_트로피카나.jpg",
    tools: ["Photoshop", "Illustrator"],
    process: "images/트로피카나/작업과정_트로피카나.pdf",
    category: "package",
  },
  // URL 인코딩된 버전 매핑
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%ED%8A%B8%EB%A1%9C%ED%94%BC%EC%B9%B4%EB%82%98": {
    title: "트로피카나 스파클링 패키지 리디자인",
    imagePath: "images/트로피카나/상세_트로피카나.jpg",
    tools: ["Photoshop", "Illustrator"],
    process: "images/트로피카나/작업과정_트로피카나.pdf",
    category: "package",
  },

  // 투썸 프로젝트
  twosome: {
    title: "투썸 에이리스트 패키지 리디자인",
    imagePath: "images/투썸/상세_투썸.jpg",
    tools: ["Photoshop", "Illustrator"],
    category: "package",
  },
  섬네일_투썸: {
    title: "투썸 에이리스트 패키지 리디자인",
    imagePath: "images/투썸/상세_투썸.jpg",
    tools: ["Photoshop", "Illustrator"],
    category: "package",
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%ED%88%AC%EC%8D%B8": {
    title: "투썸 에이리스트 패키지 리디자인",
    imagePath: "images/투썸/상세_투썸.jpg",
    tools: ["Photoshop", "Illustrator"],
    category: "package",
  },

  // 갸스비 프로젝트
  gatsby: {
    title: "갸스비 웹 리디자인",
    imagePath: "images/갸스비/상세_갸스비.jpg",
    link: "images/갸스비/링크_갸스비 웹.url",
    hasResponsive: true,
    responsiveUrl: "https://smkim12345.github.io/project2/index.html",
    hasMobile: true,
    mobileUrl: "https://smkim12345.github.io/project2mobile/index.html",
    category: "web",
  },
  섬네일_갸스비: {
    ref: "gatsby", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%B8%EC%8A%A4%EB%B9%84": {
    ref: "gatsby", // 참조 형태로 중복 데이터 방지
  },
  "gatsby-redesign": {
    ref: "gatsby", // 참조 형태로 중복 데이터 방지
  },

  // 제네시스 프로젝트
  genesis: {
    title: "제네시스 웹 리디자인",
    imagePath: "images/제네시스/상세_제네시스.jpg",
    tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
    link: "images/제네시스/링크_제네시스.url",
    process: "images/제네시스/작업과정_제네시스.pdf",
    hasResponsive: true,
    responsiveUrl: "https://smkim12345.github.io/project1/index.html",
    category: "web",
  },
  섬네일_제네시스: {
    ref: "genesis", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EC%A0%9C%EB%84%A4%EC%8B%9C%EC%8A%A4": {
    ref: "genesis", // 참조 형태로 중복 데이터 방지
  },

  // 맥딜리버리 프로젝트
  mcdelivery: {
    title: "맥딜리버리 앱 리디자인",
    imagePath: "images/맥도날드/상세_맥도날드.jpg",
    tools: ["Adobe XD", "Photoshop"],
    hasMobile: true,
    mobileUrl:
      "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
    openInNewTab: true,
    category: "app",
  },
  맥도날드: {
    ref: "mcdelivery", // 참조 형태로 중복 데이터 방지
  },
  섬네일_맥도날드: {
    ref: "mcdelivery", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%A7%A5%EB%8F%84%EB%82%A0%EB%93%9C": {
    ref: "mcdelivery", // 참조 형태로 중복 데이터 방지
  },

  // 리스크아이 프로젝트
  riskeye: {
    title: "리스크아이 로고 디자인",
    imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
    tools: ["Illustrator", "Photoshop"],
    process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
    category: "branding",
  },
  "riskeye-logo": {
    ref: "riskeye", // 참조 형태로 중복 데이터 방지
  },
  "섬네일_리스크아이 로고 디자인": {
    ref: "riskeye", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%A6%AC%EC%8A%A4%ED%81%AC%EC%95%84%EC%9D%B4%20%EB%A1%9C%EA%B3%A0%20%EB%94%94%EC%9E%90%EC%9D%B8": {
    ref: "riskeye", // 참조 형태로 중복 데이터 방지
  },

  // AI 박람회 프로젝트
  "ai-expo": {
    title: "AI 박람회 리플렛",
    imagePath: "images/portfolio/ai-expo-detail.jpg",
    category: "print",
  },

  // 인스타그램 광고 배너
  banner: {
    title: "인스타그램 광고 배너",
    imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
    tools: ["Photoshop", "Illustrator"],
    category: "web",
  },
  "instagram-ad": {
    ref: "banner", // 참조 형태로 중복 데이터 방지
  },
  "섬네일_인스타그램 광고배너디자인": {
    ref: "banner", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8%20%EA%B4%91%EA%B3%A0%EB%B0%B0%EB%84%88%EB%94%94%EC%9E%90%EC%9D%B8": {
    ref: "banner", // 참조 형태로 중복 데이터 방지
  },

  // 갤럭시 버즈 프로젝트
  "galaxy-buds": {
    title: "갤럭시 버즈3 프로 상세페이지",
    imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
    tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
    hasResponsive: true,
    responsiveUrl: "https://smkim12345.github.io/galaxybuds/",
    category: "web",
  },
  갤럭시버즈3프로: {
    ref: "galaxy-buds", // 참조 형태로 중복 데이터 방지
  },
  "섬네일_갤럭시 버즈3프로 상세페이지": {
    ref: "galaxy-buds", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%A4%EB%9F%AD%EC%8B%9C%20%EB%B2%84%EC%A6%883%ED%94%84%EB%A1%9C%20%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80": {
    ref: "galaxy-buds", // 참조 형태로 중복 데이터 방지
  },

  // 광고 포스터 프로젝트
  "ad-poster": {
    title: "광고 포스터 디자인",
    imagePath: "images/광고 포스터/상세_광고 포스터.png",
    tools: ["Photoshop", "Illustrator"],
    category: "print",
  },
  "섬네일_광고 포스터": {
    ref: "ad-poster", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B4%91%EA%B3%A0%20%ED%8F%AC%EC%8A%A4%ED%84%B0": {
    ref: "ad-poster", // 참조 형태로 중복 데이터 방지
  },

  // 내지 디자인 프로젝트
  "inner-page": {
    title: "내지 디자인",
    imagePath: "images/광고 포스터/상세_내지 디자인.png",
    tools: ["Photoshop", "InDesign"],
    category: "print",
  },
  "섬네일_내지": {
    ref: "inner-page", // 참조 형태로 중복 데이터 방지
  },
  "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%82%B4%EC%A7%80": {
    ref: "inner-page", // 참조 형태로 중복 데이터 방지
  }
};

/**
 * 프로젝트 ID로 포트폴리오 데이터 가져오기
 * @param {string} projectId - 프로젝트 ID
 * @returns {Object} 프로젝트 데이터 객체
 */
export function getProjectData(projectId) {
  if (!projectId || !portfolioData[projectId]) {
    return null;
  }

  const data = portfolioData[projectId];
  
  // 참조인 경우 원본 데이터 반환
  if (data.ref && portfolioData[data.ref]) {
    return portfolioData[data.ref];
  }
  
  return data;
}

/**
 * 이미지 경로나 URL에서 프로젝트 ID 추출
 * @param {string} path - 이미지 경로나 URL
 * @returns {string|null} 프로젝트 ID 또는 null
 */
export function getProjectIdFromPath(path) {
  if (!path) return null;
  
  // URL에서 파일명 추출
  let filename = path.split('/').pop();
  if (!filename) return null;
  
  // 확장자 제거
  let name = filename.split('.')[0];
  
  // URL 디코딩 시도
  try {
    const decodedName = decodeURIComponent(name);
    
    // 디코딩된 이름으로 검색
    if (portfolioData[decodedName]) {
      return decodedName;
    }
    
    // 원래 이름으로 검색
    if (portfolioData[name]) {
      return name;
    }
    
    // 특수 케이스 처리 (예: 갸스비)
    if (
      decodedName === "섬네일_갸스비" ||
      decodedName === "갸스비" ||
      name === "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%B8%EC%8A%A4%EB%B9%84" ||
      decodedName === "gatsby-redesign"
    ) {
      return "gatsby";
    }
    
    // 매치 못 찾음
    return null;
  } catch (e) {
    console.error("URL 디코딩 오류:", e);
    
    // 원래 이름으로 재시도
    return portfolioData[name] ? name : null;
  }
}

/**
 * 카테고리별 프로젝트 가져오기
 * @param {string} category - 카테고리 이름 (없으면 전체)
 * @returns {Array} 프로젝트 배열
 */
export function getProjectsByCategory(category = 'all') {
  const projects = [];
  const processedKeys = new Set(); // 중복 방지
  
  // 모든 항목을 순회
  Object.entries(portfolioData).forEach(([key, data]) => {
    // 참조가 아닌 실제 데이터만 처리
    if (!data.ref) {
      // 이미 처리된 키는 건너뛰기
      if (processedKeys.has(key)) return;
      
      // 카테고리 필터링
      if (category === 'all' || data.category === category) {
        projects.push({
          id: key,
          ...data
        });
        processedKeys.add(key);
      }
    }
  });
  
  return projects;
}

// 기본 내보내기
export default {
  portfolioData,
  getProjectData,
  getProjectIdFromPath,
  getProjectsByCategory
}; 