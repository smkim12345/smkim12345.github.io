/**
 * Cosmic Portfolio - 로딩 매니저
 * 리소스 로딩과 진행 상태를 관리하는 모듈
 */

import dataManager from '../data/DataManager.js';
import { isMobile } from '../utils/config.js';

class LoadingManager {
  constructor() {
    // 싱글톤 패턴 적용
    if (LoadingManager.instance) {
      return LoadingManager.instance;
    }
    
    LoadingManager.instance = this;
    
    // 로딩 요소
    this.loadingScreen = document.querySelector('.loading-screen');
    this.loadingProgress = null;
    
    // 리소스 상태
    this.resources = {
      total: 0,
      loaded: 0,
      failed: 0,
      items: new Map()
    };
    
    // 콜백 함수
    this.callbacks = {
      onProgress: null,
      onComplete: null,
      onError: null
    };
    
    // 로딩 완료 상태
    this.isComplete = false;
    
    // 타임아웃 관련
    this.timeoutId = null;
    
    // 디버그 모드
    this.debug = false;
    
    // 모바일 감지
    this.isMobile = isMobile();
    
    this.init();
  }
  
  /**
   * 초기화
   */
  init() {
    // 로딩 프로그레스 요소 생성 (없는 경우)
    if (!this.loadingProgress && this.loadingScreen) {
      this.loadingProgress = document.createElement('div');
      this.loadingProgress.className = 'loading-progress';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      
      const progressText = document.createElement('div');
      progressText.className = 'progress-text';
      progressText.textContent = '0%';
      
      this.loadingProgress.appendChild(progressBar);
      this.loadingProgress.appendChild(progressText);
      
      // 로딩 콘텐츠에 추가
      const loadingContent = this.loadingScreen.querySelector('.loading-content');
      if (loadingContent) {
        loadingContent.appendChild(this.loadingProgress);
      } else {
        this.loadingScreen.appendChild(this.loadingProgress);
      }
    }
    
    if (this.debug) {
      console.log('LoadingManager 초기화 완료', this.loadingScreen ? '로딩 화면 찾음' : '로딩 화면 찾지 못함');
    }
  }
  
  /**
   * 디버그 모드 설정
   * @param {boolean} enabled - 디버그 모드 활성화 여부
   * @returns {LoadingManager} - 체이닝을 위한 인스턴스 반환
   */
  setDebug(enabled) {
    this.debug = enabled;
    return this;
  }
  
