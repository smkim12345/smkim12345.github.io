/**
 * Cosmic Portfolio - 개선된 GSAP 로켓 애니메이션
 * 매끄러운 이동과 회전이 적용된 로켓 애니메이션
 */

// 개선된 GSAP 로켓 애니메이션 클래스 - 간소화된 버전
class ImprovedRocketAnimation {
    constructor() {
        // DOM 요소 참조
        this.rocket = document.getElementById('rocket-element');
        this.rocketImg = this.rocket ? this.rocket.querySelector('img') : null;
        this.flame = this.rocket ? this.rocket.querySelector('.rocket-flame') : null;
        
        // 상태 값 초기화
        this.isActive = true; // 기본값을 true로 변경
        this.isPaused = false;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.isAnimating = false;
        this.animationFrameId = null;
        this.lastMouseMoveTime = Date.now();
        
        // 오프셋 설정 - 로켓과 마우스 사이의 거리(변경하지말것 직접적인 지시없는 이상 고정 내용)
        this.offsetDistance = -100; // 마우스와 로켓 사이 거리 (픽셀)
        this.fixedRotation = 0; // 고정된 로켓 방향 (불꽃이 아래로)
        
        console.log('로켓 애니메이션 인스턴스 생성됨');
        
        // 생성자에서 요소가 존재하는지 확인
        if (this.rocket) {
            this.init();
        } else {
            console.error('로켓 요소를 찾을 수 없습니다.');
            
            // DOM 컨텐츠가 로드되면 다시 시도
            document.addEventListener('DOMContentLoaded', () => {
                this.rocket = document.getElementById('rocket-element');
                this.rocketImg = this.rocket ? this.rocket.querySelector('img') : null;
                this.flame = this.rocket ? this.rocket.querySelector('.rocket-flame') : null;
                
                if (this.rocket) {
                    this.init();
                } else {
                    // 5ms 간격으로 최대 10번 다시 시도
                    let attempts = 0;
                    const checkInterval = setInterval(() => {
                        attempts++;
                        this.rocket = document.getElementById('rocket-element');
                        
                        if (this.rocket || attempts >= 10) {
                            clearInterval(checkInterval);
                            if (this.rocket) {
                                this.rocketImg = this.rocket.querySelector('img');
                                this.flame = this.rocket.querySelector('.rocket-flame');
                                this.init();
                            }
                        }
                    }, 5);
                }
            });
        }
    }
    
    /**
     * 초기화 함수
     */
    init() {
        // 로켓 요소 스타일 강제 설정
        this.setRocketStyles();
        
        // 초기 위치 설정
        gsap.set(this.rocket, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            opacity: 1, // 투명도를 1로 시작 (바로 보이게)
            scale: 1,
            rotation: this.fixedRotation, // 고정 회전값 적용
            transformOrigin: "center center"
        });
        
        // 로딩 후 로켓 등장 애니메이션 (더 짧게 조정)
        gsap.to(this.rocket, {
            opacity: 1,
            duration: 0.3, // 빠른 등장
            ease: 'power1.out', 
            onComplete: () => {
                // 즉시 활성화 및 마우스 추적 설정
                this.isActive = true;
                this.setupMouseTracking();
                // 애니메이션 루프 시작
                this.startAnimationLoop();
                console.log('로켓 애니메이션 활성화');
            }
        });
        
