/**
 * Cosmic Portfolio - 메인 초기화 스크립트
 * 최적화된 버전 - 모듈 시스템 활용
 */

// 유틸리티 및 설정 가져오기
import { isMobile, isLowPowerMode, isSafari } from './utils/config.js';
import { debounce, throttle, preloadImages } from './utils/helpers.js';

// 데이터 관리자 및 컴포넌트
import dataManager from './data/DataManager.js';
import portfolioData from './data/portfolioData.js';
import loadingManager from './modules/LoadingManager.js';
import SpaceBackground from './components/SpaceBackground.js';
import performanceMonitor from './components/PerformanceMonitor.js';
import RocketAnimation from './animations/RocketAnimation.js';
import AnimationController from './animations/AnimationController.js';
import lazyLoader from './utils/LazyLoader.js';

// 전역 변수 선언
let spaceBackground = null;
let rocketInstance = null;
const animationController = new AnimationController();

// 로딩 단계 관리 변수
let loadingStepsCompleted = 0;
const TOTAL_LOADING_STEPS = 3;

// 로딩 시작 시간 기록 (성능 측정용)
const startTime = performance.now();

/**
 * 페이지 초기화
 */
function initializePage() {
  console.log('코스믹 포트폴리오 - 최적화된 버전');
  
  // 페이지 로드 시간 기록
  const loadTime = performance.now() - startTime;
  console.log(`페이지 초기화 시간: ${loadTime.toFixed(2)}ms`);
  
  // 중요 플래그 설정 (웹 앱 렌더링에 영향을 주는 조건들)
  setupEnvironmentFlags();
  
  // 중요 리소스 먼저 로드
  loadCriticalResources()
    .then(() => {
      // 성능 모니터링 설정
      setupPerformanceMonitor();
      
      // 데이터 초기화
      initializeData();
      
      // 이벤트 리스너 설정
      setupEventListeners();
      
      // 비중요 리소스 로드 (지연 로드)
      queueNonCriticalResources();
    })
    .catch(error => {
      console.error('중요 리소스 로딩 오류:', error);
      // 오류 발생해도 기본 기능 계속 진행
      setupPerformanceMonitor();
      initializeData();
      setupEventListeners();
    });
}

/**
 * 환경 플래그 설정
 */
function setupEnvironmentFlags() {
  // 모바일 디바이스 감지 및 클래스 추가
  if (isMobile()) {
    document.body.classList.add('mobile-device');
    
    if (isSafari()) {
      document.body.classList.add('safari-browser');
    }
  }
  
  // 저전력 모드 감지 및 클래스 추가
  if (isLowPowerMode()) {
    document.body.classList.add('low-power-mode');
  }
  
  // 연결 속도 감지
  checkConnectionSpeed();
}

/**
 * 연결 속도 감지
 */
function checkConnectionSpeed() {
  // Navigator Connection API 지원 확인
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // 저속 연결 감지
    if (connection.saveData || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g') {
      document.body.classList.add('low-bandwidth');
      
      // 저속 연결용 설정 적용
      applyLowBandwidthSettings();
    }
  }
}

/**
 * 저속 연결용 설정 적용
 */
function applyLowBandwidthSettings() {
  // 애니메이션 품질 낮춤
  animationController.setLowBandwidthMode(true);
  
  // 지연 로딩 거리 증가 (더 늦게 로드)
  lazyLoader.options.rootMargin = '10px 0px';
  
  // 이미지 품질 낮춤
  lazyLoader.options.maxWidth = 640;
}

/**
 * 중요 리소스 로드 (UX에 즉시 필요한 리소스)
 * @returns {Promise} 완료 Promise
 */
async function loadCriticalResources() {
  return new Promise((resolve) => {
    // 로딩 화면 표시
    loadingManager.showLoading();
    
    // 중요 이미지 리소스 등록
    loadingManager.addImage([
      'assets/images/background/stars-bg.jpg',
      'assets/images/logo.png',
    ], { priority: 1 });
    
    // 필수 폰트 리소스 등록
    loadingManager.addFont('Main-Font', 'assets/fonts/main-font.woff2', { priority: 1 });
    
    // 완료 콜백 설정
    loadingManager.onComplete(() => {
      // 헤더와 네비게이션 애니메이션 시작
      animateHeader();
      // 로딩 화면은 아직 유지 (전체 로딩이 완료될 때까지)
      resolve();
    });
    
    // 진행 콜백 설정
    loadingManager.onProgress((progress, percent) => {
      console.log(`중요 리소스 로딩: ${percent}%`);
    });
    
    // 로딩 시작 (최소 지속 시간 짧게 설정)
    loadingManager.start({
      minDuration: 500, // 최소 로딩 시간 (ms)
      skipCache: false,
      timeout: 5000, // 5초 타임아웃
      forceComplete: true // 타임아웃 시 강제 완료
    });
  });
}

