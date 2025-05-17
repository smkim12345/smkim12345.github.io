/**
 * Cosmic Portfolio - 애니메이션 컨트롤러
 * GSAP 애니메이션을 효율적으로 관리하는 클래스
 */

class AnimationController {
  constructor() {
    // 싱글톤 패턴 적용
    if (AnimationController.instance) {
      return AnimationController.instance;
    }
    
    AnimationController.instance = this;
    
    // 애니메이션 타임라인 저장소
    this.timelines = new Map();
    
    // 애니메이션 설정
    this.settings = {
      defaultDuration: 1,
      defaultEase: 'power2.out',
      staggerAmount: 0.1,
      debug: false
    };
    
    // 메모리 관리를 위한 참조 저장
    this.activeAnimations = new Set();
    
    this.log('애니메이션 컨트롤러 초기화 완료');
  }
  
  /**
   * 공통 인트로 애니메이션 생성
   * @param {Object} options - 애니메이션 옵션
   * @returns {gsap.timeline} 생성된 타임라인
   */
  createIntroAnimation(options = {}) {
    const {
      nameElement = document.querySelector('.name'),
      titleElement = document.querySelector('.title'),
      taglineElement = document.querySelector('.tagline'),
      ctaButtons = document.querySelector('.cta-buttons'),
      stagger = this.settings.staggerAmount,
      duration = this.settings.defaultDuration,
      ease = this.settings.defaultEase
    } = options;
    
    // 기존 타임라인이 있으면 재사용
    if (this.timelines.has('intro')) {
      return this.timelines.get('intro');
    }
    
    // 타임라인 생성
    const introTl = gsap.timeline();
    
    if (nameElement) {
      introTl.from(nameElement, {
        y: 50,
        opacity: 0,
        duration,
        ease
      });
    }
    
    if (titleElement) {
      introTl.from(
        titleElement,
        {
          y: 30,
          opacity: 0,
          duration,
          ease
        },
        "-=0.5"
      );
    }
    
    if (taglineElement) {
      introTl.from(
        taglineElement,
        {
          y: 30,
          opacity: 0,
          duration,
          ease
        },
        "-=0.5"
      );
    }
    
    if (ctaButtons) {
      introTl.from(
        ctaButtons,
        {
          y: 30,
          opacity: 0,
          duration,
          ease
        },
        "-=0.5"
      );
    }
    
    // 타임라인 저장
    this.timelines.set('intro', introTl);
    this.activeAnimations.add(introTl);
    
    return introTl;
  }
  
  /**
   * 스크롤 기반 애니메이션 설정
   * @param {string} selector - 요소 선택자
   * @param {Object} animProps - 애니메이션 속성
   * @param {Object} triggerOptions - 스크롤 트리거 옵션
   * @returns {ScrollTrigger} 생성된 스크롤 트리거
   */
  createScrollAnimation(selector, animProps = {}, triggerOptions = {}) {
    // 요소가 없으면 종료
    const elements = gsap.utils.toArray(selector);
    if (elements.length === 0) {
      this.log(`요소를 찾을 수 없음: ${selector}`, null, true);
      return null;
    }
    
    // 기본 애니메이션 속성 설정
    const defaultProps = {
      y: 30,
      opacity: 0,
      duration: this.settings.defaultDuration,
      ease: this.settings.defaultEase
    };
    
    // 기본 트리거 옵션 설정
    const defaultTrigger = {
      trigger: elements[0].parentNode || elements[0],
      start: 'top 80%',
      toggleActions: 'play none none none'
    };
    
    // 속성 병합
    const finalAnimProps = { ...defaultProps, ...animProps };
    const finalTriggerOptions = { ...defaultTrigger, ...triggerOptions };
    
    // 스크롤 애니메이션 생성
    const animation = gsap.from(elements, {
      ...finalAnimProps,
      scrollTrigger: finalTriggerOptions,
      stagger: elements.length > 1 ? this.settings.staggerAmount : 0,
      onStart: () => {
        this.log(`스크롤 애니메이션 시작: ${selector}`);
      },
      onComplete: () => {
        this.log(`스크롤 애니메이션 완료: ${selector}`);
      }
    });
    
    // 활성 애니메이션 목록에 추가
    this.activeAnimations.add(animation);
    
    return animation.scrollTrigger;
  }
  
