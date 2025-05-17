/**
 * Cosmic Portfolio - 지연 로딩 유틸리티
 * 이미지 및 컴포넌트의 최적화된 지연 로딩을 위한 클래스
 */

import { isMobile } from './config.js';
import workerManager from './WorkerManager.js';

class LazyLoader {
  constructor(options = {}) {
    // 싱글톤 패턴 적용
    if (LazyLoader.instance) {
      return LazyLoader.instance;
    }
    
    LazyLoader.instance = this;
    
    // 옵션 설정
    this.options = {
      rootMargin: options.rootMargin || '50px 0px',
      threshold: options.threshold || 0.1,
      loadingClass: options.loadingClass || 'lazy-loading',
      loadedClass: options.loadedClass || 'lazy-loaded',
      errorClass: options.errorClass || 'lazy-error',
      useNativeLoading: options.useNativeLoading !== false, // 기본적으로 native loading 사용
      useWorker: options.useWorker !== false, // 워커 사용 여부
      lowQualityPreview: options.lowQualityPreview !== false, // 저품질 미리보기 사용
      maxWidth: options.maxWidth || (isMobile() ? 768 : 1920), // 최대 이미지 너비
      ...options
    };
    
    // Intersection Observer 인스턴스
    this.observer = null;
    
    // 처리된 요소 추적용 Set
    this.processedElements = new Set();
    
    // 로딩 중인 요소 추적용 Map
    this.loadingElements = new Map();
    
    // 콜백 맵
    this.callbacks = new Map();
    
    // 성능 워커
    this.performanceWorker = null;
    if (this.options.useWorker) {
      this.initWorker();
    }
    
    // 초기화
    this.init();
  }
  
  /**
   * 초기화
   */
  init() {
    // Intersection Observer API 지원 여부 확인
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver API를 지원하지 않습니다. 즉시 로딩으로 대체합니다.');
      return;
    }
    