/**
 * 비중요 리소스 대기열에 추가 (UX에 즉시 필요하지 않은 리소스)
 */
function queueNonCriticalResources() {
  // 로딩 우선순위 지정 방식
  // 1. 즉시 표시 영역에 있는 요소 (Initial Viewport)
  // 2. 스크롤 시 곧 표시될 요소들 (Below the fold)
  // 3. 액션에 의해 표시될 요소들 (On interaction)
  
  // 타임아웃 안전장치 - 로딩이 너무 오래 걸리면 강제로 로딩 화면 숨김
  const safetyTimeout = setTimeout(() => {
    console.warn('로딩 타임아웃 안전장치 작동: 강제로 로딩 화면 숨김');
    loadingManager.hideLoading();
  }, 15000); // 15초 후 강제 완료
  
  // 1. 즉시 표시 영역 리소스
  setTimeout(() => {
    loadInitialViewportResources();
    
    // 2. 스크롤 시 표시될 영역 리소스 (지연 로드)
    setTimeout(() => {
      loadBelowTheFoldResources();
      
      // 3. 액션에 의해 표시될 리소스 (더 지연 로드)
      setTimeout(() => {
        loadOnInteractionResources(() => {
          // 모든 로딩 단계가 완료되면 안전장치 타임아웃 취소
          clearTimeout(safetyTimeout);
        });
      }, 1000);
    }, 500);
  }, 300);
}

/**
 * 로딩 단계 완료 처리 함수
 * @param {boolean} isLastStep - 마지막 로딩 단계인지 여부
 */
function completeLoadingStep(isLastStep = false) {
  loadingStepsCompleted++;
  console.log(`로딩 단계 ${loadingStepsCompleted}/${TOTAL_LOADING_STEPS} 완료`);
  
  // 모든 로딩 단계가 완료되었거나 마지막 단계라면 로딩 화면 숨김
  if (loadingStepsCompleted >= TOTAL_LOADING_STEPS || isLastStep) {
    console.log('모든 로딩 단계 완료: 로딩 화면 숨김');
    loadingManager.hideLoading();
  }
}

/**
 * 즉시 표시 영역 리소스 로드
 */
function loadInitialViewportResources() {
  // 로딩 매니저 리셋 (이전 상태 초기화)
  loadingManager.reset();
  
  // 로켓 애니메이션 리소스
  loadingManager.addImage([
    'assets/images/icons/rocket.svg',
    'assets/images/rocket-flame.png'
  ], { priority: 1 });
  
  // 헤더 이미지
  loadingManager.addImage([
    'assets/images/icons/menu.svg',
    'assets/images/icons/close.svg'
  ], { priority: 1 });
  
  // 완료 콜백 설정
  loadingManager.onComplete(() => {
    // 로켓 애니메이션 초기화
    initializeRocketAnimation();
    // 우주 배경 초기화
    initializeSpaceBackground();
    // 첫 번째 로딩 단계 완료
    completeLoadingStep();
  });
  
  // 로딩 시작
  loadingManager.start({
    minDuration: 0,
    skipCache: false,
    timeout: 5000,
    forceComplete: true // 타임아웃 시 강제 완료
  });
}

/**
 * 스크롤 시 표시될 리소스 로드
 */
function loadBelowTheFoldResources() {
  // 로딩 매니저 리셋 (이전 상태 초기화)
  loadingManager.reset();
  
  // 프로필 섹션 이미지
  loadingManager.addImage([
    'assets/images/profile.jpg'
  ], { priority: 2 });
  
  // 위에 표시되는 프로젝트 이미지 (처음 몇 개만)
  const topProjects = portfolioData.projects.slice(0, 4);
  const topProjectImages = topProjects.map(project => project.image);
  loadingManager.addImage(topProjectImages, { priority: 2 });
  
  // 배경 이펙트 이미지
  loadingManager.addImage([
    'assets/images/background/nebula-bg.png'
  ], { priority: 3 });
  
  // 완료 콜백 설정
  loadingManager.onComplete(() => {
    // 섹션 애니메이션 초기화
    animateSections();
    // 프로젝트 미리보기 애니메이션 초기화
    animateProjects();
    // 두 번째 로딩 단계 완료
    completeLoadingStep();
  });
  
  // 로딩 시작
  loadingManager.start({
    skipCache: false,
    timeout: 5000,
    forceComplete: true // 타임아웃 시 강제 완료
  });
}

