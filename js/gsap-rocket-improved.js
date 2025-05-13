/**
 * Cosmic Portfolio - 개선된 GSAP 로켓 애니메이션
 * 매끄러운 이동과 회전이 적용된 로켓 애니메이션
 */

// 개선된 GSAP 로켓 애니메이션 클래스
class ImprovedRocketAnimation {
    constructor() {
        // 로켓 요소
        this.rocket = document.getElementById('rocket-element');
        this.rocketImg = this.rocket ? this.rocket.querySelector('img') : null;
        this.flame = this.rocket ? this.rocket.querySelector('.rocket-flame') : null;
        
        // 섹션 요소
        this.sections = {
            home: document.getElementById('home'),
            about: document.getElementById('about'),
            experience: document.getElementById('experience'),
            skills: document.getElementById('skills'),
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
        this.isTouchMoving = false; // 터치 움직임 상태
        this.touchStartX = null;    // 터치 시작 X 좌표
        this.touchStartY = null;    // 터치 시작 Y 좌표
        this.touchStartTime = null; // 터치 시작 시간
        this.lastTapTime = 0;       // 마지막 탭 시간 (더블 탭 감지용)
        
        // 성능 최적화 관련
        this.lastMoveTime = 0;      // 마지막 이동 시간 (쓰로틀링용)
        this.lastTouchMoveTime = 0; // 마지막 터치 이동 시간 (쓰로틀링용)
        this.moveThrottle = 16;     // 이동 쓰로틀링 (약 60fps)
        this.pendingMove = false;   // 대기 중인 이동 여부
        this.isRotationFixed = false; // 회전 고정 상태
        
        // 모바일 환경 감지 및 설정 최적화
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            this.maxTrailElements = 8; // 모바일에서는 효과 감소
            this.moveThrottle = 32; // 모바일에서는 쓰로틀링 증가 (약 30fps)
        }
        
        // 경로 포인트 배열
        this.pathPoints = [];
        this.generateFullPath();
        
        // 초기화
        if (this.rocket) {
            this.init();
        }
        
        // 화면 크기 변경 감지
        window.addEventListener('resize', this.handleDeviceChange.bind(this));
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
        
        // 초기 위치 설정
        gsap.set(this.rocket, {
            left: '50%', // 화면 중앙
            top: '50%',  // 화면 중앙
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: 1,
            rotation: 0, // 회전 없음
            transformOrigin: "center center" // 로켓 회전 기준점 변경
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
        
        // 로켓 클릭 효과 비활성화
        // 네비게이션 링크 클릭 효과도 비활성화
    }
    
    /**
     * 전체 경로 생성 - 모든 섹션을 연결하는 부드러운 경로 생성
     */
    generateFullPath() {
        // 각 섹션별 위치 정보
        const sectionPositions = {
            home: { x: 50, y: 50, rotation: 0, scale: 1 },
            about: { x: 30, y: 50, rotation: -15, scale: 0.9 },
            experience: { x: 60, y: 50, rotation: -30, scale: 0.8 },
            skills: { x: 40, y: 50, rotation: -45, scale: 0.7 },
            portfolio: { x: 70, y: 50, rotation: -60, scale: 0.6 },
            contact: { x: 50, y: 60, rotation: -90, scale: 0.5 }
        };
        
        // 섹션 순서
        const sectionOrder = ['home', 'about', 'experience', 'skills', 'portfolio', 'contact'];
        
        // 각 섹션 사이에 중간 포인트 생성 (부드러운 곡선을 위해)
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
            
            // 섹션 사이에 5개의 중간 포인트 추가 (더 부드러운 곡선 효과)
            for (let j = 1; j <= 5; j++) {
                const progress = j / 6;
                
                // 직선 보간과 곡선 효과 조합
                let midX, midY;
                
                // 베지어 곡선 효과를 위한 중간 제어점 계산
                if (j === 3) { // 중간 지점에서는 약간의 곡선 효과 추가
                    // x 좌표에 곡선 효과 추가
                    const controlX = (startPos.x + endPos.x) / 2;
                    const offsetX = (endPos.y - startPos.y) * 0.3; // 수직 거리에 기반한 오프셋
                    midX = controlX + offsetX;
                    
                    // y 좌표에 곡선 효과 추가
                    const controlY = (startPos.y + endPos.y) / 2;
                    const offsetY = (endPos.x - startPos.x) * 0.1; // 수평 거리에 기반한 오프셋
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
     * 스크롤 애니메이션 설정 (비활성화됨)
     * 스크롤에 따른 로켓 이동을 제거하고 마우스에만 반응하도록 수정
     */
    setupScrollAnimation() {
        // 비활성화 - 로켓이 스크롤에 반응하지 않도록 함
        console.log("스크롤 기반 로켓 애니메이션이 비활성화되었습니다. 마우스 움직임에만 반응합니다.");
    }
    
    /**
     * 경로를 따라 로켓 애니메이션 (비활성화됨)
     * 스크롤에 따른 애니메이션을 제거하고 마우스에만 반응하도록 수정
     * @param {number} progress - 스크롤 진행도 (0-1)
     */
    animateAlongPath(progress) {
        // 비활성화 - 스크롤 애니메이션이 제거되었으므로 이 함수는 아무 동작도 하지 않음
        return;
    }
    
    /**
     * 섹션 클래스 업데이트
     * @param {string} sectionName - 섹션 이름
     */
    updateSectionClass(sectionName) {
        if (!this.rocket) return;
        
        // CSS 클래스 업데이트
        this.rocket.className = '';
        this.rocket.classList.add(`rocket-${sectionName}`);
        
        // 로켓 착륙은 rocket-landing.js에서 처리합니다
        // contact 섹션 처리는 명시적으로 삭제 (충돌 방지)
    }
    
    /**
     * 터치 시작 이벤트 핸들러
     * 별도의 메서드로 분리하여 기능 확장
     * @param {TouchEvent} e - 터치 이벤트
     */
    handleTouchStart(e) {
        if (e.touches.length > 0) {
            this.isTouchMoving = true;
            const touch = e.touches[0];
            
            // 터치 위치에 시각적 효과 표시 (모바일 전용)
            if (this.isMobile) {
                this.createTouchEffect(touch.clientX, touch.clientY);
            }
            
            // 터치 시작 시 위치 기록 (터치 제스처 감지용)
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartTime = Date.now();
            
            // 터치 위치로 로켓 이동
            this.handlePointerMove(touch.clientX, touch.clientY, 'touch');
        }
    }
    
    /**
     * 터치 효과 생성 (모바일 사용자 피드백용)
     */
    createTouchEffect(x, y, isBoost = false) {
        const effect = document.createElement('div');
        effect.className = isBoost ? 'touch-effect boost' : 'touch-effect';
        
        // 위치 설정
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        // 문서에 추가
        document.body.appendChild(effect);
        
        // 애니메이션
        gsap.to(effect, {
            scale: isBoost ? 1.5 : 1.2,
            opacity: 0,
            duration: isBoost ? 0.6 : 0.4,
            ease: 'power1.out',
            onComplete: () => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }
        });
    }
    
    /**
     * 마우스/터치 움직임에 따른 로켓 위치 설정
     * 커서/터치의 하단에 일정 거리를 유지하며 따라다니도록 수정
     * 모바일 환경을 위한 터치 이벤트 지원 추가
     */
    setupMouseRotation() {
        // 마우스 이벤트 리스너
        document.addEventListener('mousemove', (e) => {
            this.handlePointerMove(e.clientX, e.clientY, 'mouse');
        });
        
        // 터치 시작 이벤트
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        
        // 터치 이동 이벤트 리스너
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                // 멀티 터치 중 첫 번째 터치 사용
                const touch = e.touches[0];
                
                // 현재 시간 체크 (쓰로틀링)
                const now = Date.now();
                if (now - this.lastTouchMoveTime >= this.moveThrottle) {
                    this.handlePointerMove(touch.clientX, touch.clientY, 'touch');
                    this.lastTouchMoveTime = now;
                }
                
                // 스와이프 속도 계산 (부스트 효과용)
                if (this.touchStartX && this.touchStartY) {
                    const dx = touch.clientX - this.touchStartX;
                    const dy = touch.clientY - this.touchStartY;
                    const timeDiff = now - this.touchStartTime;
                    
                    // 스와이프 속도가 일정 임계값을 넘으면 부스트 효과 활성화
                    if (timeDiff > 0) {
                        const speed = Math.sqrt(dx*dx + dy*dy) / timeDiff;
                        if (speed > 1.5 && !this.isAnimating) { // 빠른 스와이프 감지
                            this.boostEffect();
                            
                            // 부스트 효과 표시 (모바일 전용)
                            if (this.isMobile) {
                                this.createTouchEffect(touch.clientX, touch.clientY, true);
                            }
                            
                            // 부스트 후 상태 초기화
                            this.touchStartX = touch.clientX;
                            this.touchStartY = touch.clientY;
                            this.touchStartTime = now;
                        }
                    }
                }
                
                // 페이지 스크롤 허용 (사용자 경험 저하 방지)
                // 하지만 빠른 제스처 시에는 방지 (우발적 스크롤 방지)
                if (Math.abs(touch.clientY - this.touchStartY) > 50) {
                    // 빠른 세로 스와이프는 스크롤로 간주 (로켓 조작 아님)
                    this.isTouchMoving = false;
                } else if (this.isTouchMoving) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // 터치 종료 이벤트
        document.addEventListener('touchend', (e) => {
            this.isTouchMoving = false;
            
            // 터치 종료 시 제스처 감지 (탭, 더블 탭 등)
            if (this.touchStartTime && !this.isAnimating) {
                const endTime = Date.now();
                const timeDiff = endTime - this.touchStartTime;
                
                // 짧은 탭 감지 (300ms 이내)
                if (timeDiff < 300) {
                    // 최근 탭 시간 확인 (더블 탭 감지용)
                    if (this.lastTapTime && (endTime - this.lastTapTime < 500)) {
                        // 더블 탭 - 부스트 효과
                        this.boostEffect();
                        
                        // 부스트 효과 표시 (모바일 전용)
                        if (this.isMobile && this.touchStartX && this.touchStartY) {
                            this.createTouchEffect(this.touchStartX, this.touchStartY, true);
                        }
                        
                        this.lastTapTime = 0; // 재설정
                    } else {
                        // 단일 탭 - 마지막 탭 시간 기록
                        this.lastTapTime = endTime;
                    }
                }
            }
            
            // 상태 초기화
            this.touchStartX = null;
            this.touchStartY = null;
            this.touchStartTime = null;
        });
        
        // 터치 취소 이벤트
        document.addEventListener('touchcancel', () => {
            this.isTouchMoving = false;
            this.touchStartX = null;
            this.touchStartY = null;
            this.touchStartTime = null;
        });
        
        // 모바일에서 로켓 소개 메시지
        if (this.isMobile) {
            // 약간의 지연 후 모바일 사용법 표시
            setTimeout(() => {
                this.showMobileTip();
            }, 5000);
        }
    }
    
    /**
     * 모바일 로켓 사용법 표시
     */
    showMobileTip() {
        // 팁 메시지가 이미 표시됐는지 확인
        if (localStorage.getItem('rocketMobileTipShown')) {
            return;
        }
        
        // 팁 메시지 생성
        const tipElement = document.createElement('div');
        tipElement.className = 'rocket-tip rocket-tip-show';
        tipElement.innerHTML = `
            <h3>로켓 조작 방법</h3>
            <p>• 화면을 터치하여 로켓을 움직여보세요</p>
            <p>• 빠르게 스와이프하거나 더블 탭하면 부스트!</p>
            <p>• 마지막 섹션에서 로켓이 착륙합니다</p>
        `;
        
        // 문서에 추가
        document.body.appendChild(tipElement);
        
        // 팁 표시 기록
        localStorage.setItem('rocketMobileTipShown', 'true');
        
        // 일정 시간 후 제거
        setTimeout(() => {
            if (tipElement.parentNode) {
                gsap.to(tipElement, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                        if (tipElement.parentNode) {
                            tipElement.parentNode.removeChild(tipElement);
                        }
                    }
                });
            }
        }, 5000);
    }
    
    /**
     * 포인터(마우스/터치) 이동 처리 통합 함수
     * @param {number} pointerX - X 좌표
     * @param {number} pointerY - Y 좌표
     * @param {string} inputType - 입력 유형 ('mouse' 또는 'touch')
     */
    handlePointerMove(pointerX, pointerY, inputType) {
        this.mouseX = pointerX;
        this.mouseY = pointerY;
        
        // 로켓이 없거나 착륙 상태인 경우 처리하지 않음
        const isRocketLanded = localStorage.getItem('rocketLanded') === 'true';
        
        if (!this.rocket || 
            isRocketLanded || 
            (window.rocketLanding && !window.rocketLanding.isMouseFollowEnabled())) {
            return;
        }
        
        // 현재 시간 체크 (프레임 기반 움직임 최적화)
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveThrottle) {
            // 너무 빈번한 호출 방지 (프레임 스킵)
            if (!this.pendingMove) {
                // 다음 프레임에서 처리하도록 예약
                this.pendingMove = true;
                requestAnimationFrame(() => {
                    this.updateRocketPosition(inputType);
                    this.pendingMove = false;
                });
            }
            return;
        }
        
        // 일반 경우 바로 업데이트
        this.lastMoveTime = now;
        this.updateRocketPosition(inputType);
    }
    
    /**
     * 로켓 위치 업데이트 (최적화 버전)
     * @param {string} inputType - 입력 유형 ('mouse' 또는 'touch')
     */
    updateRocketPosition(inputType) {
        // 고정된 회전 각도 설정 (회전 없음)
        if (!this.isRotationFixed) {
            gsap.to(this.rocket, {
                rotation: 0, // 회전 없음
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
            this.isRotationFixed = true;
        }
        
        // 현재 화면 크기 가져오기
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 마우스/터치 위치를 퍼센트로 변환
        const pointerXPercent = (this.mouseX / windowWidth) * 100;
        const pointerYPercent = (this.mouseY / windowHeight) * 100;
        
        // 기기 감지 - 모바일에서는 오프셋 값 조정
        const isMobile = window.innerWidth <= 768;
        
        // 포인터 하단에 로켓 위치시키기 (일정 거리 아래에 위치)
        // 모바일에서는 더 가까운 거리에 배치
        const offsetY = isMobile ? 8 : 12; // 모바일에서는 8%, 데스크톱에서는 12%
        
        // 애니메이션 지속 시간 - 터치는 더 빠르게 반응
        const animDuration = inputType === 'touch' ? 0.1 : 0.2;
        
        // 부드러운 움직임을 위한 이징 선택
        // 터치에서는 더 즉각적인 이징 사용
        const easeType = inputType === 'touch' ? 'power1.out' : 'power1.out';
        
        // 로켓 위치 업데이트 - 포인터 바로 아래에 위치
        gsap.to(this.rocket, {
            left: pointerXPercent + '%',
            top: (pointerYPercent + offsetY) + '%', // 포인터 아래에 위치
            duration: animDuration, // 부드럽게 따라감 (터치는 더 빠르게)
            ease: easeType,
            overwrite: 'auto',
            skewX: 0, // 기울임 효과 제거
            skewY: 0  // 기울임 효과 제거
        });
    }
    
    /**
     * 화면 크기 변경 이벤트 처리
     */
    handleResize() {
        // 위치 업데이트
        const scrollProgress = ScrollTrigger.getAll()[0]?.progress || 0;
        this.animateAlongPath(scrollProgress);
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
                
                // 로켓 크기 조정 (JS에서 추가 설정)
                gsap.to(this.rocket, {
                    scale: 0.9,
                    duration: 0.3
                });
                
                // 모바일에서 궤적 생성 간격 늘리기 (배터리 절약)
                if (this.trailInterval) {
                    clearInterval(this.trailInterval);
                    this.trailInterval = setInterval(() => {
                        this.createTrail();
                    }, 250); // 250ms 간격 (초당 4회)
                }
            } else {
                // 데스크톱 설정으로 변경
                this.maxTrailElements = 15;
                this.moveThrottle = 16;
                
                // 로켓 크기 원래대로
                gsap.to(this.rocket, {
                    scale: 1,
                    duration: 0.3
                });
                
                // 데스크톱에서 궤적 생성 간격 기본값으로
                if (this.trailInterval) {
                    clearInterval(this.trailInterval);
                    this.trailInterval = setInterval(() => {
                        this.createTrail();
                    }, 150); // 150ms 간격 (초당 약 6.6회)
                }
            }
            
            console.log(`기기 유형 변경: ${this.isMobile ? '모바일' : '데스크톱'} 모드로 최적화됨`);
        }
        
        // 화면 크기 변경에 따른 위치 업데이트
        this.handleResize();
    }
    
    /**
     * 화염 애니메이션 시작
     */
    startFlameAnimation() {
        if (!this.flame) return;
        
        // 지속적인 화염 애니메이션
        gsap.to(this.flame, {
            height: '40px',
            opacity: 0.8,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }
    
    /**
     * 부스트 효과 - 모바일 환경 최적화 버전
     */
    boostEffect() {
        if (!this.flame || !this.rocketImg) return;
        
        // 애니메이션 중 플래그 설정
        this.isAnimating = true;
        
        // 기기 유형에 따른 설정 조정
        const flameHeight = this.isMobile ? '45px' : '60px'; // 모바일에서 작게
        const pulseScale = this.isMobile ? 1.05 : 1.1; // 모바일에서 작게
        const repeatCount = this.isMobile ? 2 : 3; // 모바일에서 반복 감소
        
        // 화염 강화 애니메이션
        gsap.to(this.flame, {
            height: flameHeight,
            opacity: 1,
            duration: 0.2,
            repeat: repeatCount,
            yoyo: true,
            ease: 'power1.inOut'
        });
        
        // 로켓 펄스 애니메이션
        gsap.to(this.rocketImg, {
            scale: pulseScale,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
        
        // 강화된 궤적 생성
        this.createEnhancedTrail();
        
        // 부스트 효과음 재생 (오디오 구현 시 활성화)
        // this.playBoostSound();
        
        // 일정 시간 후 애니메이션 플래그 해제
        setTimeout(() => {
            this.isAnimating = false;
        }, this.isMobile ? 800 : 1000); // 모바일에서 더 빠르게 정리
    }
    
    /**
     * 부스트 효과음 재생 (미래 구현용)
     */
    playBoostSound() {
        // 오디오 효과 구현 예정
        console.log('부스트 효과음 재생');
    }
    
    /**
     * 궤적 생성 시작 - 모바일 최적화 버전
     */
    startTrailCreation() {
        // 이전 인터벌 제거
        if (this.trailInterval) {
            clearInterval(this.trailInterval);
        }
        
        // 기기 유형에 따른 다른 간격 설정 (간격 증가로 최적화)
        const interval = this.isMobile ? 400 : 300; // 모바일: 400ms, 데스크톱: 300ms (이전: 250ms, 150ms)
        
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
        
        console.log(`궤적 생성 시작 - ${this.isMobile ? '모바일' : '데스크톱'} 최적화 (${interval}ms 간격)`);
    }
    
    /**
     * 일반 궤적 생성 - 모바일 환경 최적화 버전
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
        
        // 랜덤 생성 확률 - 성능 최적화를 위해 생성 확률 감소
        if ((this.isMobile && Math.random() > 0.5) || (!this.isMobile && Math.random() > 0.7)) {
            return; // 모바일: 50% 확률로 건너뛰기, 데스크톱: 30% 확률로 건너뛰기
        }
        
        // 새 궤적 생성
        const trail = document.createElement('div');
        trail.className = 'rocket-trail';
        
        // 로켓 위치에 궤적 배치
        const rocketRect = this.rocket.getBoundingClientRect();
        
        // 기기 유형에 따른 크기 조정
        const baseSize = this.isMobile ? 3 : 4; // 크기 감소
        const trailSize = Math.random() * baseSize + baseSize;
        
        gsap.set(trail, {
            width: trailSize,
            height: trailSize,
            left: rocketRect.left + rocketRect.width / 2,
            top: rocketRect.bottom - (this.isMobile ? 10 : 15),
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            filter: this.isMobile ? 'blur(0.5px)' : 'blur(1px)' // 블러 효과 감소
        });
        
        // 문서에 궤적 추가
        document.body.appendChild(trail);
        this.trailElements.push(trail);
        
        // 애니메이션 지속 시간 - 짧게 설정
        const animDuration = this.isMobile ? 0.8 : 1.2;
        
        // 궤적 페이드 아웃 애니메이션
        gsap.to(trail, {
            width: trailSize * (this.isMobile ? 1.1 : 1.3), // 확장 효과 감소
            height: trailSize * (this.isMobile ? 1.1 : 1.3),
            opacity: 0,
            duration: animDuration,
            ease: 'power1.out',
            onComplete: () => {
                // 애니메이션 완료 후 DOM에서 제거
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                    const index = this.trailElements.indexOf(trail);
                    if (index > -1) {
                        this.trailElements.splice(index, 1);
                    }
                }
            }
        });
    }
    
    /**
     * 강화된 궤적 생성 (부스트 효과 때 사용) - 모바일 환경 최적화
     */
    createEnhancedTrail() {
        if (!this.rocket) return;
        
        // 기기 유형에 따른 궤적 수 조정 (개수 감소로 최적화)
        const particleCount = this.isMobile ? 3 : 5; // 모바일: 3개, 데스크톱: 5개 (이전: 5개, 10개)
        const particleDelay = this.isMobile ? 100 : 70; // 모바일: 100ms, 데스크톱: 70ms (이전: 80ms, 50ms)
        
        // 다수의 궤적을 빠르게 생성
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                // 새 궤적 생성
                const trail = document.createElement('div');
                trail.className = 'rocket-trail enhanced';
                
                // 로켓 위치에 궤적 배치
                const rocketRect = this.rocket.getBoundingClientRect();
                
                // 기기 유형에 따른 크기 조정
                const baseSize = this.isMobile ? 5 : 7; // 모바일: 5px, 데스크톱: 7px (이전: 6px, 8px)
                const trailSize = Math.random() * baseSize + baseSize;
                
                // 약간의 무작위성 추가
                const offsetX = (Math.random() - 0.5) * (this.isMobile ? 5 : 8);
                const offsetY = Math.random() * (this.isMobile ? 5 : 8);
                
                gsap.set(trail, {
                    width: trailSize,
                    height: trailSize,
                    left: rocketRect.left + rocketRect.width / 2 + offsetX,
                    top: rocketRect.bottom - 15 + offsetY,
                    backgroundColor: 'rgba(255, 168, 0, 0.8)',
                    borderRadius: '50%',
                    boxShadow: this.isMobile ? 
                        '0 0 3px rgba(255, 100, 0, 0.6)' : // 그림자 효과 감소
                        '0 0 5px rgba(255, 100, 0, 0.7)'
                });
                
                // 문서에 궤적 추가
                document.body.appendChild(trail);
                
                // 애니메이션 지속 시간 - 모바일에서 짧게
                const animDuration = this.isMobile ? 0.7 : 0.9;
                
                // 애니메이션 거리 - 모바일에서 작게
                const yDistance = this.isMobile ? 
                    (Math.random() * 15 + 10) : // 모바일: 10-25px (이전: 15-35px)
                    (Math.random() * 20 + 15);  // 데스크톱: 15-35px (이전: 20-50px)
                
                // 궤적 페이드 아웃 애니메이션
                gsap.to(trail, {
                    width: trailSize * (this.isMobile ? 1.3 : 1.5), // 확장 효과 감소
                    height: trailSize * (this.isMobile ? 1.3 : 1.5),
                    opacity: 0,
                    y: '+=' + yDistance,
                    x: offsetX * (this.isMobile ? 1.5 : 2),
                    duration: animDuration,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (trail.parentNode) {
                            trail.parentNode.removeChild(trail);
                        }
                    }
                });
            }, i * particleDelay);
        }
    }
    
    /**
     * 착륙 애니메이션 시작 
     * (비활성화 - rocket-landing.js에서 처리)
     */
    startLandingAnimation() {
        // 착륙 애니메이션은 rocket-landing.js에서 처리하므로 이 함수는 아무 동작도 하지 않음
        console.log("착륙 애니메이션이 rocket-landing.js로 위임되었습니다");
    }
    
    /**
     * 착륙 애니메이션 중지
     * (비활성화 - rocket-landing.js에서 처리)
     */
    stopLandingAnimation() {
        // 착륙 애니메이션은 rocket-landing.js에서 처리하므로 이 함수는 아무 동작도 하지 않음
        if (this.landingAnimation) {
            this.landingAnimation.kill();
            this.landingAnimation = null;
        }
    }
    
    /**
     * 섹션에 따른 기본 회전 각도 가져오기
     * @param {string} section - 섹션 이름
     * @returns {number} - 회전 각도
     */
    getSectionRotation(section) {
        const rotations = {
            home: 0,
            about: -15,
            experience: -30,
            skills: -45,
            portfolio: -60,
            contact: -90
        };
        
        return rotations[section] || 0;
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 로딩 화면이 제거된 후 로켓 애니메이션 초기화
    setTimeout(() => {
        window.improvedRocketAnimation = new ImprovedRocketAnimation();
    }, 2000);
});
