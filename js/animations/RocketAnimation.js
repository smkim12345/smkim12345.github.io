/**
 * Cosmic Portfolio - 최적화된 로켓 애니메이션
 * GSAP를 활용한 성능 최적화된 로켓 애니메이션 클래스
 */

class RocketAnimation {
  constructor() {
    // 싱글톤 패턴 적용
    if (RocketAnimation.instance) {
      return RocketAnimation.instance;
    }
    
    RocketAnimation.instance = this;
    
    // 로켓 요소
    this.rocket = document.getElementById('rocket-element');
    this.rocketImg = this.rocket ? this.rocket.querySelector('img') : null;
    this.flame = this.rocket ? this.rocket.querySelector('.rocket-flame') : null;
    
    // 섹션 요소
    this.sections = {
      home: document.getElementById('home'),
      profile: document.getElementById('profile'),
      portfolio: document.getElementById('portfolio'),
      contact: document.getElementById('contact')
    };
    
    // 애니메이션 관련 상태
    this.currentSection = 'home';
    this.targetSection = 'home';
    this.mouseX = 0;
    this.mouseY = 0;
    this.trailElements = [];
    this.maxTrailElements = 15; // 기본값 (데스크톱)
    this.trailInterval = null;
    this.isAnimating = false;
    
    // 터치 관련 상태
    this.isTouchMoving = false;
    this.touchStartX = null;
    this.touchStartY = null;
    this.touchStartTime = null;
    this.lastTapTime = 0;
    
    // 성능 최적화 관련
    this.lastMoveTime = 0;
    this.lastTouchMoveTime = 0;
    this.moveThrottle = 16; // 약 60fps
    this.pendingMove = false;
    this.isRotationFixed = false;
    
    // 모바일 환경 감지 및 설정 최적화
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.maxTrailElements = 8;
      this.moveThrottle = 32; // 약 30fps
    }
    
    // 경로 포인트 배열
    this.pathPoints = [];
    
    // 메모리 관리
    this.disposables = new Set();
    