/**
 * 사용자 상호작용에 의해 표시될 리소스 로드
 * @param {Function} callback - 모든 로딩이 완료된 후 호출될 콜백
 */
function loadOnInteractionResources(callback) {
  // 로딩 매니저 리셋 (이전 상태 초기화)
  loadingManager.reset();
  
  // 나머지 프로젝트 이미지 (지연 로드)
  const remainingProjects = portfolioData.projects.slice(4);
  const remainingImages = remainingProjects.map(project => project.image);
  
  // 지연 로딩으로 등록
  lazyLoader.observeImages('.portfolio-item img[data-lazy-src]');
  
  // 모달 관련 리소스
  loadingManager.addImage([
    'assets/images/icons/close-modal.svg',
    'assets/images/icons/next.svg',
    'assets/images/icons/prev.svg'
  ], { priority: 3 });
  
  // 완료 콜백 설정
  loadingManager.onComplete(() => {
    // 포트폴리오 모달 초기화
    initializePortfolioModal();
    // 푸터 애니메이션 초기화
    animateFooter();
    
    // 페이지 완전히 로드된 시간 기록
    const fullLoadTime = performance.now() - startTime;
    console.log(`전체 페이지 로드 시간: ${fullLoadTime.toFixed(2)}ms`);
    
    // 마지막 로딩 단계 완료 (true 플래그는 마지막 단계임을 표시)
    completeLoadingStep(true);
    
    // 완료 콜백 호출
    if (typeof callback === 'function') {
      callback();
    }
  });
  
  // 로딩 실패 시 안전장치
  loadingManager.onError((url) => {
    console.warn(`리소스 로딩 실패 무시: ${url}`);
    
    // 리소스 로딩에 실패해도 계속 진행 (중요하지 않은 리소스는 로딩 실패를 무시)
    // 이미 모든 로딩 단계가 완료되었다면 로딩 화면 숨김
    if (loadingStepsCompleted >= TOTAL_LOADING_STEPS - 1) {
      loadingManager.hideLoading();
    }
  });
  
  // 로딩 시작
  loadingManager.start({
    skipCache: false,
    timeout: 5000,
    forceComplete: true // 타임아웃 시 강제 완료
  });
}

/**
 * 성능 모니터링 설정
 */
function setupPerformanceMonitor() {
  // 성능 모니터링 콜백 등록
  performanceMonitor.registerOptimizationCallback((level) => {
    console.log(`성능 최적화 레벨 ${level} 적용`);
    
    // 우주 배경 최적화
    if (spaceBackground) {
      if (level >= 2) {
        spaceBackground.options.starsCount = 500;
        spaceBackground.options.nebulaeCount = 2;
        spaceBackground.createStars();
        spaceBackground.createNebulae();
      }
      
      if (level >= 3) {
        spaceBackground.pauseAnimation();
      }
    }
    
    // 로켓 애니메이션 최적화
    if (rocketInstance) {
      if (level >= 2) {
        rocketInstance.setQuality('low');
      }
      
      if (level >= 3) {
        rocketInstance.pauseAnimation();
      }
    }
  });
}

/**
 * 데이터 초기화
 */
function initializeData() {
  // 포트폴리오 데이터 로드
  dataManager.getData('portfolioData', () => {
    return Promise.resolve(portfolioData);
  });
  
  // 사용자 설정 로드 (로컬 스토리지)
  dataManager.getData('userSettings', () => {
    try {
      const settings = localStorage.getItem('userSettings');
      return Promise.resolve(settings ? JSON.parse(settings) : {});
    } catch (error) {
      console.error('사용자 설정 로드 오류:', error);
      return Promise.resolve({});
    }
  });
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
  // 리사이즈 이벤트
  window.addEventListener('resize', debounce(handleResize, 200));
  
  // 스크롤 이벤트 (단순한 핸들러만)
  window.addEventListener('scroll', throttle(handleScroll, 100));
  
  // 가시성 변경 이벤트
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 네비게이션 이벤트는 별도의 navigation-manager.js에서 처리됨
  
  // 포트폴리오 아이템 이벤트
  setupPortfolioItemEvents();
}

/**
 * 요소 애니메이션 적용
 */
