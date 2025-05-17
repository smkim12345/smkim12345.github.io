/**
 * Cosmic Portfolio - 설정 관리
 * 프로젝트 전반에 걸쳐 사용되는 설정값 관리
 */

/**
 * 애니메이션 관련 설정
 */
export const animationConfig = {
  // 기본 지속 시간(초)
  duration: {
    short: 0.3,
    medium: 0.6,
    long: 1.0,
    veryLong: 1.5
  },
  
  // 이징 효과
  ease: {
    default: 'power2.out',
    smooth: 'power1.inOut',
    bounce: 'bounce.out',
    elastic: 'elastic.out(1, 0.3)',
    slowStart: 'power3.in',
    slowEnd: 'power3.out'
  },
  
  // 지연 시간(초)
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.3,
    long: 0.5
  },
  
  // 스태거 효과(초)
  stagger: {
    tight: 0.03,
    normal: 0.08,
    wide: 0.15
  },
  
  // 횟수
  repeat: {
    none: 0,
    once: 1,
    twice: 2,
    infinite: -1
  }
};

/**
 * 브레이크포인트 설정
 */
export const breakpoints = {
  xs: 480, // 모바일 세로
  sm: 640, // 모바일 가로
  md: 768, // 태블릿 세로
  lg: 1024, // 태블릿 가로
  xl: 1280, // 데스크톱
  xxl: 1536 // 대형 화면
};

/**
 * 최적화 관련 설정
 */
export const performanceConfig = {
  // 로드 지연(ms)
  loadDelay: {
    initial: 2000, // 초기 로딩 화면
    animation: 500, // 애니메이션 시작 전
    component: 100 // 컴포넌트 표시 전
  },
  
  // 리소스 처리
  resources: {
    cacheDuration: 30 * 60 * 1000, // 캐시 유효 시간 (30분)
    imageQuality: 90, // 이미지 품질 (0-100)
    maxCacheSize: 50, // 최대 캐시 항목 수
    preloadImages: true, // 이미지 사전 로드
    lazyLoadOffset: 200 // 지연 로드 오프셋 (픽셀)
  },
  
  // 모바일 최적화
  mobile: {
    reducedMotion: true, // 모션 줄이기
    reducedAnimations: true, // 애니메이션 수 줄이기
    lowPowerMode: true, // 저전력 모드
    throttleEvents: true, // 이벤트 쓰로틀링
    reducedTextureQuality: true // 텍스처 품질 감소
  },
  
  // 디버그 모드
  debug: {
    enabled: false, // 디버그 모드 활성화
    logLevel: 'warn', // 로그 레벨 (error, warn, info, debug)
    showStats: false, // 통계 표시
    monitorMemory: false // 메모리 모니터링
  }
};

/**
 * Three.js 관련 설정
 */
export const threeJsConfig = {
  // 렌더러 설정
  renderer: {
    antialias: true, // 안티앨리어싱
    alpha: true, // 알파 채널
    precision: 'highp', // 정밀도 (highp, mediump, lowp)
    powerPreference: 'high-performance', // 전력 설정
    preserveDrawingBuffer: false // 드로잉 버퍼 유지
  },
  
  // 카메라 설정
  camera: {
    fov: 75, // 시야각 (도)
    near: 0.1, // 가까운 클리핑 평면
    far: 1000, // 멀리 있는 클리핑 평면
    position: { x: 0, y: 0, z: 5 } // 기본 위치
  },
  
  // 조명 설정
  lights: {
    ambient: {
      color: 0xffffff,
      intensity: 0.5
    },
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 1, y: 1, z: 1 }
    }
  },
  
  // 성능 설정
  performance: {
    lowPower: {
      pixelRatio: 1, // 장치 픽셀 비율
      maxLights: 2, // 최대 조명 수
      shadows: false, // 그림자
      maxFps: 30 // 최대 FPS
    },
    highPower: {
      pixelRatio: 1.5, // 장치 픽셀 비율
      maxLights: 4, // 최대 조명 수
      shadows: true, // 그림자
      maxFps: 60 // 최대 FPS
    }
  }
};

/**
 * 색상 테마 설정
 */
export const colorTheme = {
  // 기본 색상
  primary: '#3B82F6', // 파란색
  secondary: '#6B7280', // 회색
  accent: '#F97316', // 주황색
  
  // 텍스트 색상
  text: {
    primary: '#1F2937', // 거의 검정
    secondary: '#4B5563', // 진한 회색
    light: '#F9FAFB', // 거의 흰색
    accent: '#3B82F6' // 강조
  },
  
  // 배경 색상
  background: {
    primary: '#F9FAFB', // 거의 흰색
    secondary: '#F3F4F6', // 밝은 회색
    dark: '#1F2937', // 거의 검정
    accent: '#EFF6FF' // 연한 파란색
  },
  
  // 우주 테마 색상
  cosmic: {
    space: '#0F172A', // 검은 우주
    stars: '#FFFFFF', // 별
    nebula: '#8B5CF6', // 성운
    planet1: '#3B82F6', // 행성 1
    planet2: '#F97316', // 행성 2
    sun: '#FBBF24' // 태양
  }
};

/**
 * 현재 모바일 여부 확인
 * @returns {boolean} 모바일 여부
 */
export function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < breakpoints.md
  );
}

/**
 * 현재 저전력 모드 여부 확인
 * @returns {boolean} 저전력 모드 여부
 */
export function isLowPowerMode() {
  // 모바일이거나 저전력 모드 설정됨
  if (isMobile() && performanceConfig.mobile.lowPowerMode) return true;
  
  // 배터리 API 지원 확인
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      // 배터리 10% 미만이면 저전력 모드
      if (battery.level < 0.1 && !battery.charging) return true;
    }).catch(() => false);
  }
  
  // 화면 크기가 작으면 저전력 모드로 간주
  return window.innerWidth * window.innerHeight < 500000;
}

/**
 * 디버그 모드 활성화/비활성화
 * @param {boolean} enabled - 활성화 여부
 */
export function setDebugMode(enabled) {
  performanceConfig.debug.enabled = enabled;
  console.log(`디버그 모드: ${enabled ? '활성화' : '비활성화'}`);
}

/**
 * 현재 환경에 맞는 Three.js 설정 가져오기
 * @returns {Object} Three.js 설정
 */
export function getThreeJsSettings() {
  const isLowPower = isLowPowerMode();
  
  return {
    renderer: {
      ...threeJsConfig.renderer,
      antialias: isLowPower ? false : threeJsConfig.renderer.antialias,
      precision: isLowPower ? 'mediump' : threeJsConfig.renderer.precision
    },
    performance: isLowPower ? threeJsConfig.performance.lowPower : threeJsConfig.performance.highPower
  };
}

// 기본 내보내기
export default {
  animationConfig,
  breakpoints,
  performanceConfig,
  threeJsConfig,
  colorTheme,
  isMobile,
  isLowPowerMode,
  setDebugMode,
  getThreeJsSettings
}; 