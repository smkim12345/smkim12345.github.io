/**
 * Cosmic Portfolio - 유틸리티 함수
 * 자주 사용되는 공통 함수 모음
 */

/**
 * 요소 가져오기 (캐싱으로 성능 최적화)
 * @param {string} selector - CSS 선택자
 * @param {boolean} [all=false] - 모든 요소 가져올지 여부
 * @returns {Element|Element[]|null} - 찾은 요소 또는 null
 */
const elementCache = new Map();
export function getElement(selector, all = false) {
  // 모든 요소 가져오기
  if (all) {
    // 캐시에 있으면 반환
    if (elementCache.has(`all:${selector}`)) {
      return elementCache.get(`all:${selector}`);
    }
    
    // 요소 찾기
    const elements = Array.from(document.querySelectorAll(selector));
    
    // 캐시에 저장
    elementCache.set(`all:${selector}`, elements);
    
    return elements;
  }
  
  // 단일 요소 가져오기
  if (elementCache.has(selector)) {
    return elementCache.get(selector);
  }
  
  // 요소 찾기
  const element = document.querySelector(selector);
  
  // 캐시에 저장
  if (element) {
    elementCache.set(selector, element);
  }
  
  return element;
}

/**
 * 요소 생성 및 속성 설정
 * @param {string} tag - 태그 이름
 * @param {Object} attributes - 속성 객체
 * @param {string|Element|Element[]} [children] - 자식 요소
 * @returns {Element} - 생성된 요소
 */
export function createElement(tag, attributes = {}, children = null) {
  const element = document.createElement(tag);
  
  // 속성 설정
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // 자식 요소 추가
  if (children) {
    if (typeof children === 'string') {
      element.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child) {
          element.appendChild(
            child instanceof Element ? child : document.createTextNode(String(child))
          );
        }
      });
    } else if (children instanceof Element) {
      element.appendChild(children);
    }
  }
  
  return element;
}

/**
 * 이벤트 리스너 추가 (메모리 관리)
 * @param {Element|Window|Document} target - 대상 요소
 * @param {string} type - 이벤트 타입
 * @param {Function} listener - 이벤트 리스너
 * @param {Object} [options] - 이벤트 옵션
 * @returns {Function} - 이벤트 제거 함수
 */
const allListeners = new WeakMap();
export function addEvent(target, type, listener, options = {}) {
  if (!target) return () => {};
  
  // 이벤트 추가
  target.addEventListener(type, listener, options);
  
  // 리스너 추적
  if (!allListeners.has(target)) {
    allListeners.set(target, new Map());
  }
  
  const targetListeners = allListeners.get(target);
  if (!targetListeners.has(type)) {
    targetListeners.set(type, new Set());
  }
  
  const typeListeners = targetListeners.get(type);
  const listenerInfo = { listener, options };
  typeListeners.add(listenerInfo);
  
  // 제거 함수 반환
  return () => {
    target.removeEventListener(type, listener, options);
    typeListeners.delete(listenerInfo);
  };
}

/**
 * 특정 요소의 모든 이벤트 제거
 * @param {Element|Window|Document} target - 대상 요소
 */
export function removeAllEvents(target) {
  if (!target || !allListeners.has(target)) return;
  
  const targetListeners = allListeners.get(target);
  
  targetListeners.forEach((typeListeners, type) => {
    typeListeners.forEach(({ listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
  });
  
  allListeners.delete(target);
}

/**
 * 디바운스 함수 (연속 호출 방지)
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (밀리초)
 * @returns {Function} - 디바운스된 함수
 */
export function debounce(func, wait = 100) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쓰로틀 함수 (호출 빈도 제한)
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {Function} - 쓰로틀된 함수
 */
export function throttle(func, limit = 100) {
  let lastCall = 0;
  let timeout;
  
  return function executedFunction(...args) {
    const now = Date.now();
    const context = this;
    
    if (now - lastCall < limit) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastCall = now;
        func.apply(context, args);
      }, limit - (now - lastCall));
      return;
    }
    
    lastCall = now;
    func.apply(context, args);
  };
}

/**
 * 화면에 요소가 보이는지 확인
 * @param {Element} element - 확인할 요소
 * @param {number} [threshold=0.1] - 임계값 (0-1)
 * @returns {boolean} - 보이는지 여부
 */
export function isInViewport(element, threshold = 0.1) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  // 화면 크기
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  // 요소 크기
  const { height, width } = rect;
  
  // 임계값에 따른 계산
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  
  // 보이는 영역 비율
  const visibleRatio = (visibleHeight * visibleWidth) / (height * width);
  
  return visibleRatio >= threshold;
}

/**
 * 모바일 기기 여부 확인
 * @returns {boolean} - 모바일 여부
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

/**
 * 페이지 스크롤 이동
 * @param {string|Element} target - 스크롤 목표 (CSS 선택자 또는 요소)
 * @param {number} [offset=80] - 상단 여백 (픽셀)
 * @param {number} [duration=1000] - 애니메이션 시간 (밀리초)
 */
export function scrollTo(target, offset = 80, duration = 1000) {
  // 요소 가져오기
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  // 현재 스크롤 위치
  const startPosition = window.pageYOffset;
  // 목표 위치
  const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
  
  // 시간 초기화
  let startTime = null;
  
  // 애니메이션 함수
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // 이징 함수 (ease-in-out)
    const ease = t => t < 0.5 
      ? 4 * t * t * t 
      : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    window.scrollTo(0, startPosition + (targetPosition - startPosition) * ease(progress));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

/**
 * 포맷된 날짜 문자열 반환
 * @param {Date|string|number} [date=new Date()] - 날짜 객체 또는 타임스탬프
 * @param {string} [format='YYYY-MM-DD'] - 날짜 형식
 * @returns {string} - 포맷된 날짜 문자열
 */
export function formatDate(date = new Date(), format = 'YYYY-MM-DD') {
  const d = date instanceof Date ? date : new Date(date);
  
  // 날짜 정보 추출
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  // 형식 변환
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 로컬 스토리지 래퍼 (안전한 저장/로드)
 */
export const storage = {
  /**
   * 데이터 저장
   * @param {string} key - 저장 키
   * @param {any} value - 저장할 값
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error('로컬 스토리지 저장 오류:', e);
    }
  },
  
  /**
   * 데이터 로드
   * @param {string} key - 로드할 키
   * @param {any} [defaultValue=null] - 기본값
   * @returns {any} - 로드된 값 또는 기본값
   */
  get(key, defaultValue = null) {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized);
    } catch (e) {
      console.error('로컬 스토리지 로드 오류:', e);
      return defaultValue;
    }
  },
  
  /**
   * 데이터 삭제
   * @param {string} key - 삭제할 키
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('로컬 스토리지 삭제 오류:', e);
    }
  },
  
  /**
   * 모든 데이터 삭제
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('로컬 스토리지 전체 삭제 오류:', e);
    }
  }
};

// 기본 내보내기
export default {
  getElement,
  createElement,
  addEvent,
  removeAllEvents,
  debounce,
  throttle,
  isInViewport,
  isMobileDevice,
  scrollTo,
  formatDate,
  storage
}; 