    // Observer 생성
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );
    
    // 네이티브 이미지 로딩 프리로드 처리
    if (this.options.useNativeLoading) {
      this.setupNativeLoading();
    }
  }
  
  /**
   * 성능 워커 초기화
   */
  initWorker() {
    this.performanceWorker = workerManager.getWorker('performance') || 
                            workerManager.initPerformanceWorker();
    
    // 워커 응답 핸들러 등록
    if (this.performanceWorker) {
      workerManager.registerMessageHandler('performance', 'optimizedImage', (data) => {
        const element = this.loadingElements.get(data.id);
        if (element) {
          this.applyOptimizedImage(element, data.optimizedData);
          this.loadingElements.delete(data.id);
        }
      });
    }
  }
  
  /**
   * 네이티브 이미지 로딩 기능 설정
   */
  setupNativeLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-lazy-src], img[data-src]').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }
  }
  
  /**
   * 최적의 이미지 포맷 확인
   * @returns {Object} 지원하는 포맷 정보
   */
  getSupportedFormats() {
    const formats = {
      webp: false,
      avif: false,
      jpeg2000: false
    };
    
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // WebP 지원 확인
      formats.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      // AVIF 지원 확인 (최신 브라우저)
      formats.avif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      
      // JPEG 2000 지원 확인 (Safari)
      formats.jpeg2000 = canvas.toDataURL('image/jp2').indexOf('data:image/jp2') === 0;
    }
    
    return formats;
  }
  
  /**
   * 이미지 URL 최적화
   * @param {string} src - 원본 이미지 URL
   * @returns {string} 최적화된 이미지 URL
   */
  getOptimizedImageUrl(src) {
    if (!src) return src;
    
    // 이미 최적화된 URL이면 그대로 반환
    if (src.includes('format=webp') || src.includes('format=avif')) {
      return src;
    }
    
    // CDN 사용 확인
    const isCDN = src.includes('cloudinary.com') || 
                  src.includes('imgix.net') || 
                  src.includes('imagekit.io');
    
    if (isCDN) {
      const formats = this.getSupportedFormats();
      
      // AVIF 지원하면 AVIF 사용 (최고 압축률)
      if (formats.avif) {
        return this.addFormatToUrl(src, 'avif');
      }
      
      // WebP 지원하면 WebP 사용
      if (formats.webp) {
        return this.addFormatToUrl(src, 'webp');
      }
    }
    
    return src;
  }
  
  /**
   * URL에 포맷 파라미터 추가
   * @param {string} url - 이미지 URL
   * @param {string} format - 이미지 포맷
   * @returns {string} 수정된 URL
   */
  addFormatToUrl(url, format) {
    const separator = url.includes('?') ? '&' : '?';
    
    // 클라우디너리 CDN
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/f_${format}/`);
    }
    
    // 일반 URL에 쿼리스트링 추가
    return `${url}${separator}format=${format}`;
  }
  
  /**
   * 반응형 이미지 크기 URL 생성
   * @param {string} src - 원본 이미지 URL
   * @param {number} width - 요청 너비
   * @returns {string} 크기 조정된, URL
   */
  getResponsiveImageUrl(src, width) {
    if (!src) return src;
    
    const isCDN = src.includes('cloudinary.com') || 
                  src.includes('imgix.net') || 
                  src.includes('imagekit.io');
    
    if (isCDN) {
      // 클라우디너리 CDN
      if (src.includes('cloudinary.com')) {
        return src.replace('/upload/', `/upload/w_${width},c_limit/`);
      }
      
      // ImgIX CDN
      if (src.includes('imgix.net')) {
        const separator = src.includes('?') ? '&' : '?';
        return `${src}${separator}w=${width}&fit=max`;
      }
    }
    
    return src;
  }
  
  /**
   * 교차점 감지 핸들러
   * @param {IntersectionObserverEntry[]} entries - 관찰된 요소 항목들
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // 요소 타입에 따라 처리
        if (element.tagName === 'IMG') {
          this.loadImage(element);
        } else if (element.dataset.lazyBackground) {
          this.loadBackgroundImage(element);
        } else if (element.dataset.lazyComponent) {
          this.loadComponent(element);
        }
        
        // 콜백 처리
        const callback = this.callbacks.get(element);
        if (callback && typeof callback === 'function') {
          callback(element);
        }
        
        // 관찰 중단
        this.observer.unobserve(element);
        this.processedElements.add(element);
      }
    });
  }
  
  /**
   * 이미지 로딩
   * @param {HTMLImageElement} img - 이미지 요소
   */
  loadImage(img) {
    // 이미 처리된 경우
    if (this.processedElements.has(img)) return;
    
    // 데이터 속성에서 소스 가져오기
    const src = img.dataset.lazySrc || img.dataset.src;
    if (!src) return;
    
    // 로딩 클래스 추가
    img.classList.add(this.options.loadingClass);
    
    // 저품질 미리보기 사용하는 경우 blur-up 효과 적용
    if (this.options.lowQualityPreview && img.dataset.lazySrcSmall) {
      img.src = img.dataset.lazySrcSmall;
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.3s ease-out';
    }
    
    // 최적화된 URL 생성
    const optimizedSrc = this.getOptimizedImageUrl(src);
    
    // 반응형 이미지 사이즈 적용 (위치 기반 계산)
    let targetWidth = this.options.maxWidth;
    
    // 요소의 실제 표시 크기에 맞춤
    const rect = img.getBoundingClientRect();
    if (rect.width > 0) {
      targetWidth = Math.min(this.options.maxWidth, Math.ceil(rect.width * window.devicePixelRatio));
    }
    
    // 최종 URL
    const responsiveUrl = this.getResponsiveImageUrl(optimizedSrc, targetWidth);
    
    // 이미지 로딩
    const tempImage = new Image();
    
    tempImage.onload = () => {
      // 워커 사용하는 경우 이미지 최적화
      if (this.performanceWorker && this.options.useWorker) {
        this.optimizeImageWithWorker(img, tempImage);
      } else {
        // 직접 이미지 적용
        img.src = responsiveUrl;
        img.style.filter = '';
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.loadedClass);
        
        // 데이터 속성 정리
        if (img.dataset.lazySrc) {
          delete img.dataset.lazySrc;
        }
        if (img.dataset.lazySrcSmall) {
          delete img.dataset.lazySrcSmall;
        }
      }
    };
    
    tempImage.onerror = () => {
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.errorClass);
      console.error(`이미지 로딩 실패: ${responsiveUrl}`);
      
      // 원본 URL로 재시도
      if (responsiveUrl !== src) {
        console.log(`최적화된 URL로 로딩 실패, 원본 URL로 재시도: ${src}`);
        img.src = src;
      }
    };
    
    tempImage.src = responsiveUrl;
  }
  
  /**
   * 워커를 통한 이미지 최적화
   * @param {HTMLImageElement} img - 이미지 요소
   * @param {Image} loadedImage - 로드된 이미지
   */
  optimizeImageWithWorker(img, loadedImage) {
    try {
      // 캔버스에 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = loadedImage.width;
      canvas.height = loadedImage.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(loadedImage, 0, 0);
      
      // 이미지 데이터 추출
      canvas.toBlob((blob) => {
        // 파일 리더로 ArrayBuffer 변환
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target.result;
          
          // 고유 ID 생성
          const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // 로딩 중인 요소 추적
          this.loadingElements.set(id, img);
          
          // 워커에 최적화 요청
          workerManager.postMessage('performance', 'optimizeImage', {
            id,
            imageData,
            options: {
              maxWidth: this.options.maxWidth,
              quality: 0.85
            }
          });
        };
        
        reader.readAsArrayBuffer(blob);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('이미지 최적화 오류:', error);
      
      // 오류 시 기본 처리
      img.src = loadedImage.src;
      img.style.filter = '';
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.loadedClass);
    }
  }
  
  /**
   * 최적화된 이미지 적용
   * @param {HTMLImageElement} img - 이미지 요소
   * @param {ArrayBuffer} optimizedData - 최적화된 이미지 데이터
   */
  applyOptimizedImage(img, optimizedData) {
    try {
      // ArrayBuffer를 Blob으로 변환
      const blob = new Blob([optimizedData], { type: 'image/jpeg' });
      
      // Blob URL 생성
      const url = URL.createObjectURL(blob);
      
      // 이미지에 적용
      img.onload = () => {
        img.style.filter = '';
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.loadedClass);
        
        // 데이터 속성 정리
        if (img.dataset.lazySrc) {
          delete img.dataset.lazySrc;
        }
        if (img.dataset.lazySrcSmall) {
          delete img.dataset.lazySrcSmall;
        }
        
        // Blob URL 해제 (메모리 누수 방지)
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error) {
      console.error('최적화된 이미지 적용 오류:', error);
      
      // 오류 시 원본 소스 사용
      const src = img.dataset.lazySrc || img.dataset.src;
      if (src) {
        img.src = src;
        img.style.filter = '';
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.loadedClass);
      }
    }
  }
  
  /**
   * 배경 이미지 로딩
   * @param {HTMLElement} element - 배경 이미지를 적용할 요소
   */
  loadBackgroundImage(element) {
    // 이미 처리된 경우
    if (this.processedElements.has(element)) return;
    
    const src = element.dataset.lazyBackground;
    if (!src) return;
    
    // 로딩 클래스 추가
    element.classList.add(this.options.loadingClass);
    
    // 최적화된 URL 생성
    const optimizedSrc = this.getOptimizedImageUrl(src);
    
    // 이미지 로드
    const tempImage = new Image();
    
    tempImage.onload = () => {
      element.style.backgroundImage = `url(${optimizedSrc})`;
      element.classList.remove(this.options.loadingClass);
      element.classList.add(this.options.loadedClass);
      
      // 데이터 속성 정리
      delete element.dataset.lazyBackground;
    };
    
    tempImage.onerror = () => {
      element.classList.remove(this.options.loadingClass);
      element.classList.add(this.options.errorClass);
      console.error(`배경 이미지 로딩 실패: ${optimizedSrc}`);
      
      // 원본 URL로 재시도
      if (optimizedSrc !== src) {
        console.log(`최적화된 URL로 로딩 실패, 원본 URL로 재시도: ${src}`);
        element.style.backgroundImage = `url(${src})`;
      }
    };
    
    tempImage.src = optimizedSrc;
  }
  
  /**
   * 컴포넌트 로딩 (동적 임포트)
   * @param {HTMLElement} element - 컴포넌트를 로드할 요소
   */
  loadComponent(element) {
    // 이미 처리된 경우
    if (this.processedElements.has(element)) return;
    
    const componentPath = element.dataset.lazyComponent;
    if (!componentPath) return;
    
    // 로딩 클래스 추가
    element.classList.add(this.options.loadingClass);
    
    // 동적 임포트 시도
    import(/* webpackChunkName: "lazyComponent" */ componentPath)
      .then(module => {
        const initFunction = module.default || module.init || module;
        
        if (typeof initFunction === 'function') {
          try {
            // 컴포넌트 초기화
            initFunction(element);
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.loadedClass);
            
            // 데이터 속성 정리
            delete element.dataset.lazyComponent;
          } catch (error) {
            console.error(`컴포넌트 초기화 오류: ${componentPath}`, error);
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.errorClass);
          }
        } else {
          console.error(`컴포넌트에 초기화 함수가 없습니다: ${componentPath}`);
          element.classList.remove(this.options.loadingClass);
          element.classList.add(this.options.errorClass);
        }
      })
      .catch(error => {
        console.error(`컴포넌트 로딩 실패: ${componentPath}`, error);
        element.classList.remove(this.options.loadingClass);
        element.classList.add(this.options.errorClass);
      });
  }
  
  /**
   * 이미지 요소 관찰 시작
   * @param {string|NodeList|HTMLElement} selector - 대상 선택자 또는 요소
   * @param {Function} callback - 로드 완료 후 콜백
   */
  observeImages(selector, callback = null) {
    const elements = this.getElements(selector);
    
    elements.forEach(img => {
      // 네이티브 로딩 지원 확인
      if (this.options.useNativeLoading && 'loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
        this.loadImage(img);
      } else {
        // 콜백 등록
        if (callback) {
          this.callbacks.set(img, callback);
        }
        
        // 관찰 시작
        this.observer.observe(img);
      }
    });
    
    return this;
  }
  
  /**
   * 배경 이미지 관찰 시작
   * @param {string|NodeList|HTMLElement} selector - 대상 선택자 또는 요소
   * @param {Function} callback - 로드 완료 후 콜백
   */
  observeBackgrounds(selector, callback = null) {
    const elements = this.getElements(selector);
    
    elements.forEach(element => {
      // 콜백 등록
      if (callback) {
        this.callbacks.set(element, callback);
      }
      
      // 관찰 시작
      this.observer.observe(element);
    });
    
    return this;
  }
  
  /**
   * 컴포넌트 관찰 시작
   * @param {string|NodeList|HTMLElement} selector - 대상 선택자 또는 요소
   * @param {Function} callback - 로드 완료 후 콜백
   */
  observeComponents(selector, callback = null) {
    const elements = this.getElements(selector);
    
    elements.forEach(element => {
      // 콜백 등록
      if (callback) {
        this.callbacks.set(element, callback);
      }
      
      // 관찰 시작
      this.observer.observe(element);
    });
    
    return this;
  }
  
  /**
   * 선택자를 통해 요소 가져오기
   * @param {string|NodeList|HTMLElement} selector - 선택자 또는 요소
   * @returns {HTMLElement[]} 요소 배열
   */
  getElements(selector) {
    let elements = [];
    
    if (typeof selector === 'string') {
      elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof NodeList) {
      elements = Array.from(selector);
    } else if (selector instanceof HTMLElement) {
      elements = [selector];
    }
    
    return elements;
  }
  
  /**
   * 관찰 중단
   * @param {string|NodeList|HTMLElement} selector - 대상 선택자 또는 요소
   */
  unobserve(selector) {
    const elements = this.getElements(selector);
    
    elements.forEach(element => {
      this.observer.unobserve(element);
      this.processedElements.delete(element);
      this.callbacks.delete(element);
    });
    
    return this;
  }
  
  /**
   * 모든 관찰 중단
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.processedElements.clear();
      this.callbacks.clear();
      this.loadingElements.clear();
    }
    
    return this;
  }
}

// 글로벌 인스턴스 생성
const lazyLoader = new LazyLoader();

// 기본 내보내기
export default lazyLoader; 