  /**
   * 타임라인 가져오기 또는 생성
   * @param {string} id - 타임라인 식별자
   * @param {Object} options - 타임라인 옵션
   * @returns {gsap.timeline} gsap 타임라인
   */
  getTimeline(id, options = {}) {
    // 이미 존재하는 타임라인 반환
    if (this.timelines.has(id)) {
      return this.timelines.get(id);
    }
    
    // 새 타임라인 생성
    const timeline = gsap.timeline(options);
    this.timelines.set(id, timeline);
    this.activeAnimations.add(timeline);
    
    return timeline;
  }
  
  /**
   * 섹션 요소 페이드인 애니메이션
   * @param {string} selector - 요소 선택자
   * @param {Object} options - 애니메이션 옵션
   */
  fadeInSection(selector, options = {}) {
    const {
      y = 30,
      duration = this.settings.defaultDuration,
      ease = this.settings.defaultEase,
      stagger = this.settings.staggerAmount,
      delay = 0
    } = options;
    
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    gsap.fromTo(
      elements,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        delay,
        onStart: () => {
          this.log(`페이드인 애니메이션 시작: ${selector}`);
        }
      }
    );
  }
  
  /**
   * 요소 전환 애니메이션
   * @param {HTMLElement} fromElement - 시작 요소
   * @param {HTMLElement} toElement - 종료 요소
   * @param {Object} options - 애니메이션 옵션
   * @returns {gsap.timeline} 애니메이션 타임라인
   */
  transitionElements(fromElement, toElement, options = {}) {
    const {
      duration = this.settings.defaultDuration / 2,
      ease = this.settings.defaultEase,
      overlap = 0.1
    } = options;
    
    if (!fromElement || !toElement) {
      this.log('전환 요소 중 하나가 없음', null, true);
      return null;
    }
    
    const tl = gsap.timeline();
    
    // 첫 요소 페이드아웃
    tl.to(fromElement, {
      opacity: 0,
      duration,
      ease
    });
    
    // 두번째 요소 페이드인 (약간 중첩)
    tl.fromTo(
      toElement,
      { opacity: 0, display: 'none' },
      { opacity: 1, display: 'block', duration, ease },
      `-=${overlap}`
    );
    
    return tl;
  }
  
  /**
   * 메모리 정리 - 필요없는 애니메이션 해제
   */
  cleanup() {
    // 사용 중이지 않은 타임라인 정리
    this.timelines.forEach((timeline, id) => {
      if (timeline.isActive()) return;
      
      // 완료된 타임라인 제거
      this.timelines.delete(id);
      this.activeAnimations.delete(timeline);
      timeline.kill();
      
      this.log(`타임라인 정리: ${id}`);
    });
    
    this.log(`애니메이션 정리 완료, 남은 타임라인: ${this.timelines.size}`);
  }
  
  /**
   * 디버그 로그
   * @param {string} message - 로그 메시지
   * @param {any} [data] - 추가 데이터
   * @param {boolean} [isError=false] - 에러 로그 여부
   */
  log(message, data, isError = false) {
    if (!this.settings.debug) return;
    
    const logMethod = isError ? console.error : console.log;
    const prefix = '[AnimationController]';
    
    if (data) {
      logMethod(`${prefix} ${message}`, data);
    } else {
      logMethod(`${prefix} ${message}`);
    }
  }
  
  /**
   * 디버그 모드 설정
   * @param {boolean} enabled - 활성화 여부
   */
  setDebug(enabled) {
    this.settings.debug = enabled;
    this.log(`디버그 모드: ${enabled ? '활성화' : '비활성화'}`);
  }
}

// 글로벌 인스턴스 생성
const animationController = new AnimationController();

// 기본 내보내기
export default animationController; 