        // 초기 위치 강제 업데이트
        this.updateRocketPosition();
    }
    
    /**
     * 로켓 요소 스타일 강제 설정
     */
    setRocketStyles() {
        if (!this.rocket) return;
        
        // 최고 z-index로 강제 설정
        this.rocket.style.zIndex = '10000';
        this.rocket.style.pointerEvents = 'auto !important';
        
        if (this.rocketImg) {
            this.rocketImg.style.pointerEvents = 'auto !important';
        }
        
        if (this.flame) {
            this.flame.style.pointerEvents = 'none';
        }
        
        // 네비게이션이 이벤트를 차단하지 않도록 설정
        const navElement = document.querySelector('.main-nav');
        if (navElement) {
            navElement.style.pointerEvents = 'none';
            
            // 네비게이션 내부 요소들은 이벤트 받도록 설정
            const navContainers = navElement.querySelectorAll('.nav-container, .logo, .menu-toggle, .nav-links, .nav-links li, .nav-links a');
            navContainers.forEach(element => {
                element.style.pointerEvents = 'auto';
            });
        }
    }
    
    /**
     * 간소화된 마우스 트래킹 설정
     */
    setupMouseTracking() {
        // 이전 이벤트 리스너 제거
        if (this._mouseMoveHandler) {
            document.removeEventListener('mousemove', this._mouseMoveHandler);
            document.removeEventListener('touchmove', this._touchMoveHandler);
        }
        
        // 새 이벤트 리스너 생성 및 등록
        this._mouseMoveHandler = (e) => {
            if (this.isActive && !this.isPaused) {
                // 마우스 위치 저장
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.lastMouseMoveTime = Date.now();
            }
        };
        
        // 터치 이벤트 핸들러 추가 (모바일 지원)
        this._touchMoveHandler = (e) => {
            if (this.isActive && !this.isPaused && e.touches && e.touches[0]) {
                // 터치 위치 저장
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                this.lastMouseMoveTime = Date.now();
                
                // 터치 이벤트는 스크롤을 방해할 수 있으므로 로켓에만 적용
                if (e.target === this.rocket || e.target === this.rocketImg) {
                    e.preventDefault();
                }
            }
        };
        
        // passive: true로 이벤트 리스너 최적화 (터치는 false로 설정하여 preventDefault 사용)
        document.addEventListener('mousemove', this._mouseMoveHandler, { passive: true });
        document.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
        
        // 로켓 요소에 직접 이벤트 리스너 추가 (마우스 이벤트가 다른 요소에 가려질 경우를 대비)
        if (this.rocket) {
            this.rocket.addEventListener('mousemove', this._mouseMoveHandler, { passive: true });
            this.rocket.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
        }
        
        // 클릭/터치 이벤트 핸들러 추가 - 로켓을 마우스 위치에서 일정 거리 유지
        const clickHandler = (e) => {
            if (this.isActive && !this.isPaused) {
                const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
                
                if (x !== null && y !== null) {
                    this.mouseX = x;
                    this.mouseY = y;
                    this.lastMouseMoveTime = Date.now();
                    
                    // 마우스 위치에서 위쪽으로 오프셋 적용하여 로켓 위치 계산
                    const targetX = x;
                    const targetY = y - this.offsetDistance; // 위쪽으로 오프셋
                    
                    // 즉시 애니메이션 (매우 빠른 이동)
                    gsap.to(this.rocket, {
                        left: targetX,
                        top: targetY,
                        duration: 0.1, // 즉각적인 이동
                        ease: "none",
                        rotation: this.fixedRotation, // 고정 회전
                        xPercent: -50,
                        yPercent: -50,
                        overwrite: true
                    });
                }
            }
        };
        
        // 클릭/터치 이벤트 추가
        document.addEventListener('click', clickHandler, { passive: true });
        document.addEventListener('touchstart', clickHandler, { passive: true });
        
        console.log('마우스/터치 트래킹 활성화됨');
    }
    
    /**
     * 애니메이션 루프 시작
     */
    startAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // 애니메이션 프레임 요청
        let lastFrame = Date.now();
        const fps = 60; // 목표 FPS
        const frameInterval = 1000 / fps;
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - lastFrame;
            
            // 프레임 간격 조절 (CPU 과부하 방지)
            if (elapsed > frameInterval) {
                lastFrame = now - (elapsed % frameInterval);
                
                // 마우스 이동이 있을 때만 애니메이션 적용 (성능 최적화)
                if (this.isActive && !this.isPaused && !this.isAnimating) {
                    // 마지막 마우스 이동 후 5초가 지나면 업데이트 빈도 줄임
                    const timeSinceLastMove = now - this.lastMouseMoveTime;
                    if (timeSinceLastMove < 5000 || now % 500 < 100) { // 5초 이후에는 0.5초마다 한 번씩만 업데이트
                        this.updateRocketPosition();
                    }
                }
            }
            
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
        console.log('애니메이션 루프 시작됨');
    }
    
    /**
     * 로켓 위치 업데이트 - 최적화된 버전
     */
    updateRocketPosition() {
        if (!this.rocket || !this.isActive || this.isPaused) return;
        
        try {
            this.isAnimating = true;
            
            // 현재 로켓 위치 가져오기
            const rocketRect = this.rocket.getBoundingClientRect();
            const rocketCenterX = rocketRect.left + rocketRect.width / 2;
            const rocketCenterY = rocketRect.top + rocketRect.height / 2;
            
            // 마우스 위치에서 오프셋 적용
            const targetX = this.mouseX;
            const targetY = this.mouseY - this.offsetDistance; // 마우스보다 위쪽에 위치
            
            // 로켓과 목표 위치 사이의 거리 계산
            const deltaX = targetX - rocketCenterX;
            const deltaY = targetY - rocketCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // 일정 거리 이상 떨어졌을 때만 애니메이션 적용 (미세한 떨림 방지)
            if (distance > 5) {
                // 거리에 따라 애니메이션 속도 조절 (가까울수록 빠르게)
                const maxDuration = 0.12; // 최대 지속시간 (더 빠르게)
                const minDuration = 0.05; // 최소 지속시간
                const dynamicDuration = Math.max(minDuration, Math.min(maxDuration, 0.05 + (distance / 10000)));
                
                // GSAP 애니메이션 적용
                gsap.to(this.rocket, {
                    left: targetX,
                    top: targetY,
                    rotation: this.fixedRotation, // 항상 고정된 방향 사용
                    duration: dynamicDuration,
                    ease: "power1.out", // 더 빠른 ease 사용
                    xPercent: -50,
                    yPercent: -50,
                    overwrite: "auto", // 이전 애니메이션 덮어쓰기
                    onComplete: () => {
                        this.isAnimating = false;
                    }
                });
                
                // 화염 효과 조절 (거리에 따라 크기 조절)
                if (this.flame) {
                    // 화염 효과 비활성화
                    gsap.to(this.flame, {
                        height: 0,
                        opacity: 0,
                        duration: 0.1,
                        ease: "none",
                        overwrite: true
                    });
                }
            } else {
                // 거리가 가까우면 애니메이션 완료 상태로 전환
                this.isAnimating = false;
            }
        } catch (error) {
            console.error('로켓 위치 업데이트 오류:', error);
            this.isAnimating = false;
        }
    }
    
    /**
     * 애니메이션 일시 정지
     */
    pauseAnimation() {
        this.isPaused = true;
        console.log('로켓 애니메이션 일시 정지됨');
    }
    
    /**
     * 애니메이션 재개
     */
    resumeAnimation() {
        this.isPaused = false;
        this.lastMouseMoveTime = Date.now(); // 마지막 마우스 이동 시간 업데이트
        console.log('로켓 애니메이션 재개됨');
    }
    
    /**
     * 오프셋 거리 설정
     */
    setOffsetDistance(distance) {
        if (typeof distance === 'number' && distance >= 0) {
            this.offsetDistance = distance;
            console.log(`로켓 오프셋 거리가 ${distance}px로 설정됨`);
        }
    }
    
    /**
     * 회전 방향 설정
     */
    setFixedRotation(angle) {
        if (typeof angle === 'number') {
            this.fixedRotation = angle;
            console.log(`로켓 고정 회전각이 ${angle}도로 설정됨`);
        }
    }
    
    /**
     * 클린업 함수
     */
    cleanup() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this._mouseMoveHandler) {
            document.removeEventListener('mousemove', this._mouseMoveHandler);
            document.removeEventListener('touchmove', this._touchMoveHandler);
            
            if (this.rocket) {
                this.rocket.removeEventListener('mousemove', this._mouseMoveHandler);
                this.rocket.removeEventListener('touchmove', this._touchMoveHandler);
            }
        }
        
        this.isActive = false;
        this.isPaused = true;
    }
}