function animateElements() {
  // GSAP 사용 가능 확인
  if (typeof gsap === 'undefined') {
    console.error('GSAP 라이브러리를 찾을 수 없습니다.');
    return;
  }
  
  // ScrollTrigger 플러그인 등록
  if (gsap.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // 헤더 애니메이션
  animateHeader();
  
  // 섹션 애니메이션
  animateSections();
  
  // 프로젝트 아이템 애니메이션
  animateProjects();
  
  // 스킬 아이템 애니메이션
  animateSkills();
  
  // 푸터 애니메이션
  animateFooter();
}

/**
 * 헤더 애니메이션
 */
function animateHeader() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  const navItems = document.querySelectorAll('.nav-links li');
  
  if (!header || !logo || navItems.length === 0) return;
  
  // 페이드 인 효과
  gsap.fromTo(logo, 
    { opacity: 0, y: -20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  );
  
  // 네비게이션 아이템 순차 애니메이션
  gsap.fromTo(navItems, 
    { opacity: 0, y: -20 }, 
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      stagger: 0.1, 
      ease: 'power2.out',
      delay: 0.3
    }
  );
  
  // 스크롤 시 헤더 변경
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (self.direction === 1 && self.progress > 0.05) {
        header.classList.add('scrolled');
      } else if (self.direction === -1 && self.progress < 0.05) {
        header.classList.remove('scrolled');
      }
    }
  });
}

/**
 * 섹션 애니메이션
 */
function animateSections() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const heading = section.querySelector('h2');
    const content = section.querySelector('.section-content');
    
    if (!heading || !content) return;
    
    // 섹션 헤딩 애니메이션
    gsap.fromTo(heading,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // 섹션 콘텐츠 애니메이션
    gsap.fromTo(content,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/**
 * 프로젝트 아이템 애니메이션
 */
function animateProjects() {
  const projectItems = document.querySelectorAll('.project-item');
  
  if (projectItems.length === 0) return;
  
  // 스태거 효과로 순차 애니메이션
  gsap.fromTo(projectItems,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * 스킬 아이템 애니메이션
 */
function animateSkills() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  if (skillItems.length === 0) return;
  
  // 스태거 효과로 순차 애니메이션
  gsap.fromTo(skillItems,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * 푸터 애니메이션
 */
function animateFooter() {
  const footer = document.querySelector('footer');
  
  if (!footer) return;
  
  gsap.fromTo(footer,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * 네비게이션 이벤트 설정 (별도 모듈로 이동)
 * 네비게이션 기능은 navigation-manager.js에서 처리됨
 */

/**
 * 포트폴리오 아이템 이벤트 설정
 */
function setupPortfolioItemEvents() {
  // 포트폴리오 아이템 클릭 이벤트 (이미 portfolio-modal.js에서 처리됨)
  // 여기서는 추가 기능이 필요한 경우 구현
}

/**
 * 리사이즈 이벤트 핸들러
 */
function handleResize() {
  // 디바이스 유형이 변경된 경우 (예: 가로/세로 모드 전환)
  const wasMobile = document.body.classList.contains('mobile-device');
  const isMobileNow = isMobile();
  
  if (wasMobile !== isMobileNow) {
    document.body.classList.toggle('mobile-device', isMobileNow);
  }
  
  // 다른 리사이즈 관련 처리
  animationController.handleResize();
}

/**
 * 스크롤 이벤트 핸들러
 */
function handleScroll() {
  // 필요한 스크롤 처리
  animationController.handleScroll(window.scrollY);
}

/**
 * 가시성 변경 이벤트 핸들러
 */
function handleVisibilityChange() {
  const isHidden = document.hidden;
  
  if (isHidden) {
    // 페이지가 보이지 않을 때 무거운 애니메이션 일시 중지
    if (spaceBackground) {
      spaceBackground.pauseAnimation();
    }
    
    if (rocketInstance) {
      rocketInstance.pauseAnimation();
    }
  } else {
    // 페이지가 다시 보일 때 애니메이션 재개
    if (spaceBackground) {
      spaceBackground.resumeAnimation();
    }
    
    if (rocketInstance) {
      rocketInstance.resumeAnimation();
    }
  }
}

/**
 * 페이지 정리 (unload 이벤트)
 */
function cleanupPage() {
  // 애니메이션 정리
  if (spaceBackground) {
    spaceBackground.dispose();
  }
  
  if (rocketInstance) {
    rocketInstance.dispose();
  }
  
  // 메모리 정리
  performanceMonitor.dispose();
  
  // 이벤트 리스너 제거
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  // 지연 로딩 정지
  lazyLoader.disconnect();
  
  console.log('페이지 정리 완료');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', cleanupPage);

// 포트폴리오 필터링은 별도의 portfolio-filter.js 모듈에서 처리됨
// 중복을 방지하기 위해 이 함수는 제거됨

// DOM 로드 시 실행될 함수들
document.addEventListener('DOMContentLoaded', function() {
  // 네비게이션 이벤트는 navigation-manager.js에서 처리됨
  
  // 기본 애니메이션은 animateElements() 함수에서 처리됨
  animateElements();
});

// 기본 내보내기
export default {
  initialize: initializePage,
  cleanup: cleanupPage
}; 