  /**
   * 이미지 리소스 등록
   * @param {string|Array} src - 이미지 URL 또는 URL 배열
   * @param {Object} options - 옵션 (우선순위 등)
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  addImage(src, options = {}) {
    const urls = Array.isArray(src) ? src : [src];
    
    urls.forEach(url => {
      // 빈 URL이면 무시
      if (!url) return;
      
      // 중복 등록 방지
      if (this.resources.items.has(url)) return;
      
      // 리소스 정보 저장
      this.resources.items.set(url, {
        type: 'image',
        status: 'pending',
        priority: options.priority || 1,
        element: null
      });
      
      this.resources.total++;
    });
    
    if (this.debug) {
      console.log(`이미지 리소스 ${urls.length}개 등록됨. 총 리소스: ${this.resources.total}`);
    }
    
    return this;
  }
  
  /**
   * 스크립트 리소스 등록
   * @param {string|Array} src - 스크립트 URL 또는 URL 배열
   * @param {Object} options - 옵션 (우선순위, async 등)
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  addScript(src, options = {}) {
    const urls = Array.isArray(src) ? src : [src];
    
    urls.forEach(url => {
      // 빈 URL이면 무시
      if (!url) return;
      
      // 중복 등록 방지
      if (this.resources.items.has(url)) return;
      
      // 이미 로드된 스크립트인지 확인
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        // 이미 로드된 스크립트는 로드 완료로 처리
        this.resources.items.set(url, {
          type: 'script',
          status: 'loaded',
          priority: options.priority || 1,
          async: options.async !== false,
          defer: options.defer === true,
          element: existingScript
        });
        
        this.resources.loaded++;
        return;
      }
      
      // 리소스 정보 저장
      this.resources.items.set(url, {
        type: 'script',
        status: 'pending',
        priority: options.priority || 1,
        async: options.async !== false,
        defer: options.defer === true,
        element: null
      });
      
      this.resources.total++;
    });
    
    if (this.debug) {
      console.log(`스크립트 리소스 ${urls.length}개 등록됨. 총 리소스: ${this.resources.total}`);
    }
    
    return this;
  }
  
  /**
   * 폰트 리소스 등록
   * @param {string} fontFamily - 폰트 패밀리 이름
   * @param {string|Array} src - 폰트 URL 또는 URL 배열 (woff, woff2 등)
   * @param {Object} options - 옵션 (우선순위, 웨이트 등)
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  addFont(fontFamily, src, options = {}) {
    // 폰트 패밀리나 src가 없으면 무시
    if (!fontFamily || !src) return this;
    
    const urls = Array.isArray(src) ? src : [src];
    
    urls.forEach(url => {
      // 빈 URL이면 무시
      if (!url) return;
      
      const key = `font:${fontFamily}:${url}`;
      
      // 중복 등록 방지
      if (this.resources.items.has(key)) return;
      
      // 리소스 정보 저장
      this.resources.items.set(key, {
        type: 'font',
        fontFamily,
        src: url,
        status: 'pending',
        priority: options.priority || 1,
        weight: options.weight || 'normal',
        style: options.style || 'normal'
      });
      
      this.resources.total++;
    });
    
    if (this.debug) {
      console.log(`폰트 리소스 ${urls.length}개 등록됨 (${fontFamily}). 총 리소스: ${this.resources.total}`);
    }
    
    return this;
  }
  
  /**
   * 진행 콜백 설정
   * @param {Function} callback - 진행 상태 콜백
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  onProgress(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onProgress = callback;
    }
    return this;
  }
  
  /**
   * 완료 콜백 설정
   * @param {Function} callback - 로딩 완료 콜백
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  onComplete(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onComplete = callback;
    }
    return this;
  }
  
  /**
   * 에러 콜백 설정
   * @param {Function} callback - 로딩 에러 콜백
   * @returns {LoadingManager} 체이닝을 위한 인스턴스
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onError = callback;
    }
    return this;
  }
  
  /**
   * 로딩 시작
   * @param {Object} options - 시작 옵션
   */
  start(options = {}) {
    const {
      timeout = 15000,  // 타임아웃 시간 줄임 (15초)
      minDuration = 1000,
      skipCache = false,
      forceComplete = true  // 타임아웃 시 강제 완료 여부
    } = options;
    
    // 이미 완료된 경우
    if (this.isComplete) {
      this.hideLoading();
      return;
    }
    
    // 등록된 리소스가 없는 경우
    if (this.resources.total === 0) {
      if (this.debug) {
        console.log('등록된 리소스가 없음. 바로 완료 처리함.');
      }
      
      setTimeout(() => {
        this.updateProgress(1);
        this.complete();
      }, minDuration);
      
      return;
    }
    
    // 시작 시간 기록
    const startTime = Date.now();
    
    if (this.debug) {
      console.log(`로딩 시작. 총 ${this.resources.total}개 리소스 로드 예정.`);
    }
    
    // 리소스 우선순위에 따라 정렬
    const sortedResources = [...this.resources.items.entries()]
      .sort((a, b) => a[1].priority - b[1].priority);
    
    // 리소스 로딩
    sortedResources.forEach(([url, resource]) => {
      // 이미 로드된 리소스면 건너뜀
      if (resource.status === 'loaded') {
        return;
      }
      
      // 캐시된 데이터 사용 (선택적)
      if (!skipCache && dataManager.hasValidCache(url)) {
        this.resourceLoaded(url);
        return;
      }
      
      try {
        switch (resource.type) {
          case 'image':
            this.loadImage(url);
            break;
          
          case 'script':
            this.loadScript(url, resource);
            break;
          
          case 'font':
            this.loadFont(url, resource);
            break;
        }
      } catch (error) {
        console.error(`리소스 로딩 시도 중 오류: ${url}`, error);
        this.resourceFailed(url);
      }
    });
    
    // 타임아웃 설정 (이전 타임아웃이 있으면 취소)
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      if (!this.isComplete) {
        console.warn(`로딩 타임아웃 발생 (${timeout}ms). 진행 상태: ${this.resources.loaded}/${this.resources.total} 로드됨.`);
        
        // 로딩 실패한 리소스 처리
        for (const [url, resource] of this.resources.items.entries()) {
          if (resource.status === 'pending') {
            this.resourceFailed(url);
          }
        }
        
        // 타임아웃 시 강제 완료 처리 (옵션)
        if (forceComplete) {
          this.complete();
          
          // 강제 안전장치: 로딩 화면이 계속 표시되고 있다면 추가로 1초 후 강제 숨김
          setTimeout(() => {
            if (this.loadingScreen && 
                (this.loadingScreen.style.display !== 'none' || 
                 this.loadingScreen.style.opacity !== '0')) {
              console.warn('타임아웃 안전장치: 로딩 화면 직접 숨김');
              this.hideLoading();
            }
          }, 1000);
        } else {
          // forceComplete가 false여도 로딩 화면은 숨겨야 함
          this.hideLoading();
        }
      }
    }, timeout);
    
    // 최소 로딩 시간 보장
    this.minLoadingTime = minDuration;
    this.startTime = startTime;
  }
  
  /**
   * 이미지 로딩
   * @param {string} url - 이미지 URL
   */
  loadImage(url) {
    const img = new Image();
    
    // 이벤트 리스너
    img.onload = () => {
      this.resourceLoaded(url);
      
      // 캐시 저장
      dataManager.saveToCache(url, {
        type: 'image',
        url,
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      console.error(`이미지 로딩 실패: ${url}`);
      this.resourceFailed(url);
    };
    
    // 로딩 시작
    img.src = url;
    
    // 요소 참조 저장
    this.resources.items.get(url).element = img;
  }
  
  /**
   * 스크립트 로딩
   * @param {string} url - 스크립트 URL
   * @param {Object} resource - 리소스 정보
   */
  loadScript(url, resource) {
    const script = document.createElement('script');
    
    // 속성 설정
    script.src = url;
    if (resource.async) script.async = true;
    if (resource.defer) script.defer = true;
    
    // 이벤트 리스너
    script.onload = () => {
      this.resourceLoaded(url);
      
      // 캐시 저장
      dataManager.saveToCache(url, {
        type: 'script',
        url
      });
    };
    
    script.onerror = () => {
      console.error(`스크립트 로딩 실패: ${url}`);
      this.resourceFailed(url);
    };
    
    // 문서에 추가
    document.head.appendChild(script);
    
    // 요소 참조 저장
    this.resources.items.get(url).element = script;
  }
  
  /**
   * 폰트 로딩
   * @param {string} key - 폰트 캐시 키
   * @param {Object} resource - 리소스 정보
   */
  loadFont(key, resource) {
    // Font Face Observer 사용 (더 좋은 방법)
    // 여기서는 간단하게 CSS @font-face 규칙 생성
    try {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: "${resource.fontFamily}";
          src: url("${resource.src}") format("${this.getFontFormat(resource.src)}");
          font-weight: ${resource.weight};
          font-style: ${resource.style};
          font-display: swap;
        }
      `;
      
      document.head.appendChild(style);
      
      // 폰트를 위한 더 단순한 로딩 처리
      // 폰트는 비동기적으로 로드되고 완전히 로드됐는지 확인하기 어려움
      // 따라서 짧은 지연 후 로드된 것으로 간주 (실제 폰트가 로드되기 전에 완료될 수 있음)
      setTimeout(() => {
        this.resourceLoaded(key);
        
        // 캐시 저장
        dataManager.saveToCache(key, {
          type: 'font',
          fontFamily: resource.fontFamily,
          url: resource.src
        });
      }, 500); // 0.5초 후 로드된 것으로 처리
    } catch (error) {
      console.error(`폰트 로딩 실패: ${resource.fontFamily} (${resource.src})`, error);
      this.resourceFailed(key);
    }
  }
  
  /**
   * 폰트 URL에서 포맷 추출
   * @param {string} url - 폰트 URL
   * @returns {string} 폰트 포맷
   */
  getFontFormat(url) {
    const ext = url.split('.').pop().toLowerCase();
    switch (ext) {
      case 'woff2': return 'woff2';
      case 'woff': return 'woff';
      case 'ttf': return 'truetype';
      case 'otf': return 'opentype';
      case 'eot': return 'embedded-opentype';
      case 'svg': return 'svg';
      default: return 'truetype';
    }
  }
  
  /**
   * 리소스 로딩 완료 처리
   * @param {string} url - 리소스 URL
   */
  resourceLoaded(url) {
    const resource = this.resources.items.get(url);
    
    // 이미 처리된 리소스인 경우
    if (!resource || resource.status !== 'pending') return;
    
    // 상태 업데이트
    resource.status = 'loaded';
    this.resources.loaded++;
    
    // 진행률 업데이트
    const progress = this.resources.loaded / this.resources.total;
    this.updateProgress(progress);
    
    if (this.debug) {
      console.log(`리소스 로드 완료 (${this.resources.loaded}/${this.resources.total}): ${url}`);
    }
    
    // 모든 리소스 로딩 완료 확인
    if (this.resources.loaded + this.resources.failed >= this.resources.total) {
      this.checkComplete();
    }
  }
  
  /**
   * 리소스 로딩 실패 처리
   * @param {string} url - 리소스 URL
   */
  resourceFailed(url) {
    const resource = this.resources.items.get(url);
    
    // 이미 처리된 리소스인 경우
    if (!resource || resource.status !== 'pending') return;
    
    // 상태 업데이트
    resource.status = 'failed';
    this.resources.failed++;
    
    // 에러 콜백 호출
    if (this.callbacks.onError) {
      this.callbacks.onError(url, resource);
    }
    
    console.error(`리소스 로딩 실패: ${url}`);
    
    // 진행률 업데이트 (실패한 리소스도 진행률에 포함)
    const progress = (this.resources.loaded + this.resources.failed) / this.resources.total;
    this.updateProgress(progress);
    
    // 모든 리소스 로딩 완료 확인
    if (this.resources.loaded + this.resources.failed >= this.resources.total) {
      this.checkComplete();
    }
  }
  
  /**
   * 진행률 업데이트 및 표시
   * @param {number} progress - 진행률 (0-1)
   */
  updateProgress(progress) {
    const percent = Math.min(100, Math.floor(progress * 100));
    
    // 로딩 프로그레스 UI 업데이트
    if (this.loadingProgress) {
      const progressBar = this.loadingProgress.querySelector('.progress-bar');
      const progressText = this.loadingProgress.querySelector('.progress-text');
      
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${percent}%`;
      }
    }
    
    // 진행 콜백 호출
    if (this.callbacks.onProgress) {
      try {
        this.callbacks.onProgress(progress, percent);
      } catch (error) {
        console.error('진행 콜백 실행 중 오류:', error);
      }
    }
  }
  
  /**
   * 로딩 완료 처리
   */
  complete() {
    // 이미 완료된 경우
    if (this.isComplete) return;
    
    // 타임아웃 취소
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    this.isComplete = true;
    
    if (this.debug) {
      console.log(`로딩 완료. ${this.resources.loaded}개 성공, ${this.resources.failed}개 실패 (총 ${this.resources.total}개)`);
    }
    
    // 최소 로딩 시간 체크
    const elapsed = Date.now() - this.startTime;
    const delay = Math.max(0, this.minLoadingTime - elapsed);
    
    // 일정 시간 후에 완료 처리
    setTimeout(() => {
      // 완료 콜백 호출 오류 시에도 로딩 화면이 안전하게 숨겨지도록 처리
      try {
        // 완료 콜백 호출
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete();
        } else {
          // 콜백이 없으면 바로 로딩 화면 숨김
          this.hideLoading();
        }
      } catch (error) {
        console.error('완료 콜백 실행 중 오류:', error);
        // 오류가 발생해도 로딩 화면은 꼭 숨김
        this.hideLoading();
      }
      
      // 안전장치: 로딩 상태가 여전히 표시되고 있다면 3초 후 강제로 숨김
      setTimeout(() => {
        if (this.loadingScreen && this.loadingScreen.style.display !== 'none' && 
            this.loadingScreen.style.opacity !== '0') {
          console.warn('안전장치: 로딩 화면 강제 숨김');
          this.loadingScreen.style.opacity = '0';
          setTimeout(() => {
            this.loadingScreen.style.display = 'none';
          }, 500);
        }
      }, 3000);
    }, delay);
  }
  
  /**
   * 로딩 완료 체크
   */
  checkComplete() {
    if (this.resources.loaded + this.resources.failed >= this.resources.total) {
      // 진행률 100%로 설정
      this.updateProgress(1);
      
      // 완료 처리
      this.complete();
    }
  }
  
  /**
   * 로딩 화면 표시
   */
  showLoading() {
    if (this.loadingScreen) {
      // 먼저 display 설정
      this.loadingScreen.style.display = 'flex';
      
      // hidden 클래스 제거로 요소 표시
      this.loadingScreen.classList.remove('hidden');
      
      if (this.debug) {
        console.log('로딩 화면 표시됨');
      }
    } else {
      console.warn('로딩 화면 요소를 찾을 수 없음');
    }
  }
  
  /**
   * 로딩 화면 숨기기
   */
  hideLoading() {
    if (this.loadingScreen) {
      // hidden 클래스 추가로 CSS 트랜지션 적용
      this.loadingScreen.classList.add('hidden');
      
      // 트랜지션 효과 후 요소 완전히 제거를 위한 타임아웃
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
        
        // 안전장치: 로딩 화면 요소에 남아있는 모든 인라인 스타일 제거
        this.loadingScreen.style.opacity = '';
        this.loadingScreen.style.visibility = '';
        this.loadingScreen.style.pointerEvents = '';
        
        if (this.debug) {
          console.log('로딩 화면 완전히 숨김 (display: none)');
        }
      }, 600); // CSS 트랜지션 시간(500ms)보다 약간 더 길게
      
      if (this.debug) {
        console.log('로딩 화면 숨김 트랜지션 시작');
      }
    } else {
      console.warn('로딩 화면 요소를 찾을 수 없음');
    }
  }
  
  /**
   * 강제로 로딩 완료 처리
   */
  forceComplete() {
    if (!this.isComplete) {
      console.warn('로딩 강제 완료 처리');
      this.complete();
    }
  }
  
  /**
   * 리소스 리셋
   */
  reset() {
    // 타임아웃 취소
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // 상태 초기화
    this.resources = {
      total: 0,
      loaded: 0,
      failed: 0,
      items: new Map()
    };
    
    this.isComplete = false;
    
    if (this.debug) {
      console.log('로딩 매니저 리셋됨');
    }
    
    return this;
  }
}

// 글로벌 인스턴스 생성
const loadingManager = new LoadingManager();

// 디버그 모드 활성화 (개발 중이므로)
loadingManager.setDebug(true);

// 기본 내보내기
export default loadingManager; 