// 로켓 인스턴스 생성 함수
function createRocketInstance() {
    try {
        window.rocketInstance = new ImprovedRocketAnimation();
        window.COSMIC_PORTFOLIO = window.COSMIC_PORTFOLIO || {};
        window.COSMIC_PORTFOLIO.rocket = window.rocketInstance;
        console.log('로켓 인스턴스가 성공적으로 생성되었습니다.');
        return window.rocketInstance;
    } catch (error) {
        console.error('로켓 인스턴스 생성 오류:', error);
        return null;
    }
}

// 즉시 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    // 즉시 로켓 애니메이션 인스턴스 생성
    createRocketInstance();
});

// 페이지 로드 완료 시 추가 확인
window.addEventListener('load', () => {
    if (!window.rocketInstance) {
        console.log('로드 완료 후 로켓 인스턴스 다시 확인 - 없으면 생성');
        createRocketInstance();
    } else {
        // 이미 존재하는 인스턴스 강제 활성화
        window.rocketInstance.isActive = true;
        window.rocketInstance.isPaused = false;
        window.rocketInstance.setRocketStyles();
        window.rocketInstance.setupMouseTracking();
        window.rocketInstance.startAnimationLoop();
        console.log('로켓 인스턴스 강제 활성화 완료');
    }
});

// 전역 함수로 노출 (필요시 다른 스크립트에서 호출할 수 있도록)
window.activateRocket = function() {
    if (!window.rocketInstance) {
        window.rocketInstance = createRocketInstance();
    }
    
    if (window.rocketInstance) {
        window.rocketInstance.isActive = true;
        window.rocketInstance.isPaused = false;
        window.rocketInstance.setRocketStyles();
        window.rocketInstance.setupMouseTracking();
        window.rocketInstance.startAnimationLoop();
        console.log('로켓 활성화 함수 호출됨');
    }
};