    // 초기화
    if (this.rocket) {
      this.init();
    }
  }
  
  /**
   * 초기화 함수
   */
  init() {
    // GSAP 플러그인 확인
    if (!window.gsap || !window.ScrollTrigger) {
      console.error('GSAP 또는 ScrollTrigger 플러그인이 로드되지 않았습니다.');
      return;
    }
    
    // 섹션별 위치 생성
    this.generateFullPath();
    
    // 화면 크기 변경 감지
    window.addEventListener('resize', this.handleDeviceChange.bind(this));
    
    // 초기 위치 설정
    gsap.set(this.rocket, {
      left: '50%', // 화면 중앙
      top: '50%',  // 화면 중앙
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 1,
      rotation: 0, // 회전 없음
      transformOrigin: "center center" // 로켓 회전 기준점
    });
    
    // 로딩 후 로켓 등장 애니메이션
    gsap.to(this.rocket, {
      opacity: 1,
      duration: 1,
      delay: 2.5,
      ease: 'power2.out',
      onComplete: () => {
        // 로켓 초기 부스트 효과
        this.boostEffect();
        
        // 지속적인 화염 애니메이션 시작
        this.startFlameAnimation();
        
        // 궤적 생성 시작
        this.startTrailCreation();
      }
    });
    
    // 마우스 움직임에 따른 로켓 위치 설정
    this.setupMouseRotation();
    
    // 화면 크기 변경 이벤트 처리
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  /**
   * 전체 경로 생성 - 모든 섹션을 연결하는 부드러운 경로 생성
   */
  generateFullPath() {
    // 각 섹션별 위치 정보
    const sectionPositions = {
      home: { x: 50, y: 50, rotation: 0, scale: 1 },
      profile: { x: 30, y: 40, rotation: -15, scale: 0.9 },
      portfolio: { x: 70, y: 50, rotation: -30, scale: 0.8 },
      contact: { x: 50, y: 60, rotation: -90, scale: 0.7 }
    };
    
    // 섹션 순서
    const sectionOrder = ['home', 'profile', 'portfolio', 'contact'];
    
    // 경로 포인트 초기화
    this.pathPoints = [];
    
    // 각 섹션 사이에 중간 포인트 생성
    for (let i = 0; i < sectionOrder.length - 1; i++) {
      const currentSection = sectionOrder[i];
      const nextSection = sectionOrder[i + 1];
      
      const startPos = sectionPositions[currentSection];
      const endPos = sectionPositions[nextSection];
      
      // 시작점 추가
      this.pathPoints.push({
        x: startPos.x,
        y: startPos.y,
        rotation: startPos.rotation,
        scale: startPos.scale,
        section: currentSection
      });
      
      // 섹션 사이에 5개의 중간 포인트 추가
      for (let j = 1; j <= 5; j++) {
        const progress = j / 6;
        
        // 직선 보간과 곡선 효과 조합
        let midX, midY;
        
        // 베지어 곡선 효과를 위한 중간 제어점 계산
        if (j === 3) { // 중간 지점에서는 약간의 곡선 효과 추가
          // x 좌표에 곡선 효과 추가
          const controlX = (startPos.x + endPos.x) / 2;
          const offsetX = (endPos.y - startPos.y) * 0.3;
          midX = controlX + offsetX;
          
          // y 좌표에 곡선 효과 추가
          const controlY = (startPos.y + endPos.y) / 2;
          const offsetY = (endPos.x - startPos.x) * 0.1;
          midY = controlY + offsetY;
        } else {
          // 나머지 중간 포인트는 선형 보간
          midX = startPos.x + (endPos.x - startPos.x) * progress;
          midY = startPos.y + (endPos.y - startPos.y) * progress;
        }
        
        // 회전 및 크기 보간
        const midRotation = startPos.rotation + (endPos.rotation - startPos.rotation) * progress;
        const midScale = startPos.scale + (endPos.scale - startPos.scale) * progress;
        
        this.pathPoints.push({
          x: midX,
          y: midY,
          rotation: midRotation,
          scale: midScale,
          section: progress < 0.5 ? currentSection : nextSection
        });
      }
    }
    
    // 마지막 섹션 추가
    const lastSection = sectionOrder[sectionOrder.length - 1];
    const lastPos = sectionPositions[lastSection];
    
    this.pathPoints.push({
      x: lastPos.x,
      y: lastPos.y,
      rotation: lastPos.rotation,
      scale: lastPos.scale,
      section: lastSection
    });
  }
  
  /**
   * 스크롤 진행도에 따른 경로 포인트 가져오기
   * @param {number} progress - 스크롤 진행도 (0-1)
   * @returns {Object} - 위치, 회전, 크기 정보
   */
  getPathPointAtProgress(progress) {
    if (this.pathPoints.length === 0) return null;
    
    // 진행도에 해당하는 인덱스 계산
    const index = Math.min(
      Math.floor(progress * (this.pathPoints.length - 1)),
      this.pathPoints.length - 2
    );
    
    // 두 포인트 사이의 진행도 계산
    const pointProgress = (progress * (this.pathPoints.length - 1)) - index;
    
    // 현재 포인트와 다음 포인트
    const currentPoint = this.pathPoints[index];
    const nextPoint = this.pathPoints[index + 1];
    
    // 두 포인트 사이 보간
    return {
      x: currentPoint.x + (nextPoint.x - currentPoint.x) * pointProgress,
      y: currentPoint.y + (nextPoint.y - currentPoint.y) * pointProgress,
      rotation: currentPoint.rotation + (nextPoint.rotation - currentPoint.rotation) * pointProgress,
      scale: currentPoint.scale + (nextPoint.scale - currentPoint.scale) * pointProgress,
      section: pointProgress < 0.5 ? currentPoint.section : nextPoint.section
    };
  }
  
  /**
   * 마우스 회전 설정
   */
  setupMouseRotation() {
    // 마우스 이벤트
    document.addEventListener('mousemove', (e) => {
      // 쓰로틀링 적용
      const now = Date.now();
      if (now - this.lastMoveTime < this.moveThrottle) {
        if (!this.pendingMove) {
          this.pendingMove = true;
          setTimeout(() => {
            this.handlePointerMove(e.clientX, e.clientY, 'mouse');
            this.pendingMove = false;
            this.lastMoveTime = Date.now();
          }, this.moveThrottle);
        }
        return;
      }
      
      this.lastMoveTime = now;
      this.handlePointerMove(e.clientX, e.clientY, 'mouse');
    });
    
    // 터치 이벤트
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      
      // 터치 움직임 상태 설정
      this.isTouchMoving = true;
      
      // 쓰로틀링 적용
      const now = Date.now();
      if (now - this.lastTouchMoveTime < this.moveThrottle * 2) return;
      
      this.lastTouchMoveTime = now;
      const touch = e.touches[0];
      this.handlePointerMove(touch.clientX, touch.clientY, 'touch');
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      this.isTouchMoving = false;
      this.touchStartX = null;
      this.touchStartY = null;
      this.touchStartTime = null;
    }, { passive: true });
  }
  
  /**
   * 터치 시작 처리
   * @param {TouchEvent} e - 터치 이벤트
   */
  handleTouchStart(e) {
    if (!e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const now = Date.now();
    
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = now;
    
    // 더블 탭 감지
    const timeSinceLastTap = now - this.lastTapTime;
    if (timeSinceLastTap < 300) {
      // 더블 탭 효과
      this.boostEffect();
      
      // 특수 이펙트 생성
      this.createTouchEffect(touch.clientX, touch.clientY, true);
    }
    
    this.lastTapTime = now;
  }
  
  /**
   * 포인터 이동 처리
   * @param {number} pointerX - X 좌표
   * @param {number} pointerY - Y 좌표
   * @param {string} inputType - 입력 타입 (mouse/touch)
   */
  handlePointerMove(pointerX, pointerY, inputType) {
    // 포인터 위치 업데이트
    this.mouseX = pointerX;
    this.mouseY = pointerY;
    
    // 로켓 위치 및 회전 업데이트
    this.updateRocketPosition(inputType);
  }
  
  /**
   * 로켓 위치 업데이트
   * @param {string} inputType - 입력 타입 (mouse/touch)
   */
  updateRocketPosition(inputType) {
    if (!this.rocket || this.isRotationFixed) return;
    
    // 화면 중앙에서의 마우스 위치 계산
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    
    const deltaX = this.mouseX - centerX;
    const deltaY = this.mouseY - centerY;
    
    // 회전 각도 계산 (마우스 방향을 향하도록)
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const rotationAngle = angle;
    
    // 회전 애니메이션
    gsap.to(this.rocket, {
      rotation: rotationAngle,
      duration: inputType === 'touch' ? 0.5 : 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
  
  /**
   * 화면 크기 변경 처리
   */
  handleResize() {
    // 경로 재생성
    this.generateFullPath();
  }
  
  /**
   * 기기 변경 감지 및 설정 최적화
   */
  handleDeviceChange() {
    // 현재 모바일 여부 확인
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // 기기 유형이 변경되었을 때만 설정 업데이트
    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        // 모바일 설정으로 변경
        this.maxTrailElements = 8;
        this.moveThrottle = 32;
        
        // 이미 생성된 효과 요소 일부 제거 (성능 향상)
        while (this.trailElements.length > this.maxTrailElements) {
          const oldTrail = this.trailElements.shift();
          if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
          }
        }
        
        // 로켓 크기 조정
        gsap.to(this.rocket, {
          scale: 0.9,
          duration: 0.3
        });
        
        // 모바일에서 궤적 생성 간격 늘리기 (배터리 절약)
        if (this.trailInterval) {
          clearInterval(this.trailInterval);
          this.trailInterval = setInterval(() => {
            this.createTrail();
          }, 250);
        }
      } else {
        // 데스크톱 설정으로 변경
        this.maxTrailElements = 15;
        this.moveThrottle = 16;
        
        // 로켓 원래 크기로 복귀
        gsap.to(this.rocket, {
          scale: 1,
          duration: 0.3
        });
        
        // 데스크톱에서 궤적 생성 간격 줄이기
        if (this.trailInterval) {
          clearInterval(this.trailInterval);
          this.trailInterval = setInterval(() => {
            this.createTrail();
          }, 150);
        }
      }
    }
  }
  
  /**
   * 화염 애니메이션 시작
   */
  startFlameAnimation() {
    if (!this.flame) return;
    
    // 지속적인 화염 애니메이션
    const flameAnim = gsap.to(this.flame, {
      height: '40px',
      opacity: 0.8,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    // 메모리 관리용 추적
    this.disposables.add(flameAnim);
  }
  
  /**
   * 부스트 효과
   */
  boostEffect() {
    if (!this.flame || !this.rocketImg || this.isAnimating) return;
    
    // 애니메이션 중 플래그 설정
    this.isAnimating = true;
    
    // 기기 유형에 따른 설정 조정
    const flameHeight = this.isMobile ? '45px' : '60px';
    const pulseScale = this.isMobile ? 1.05 : 1.1;
    const repeatCount = this.isMobile ? 2 : 3;
    
    // 화염 강화 애니메이션
    const flameAnim = gsap.to(this.flame, {
      height: flameHeight,
      opacity: 1,
      duration: 0.2,
      repeat: repeatCount,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    // 로켓 펄스 애니메이션
    const rocketAnim = gsap.to(this.rocketImg, {
      scale: pulseScale,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });
    
    // 강화된 궤적 생성
    this.createEnhancedTrail();
    
    // 메모리 관리용 추적
    this.disposables.add(flameAnim);
    this.disposables.add(rocketAnim);
    
    // 일정 시간 후 애니메이션 플래그 해제
    setTimeout(() => {
      this.isAnimating = false;
    }, this.isMobile ? 800 : 1000);
  }
  
  /**
   * 궤적 생성 시작
   */
  startTrailCreation() {
    // 이전 인터벌 제거
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
    }
    
    // 기기 유형에 따른 다른 간격 설정
    const interval = this.isMobile ? 400 : 300;
    
    // 새 인터벌 설정
    this.trailInterval = setInterval(() => {
      // 현재 시간 체크 (쓰로틀링)
      const now = Date.now();
      
      // 마지막 이동 후 쓰로틀 시간이 지났으면 궤적 생성
      if (now - this.lastMoveTime >= this.moveThrottle) {
        this.createTrail();
        this.lastMoveTime = now;
      }
    }, interval);
  }
  
  /**
   * 일반 궤적 생성
   */
  createTrail() {
    if (!this.rocket) return;
    
    // 오래된 궤적 제거
    if (this.trailElements.length >= this.maxTrailElements) {
      const oldTrail = this.trailElements.shift();
      if (oldTrail && oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
      }
    }
    
    // 랜덤 생성 확률 - 성능 최적화
    if ((this.isMobile && Math.random() > 0.5) || (!this.isMobile && Math.random() > 0.7)) {
      return; // 확률로 건너뛰기
    }
    
    // 새 궤적 생성
    const trail = document.createElement('div');
    trail.className = 'rocket-trail';
    
    // 로켓 위치에 궤적 배치
    const rocketRect = this.rocket.getBoundingClientRect();
    
    // 기기 유형에 따른 크기 조정
    const baseSize = this.isMobile ? 3 : 4;
    const trailSize = Math.random() * baseSize + baseSize;
    
    gsap.set(trail, {
      width: trailSize,
      height: trailSize,
      left: rocketRect.left + rocketRect.width / 2,
      top: rocketRect.bottom - (this.isMobile ? 10 : 15),
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '50%',
      filter: this.isMobile ? 'blur(0.5px)' : 'blur(1px)'
    });
    
    // 문서에 궤적 추가
    document.body.appendChild(trail);
    this.trailElements.push(trail);
    
    // 애니메이션 지속 시간
    const animDuration = this.isMobile ? 0.8 : 1.2;
    
    // 페이드아웃 애니메이션
    const trailAnim = gsap.to(trail, {
      opacity: 0,
      scale: 0.2,
      y: 20 + Math.random() * 10,
      duration: animDuration,
      ease: 'power1.out',
      onComplete: () => {
        // 애니메이션 완료 후 배열에서 제거
        const index = this.trailElements.indexOf(trail);
        if (index > -1) {
          this.trailElements.splice(index, 1);
        }
        
        // DOM에서 제거
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }
    });
    
    // 메모리 관리용 추적
    this.disposables.add(trailAnim);
  }
  
  /**
   * 강화된 궤적 생성 (부스트 효과 시)
   */
  createEnhancedTrail() {
    if (!this.rocket) return;
    
    // 로켓 위치 정보
    const rocketRect = this.rocket.getBoundingClientRect();
    const centerX = rocketRect.left + rocketRect.width / 2;
    const bottomY = rocketRect.bottom;
    
    // 강화된 궤적의 개수 (모바일에서는 적게)
    const trailCount = this.isMobile ? 6 : 10;
    
    for (let i = 0; i < trailCount; i++) {
      // 새 궤적 생성
      const trail = document.createElement('div');
      trail.className = 'rocket-trail enhanced';
      
      // 크기 및 위치 설정
      const size = (Math.random() * 5 + 3) * (this.isMobile ? 0.8 : 1);
      const spreadX = Math.random() * 30 - 15;
      const spreadY = Math.random() * 10;
      
      gsap.set(trail, {
        width: size,
        height: size,
        left: centerX + spreadX,
        top: bottomY + spreadY,
        backgroundColor: `rgba(255, ${Math.round(Math.random() * 100 + 155)}, ${Math.round(Math.random() * 50)}, ${Math.random() * 0.3 + 0.7})`,
        borderRadius: '50%',
        filter: `blur(${this.isMobile ? 1 : 2}px)`
      });
      
      // 문서에 추가
      document.body.appendChild(trail);
      
      // 애니메이션 설정
      const duration = Math.random() * 0.5 + 0.8;
      const spread = Math.random() * 40 - 20;
      
      // 궤적 애니메이션
      const trailAnim = gsap.to(trail, {
        x: spread * 2,
        y: 50 + Math.random() * 30,
        opacity: 0,
        scale: 0.1,
        duration: duration,
        ease: 'power2.out',
        onComplete: () => {
          // 완료 후 제거
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
        }
      });
      
      // 메모리 관리용 추적
      this.disposables.add(trailAnim);
    }
  }
  
  /**
   * 로켓 애니메이션 초기화 및 시작
   */
  initScrollAnimation() {
    // 구현 필요: 스크롤 기반 애니메이션 초기화
    console.log('로켓 스크롤 애니메이션 초기화됨');
  }
  
  /**
   * 애니메이션 일시 중지
   * 성능 최적화를 위해 모달이 열릴 때 등에 사용
   */
  pauseAnimation() {
    // 애니메이션 상태 저장
    this.wasAnimating = this.isAnimating;
    
    // 애니메이션 중지
    this.isAnimating = false;
    
    // 궤적 생성 중지
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
      this.trailInterval = null;
    }
    
    // 로켓 애니메이션 중지
    if (this.rocket) {
      gsap.killTweensOf(this.flame);
      
      // 로켓 투명도 감소
      gsap.to(this.rocket, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power1.out'
      });
    }
    
    console.log('로켓 애니메이션 일시 중지됨');
  }
  
  /**
   * 애니메이션 재개
   * 성능 최적화를 위해 모달이 닫힐 때 등에 사용
   */
  resumeAnimation() {
    // 이전에 애니메이션 중이었으면 재개
    if (this.wasAnimating !== false) {
      this.isAnimating = true;
    }
    
    // 로켓 투명도 복원
    if (this.rocket) {
      gsap.to(this.rocket, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out'
      });
      
      // 화염 애니메이션 재개
      this.startFlameAnimation();
    }
    
    // 궤적 생성 재개
    if (!this.trailInterval) {
      this.startTrailCreation();
    }
    
    console.log('로켓 애니메이션 재개됨');
  }
  
  /**
   * 메모리 해제 및 이벤트 리스너 제거
   */
  dispose() {
    // 이벤트 리스너 제거
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('resize', this.handleDeviceChange);
    
    // 로켓 요소 초기화
    if (this.rocket) {
      gsap.killTweensOf(this.rocket);
      gsap.killTweensOf(this.flame);
    }
    
    // 궤적 요소 제거
    this.trailElements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    // 궤적 생성 인터벌 정리
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
      this.trailInterval = null;
    }
    
    // 기타 메모리 정리
    this.trailElements = [];
    this.pathPoints = [];
    this.disposables.clear();
    
    console.log('로켓 애니메이션 리소스 정리 완료');
  }
}

// 글로벌 인스턴스 생성
const rocketAnimation = new RocketAnimation();

// 기본 내보내기
export default rocketAnimation; 