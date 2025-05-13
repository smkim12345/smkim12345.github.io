/**
 * Cosmic Portfolio - 로켓 착륙 애니메이션
 * 마지막 섹션에서 로켓이 행성 표면에 착륙하는 효과
 */

// 로켓 착륙 클래스
class RocketLanding {
    constructor() {
        // 요소 참조
        this.rocket = document.getElementById('rocket-element');
        this.landingSpot = document.getElementById('rocket-landing-spot');
        this.landingMarker = document.querySelector('.landing-marker');
        this.contactSection = document.getElementById('contact');
        this.planetSurface = document.getElementById('planet-surface');
        
        // 상태
        this.isLanded = false;
        this.isAnimating = false;
        this.lastScrollPosition = 0;
        this.originalRocketPosition = null;
        
        // 착륙 위치
        this.landingX = 0;
        this.landingY = 0;
        
        // 로컬 스토리지에서 착륙 상태 복원
        this.restoreLandingState();
        
        // 초기화
        if (this.rocket && this.landingSpot && this.planetSurface) {
            console.log("로켓 착륙 시스템 초기화 성공");
            this.init();
        } else {
            console.error('로켓 착륙 시스템 초기화 실패: 필요한 요소를 찾을 수 없습니다.');
            console.log("로켓:", this.rocket);
            console.log("착륙지점:", this.landingSpot);
            console.log("행성표면:", this.planetSurface);
        }
    }
    
    /**
     * 초기화
     */
    init() {
        // 행성 표면 초기화
        this.initPlanetSurface();
        
        // 기기 감지 (모바일 최적화용)
        this.isMobile = window.innerWidth <= 768;
        
        // 스크롤 이벤트 리스너 설정
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 화면 크기 변경 감지
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 마우스 추적 활성화 여부 확인
        this.mouseFollowEnabled = !this.isLanded; // 착륙 상태가 아닐 때만 마우스 추적 활성화
        
        // 체크 간격으로 마우스 추적 가능 여부 업데이트 (다른 스크립트와의 충돌 방지)
        setInterval(() => {
            if (window.improvedRocketAnimation) {
                window.improvedRocketAnimation.mouseFollowEnabled = this.mouseFollowEnabled && !this.isLanded;
            }
        }, 500);
        
        console.log('로켓 착륙 모듈 초기화됨 - 착륙 상태:', this.isLanded, '모바일:', this.isMobile);
    }
    
    /**
     * 화면 크기 변경 감지 및 처리
     */
    handleResize() {
        // 모바일 상태 업데이트
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // 기기 유형 변경 시 UI 조정
        if (wasMobile !== this.isMobile) {
            console.log(`기기 유형 변경: ${this.isMobile ? '모바일' : '데스크톱'} 모드로 착륙 시스템 최적화`);
            
            // 이미 착륙한 상태라면 위치 재조정
            if (this.isLanded && this.rocket) {
                this.adjustLandedRocketPosition();
            }
        }
    }
    
    /**
     * 착륙한 로켓 위치 조정 (기기 변경 시)
     */
    adjustLandedRocketPosition() {
        if (!this.rocket || !this.isLanded) return;
        
        // 우주복 캐릭터 위치 기준으로 재계산
        const astronautChar = document.getElementById('kakao-chat-link');
        
        if (astronautChar) {
            const astronautRect = astronautChar.getBoundingClientRect();
            
            // 모바일/데스크톱에 따른 위치 조정
            let xOffset = this.isMobile ? -200 : -300;
            let yOffset = this.isMobile ? -200 : -250;
            
            // 절대 위치(px) 계산
            this.landingX = astronautRect.right + xOffset + window.scrollX;
            this.landingY = astronautRect.bottom + yOffset + window.scrollY;
            
            // 위치 업데이트
            this.rocket.style.left = this.landingX + 'px';
            this.rocket.style.top = this.landingY + 'px';
            
            // 로컬 스토리지에 상태 저장
            this.saveLandingState();
        }
    }
    
    /**
     * 스크롤 이벤트 핸들러
     */
    handleScroll() {
        // 현재 스크롤 위치
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // 스크롤 방향 확인
        const isScrollingDown = scrollPosition > this.lastScrollPosition;
        this.lastScrollPosition = scrollPosition;
        
        // 페이지 하단에 도달했는지 확인 (마지막 섹션)
        const isNearBottom = (scrollPosition + windowHeight) >= (docHeight - 100);
        
        // 컨택트 섹션 위치
        const contactRect = this.contactSection.getBoundingClientRect();
        
        // 컨택트 섹션이 화면에 보이는지 확인
        const isContactVisible = contactRect.top < windowHeight && contactRect.bottom > 0;
        
        // 로켓이 착륙할 조건: 마지막 섹션이 보이고, 아직 착륙하지 않았을 때
        if (isContactVisible && isNearBottom && !this.isLanded && !this.isAnimating) {
            this.landRocket();
        }
        
        // 로켓이 이륙할 조건: 이미 착륙했지만 위로 스크롤하여 마지막 섹션을 벗어날 때
        if (this.isLanded && !isScrollingDown && !isContactVisible && !this.isAnimating) {
            this.launchRocket();
        }
    }
    
    /**
     * 로컬 스토리지에 상태 저장
     */
    saveLandingState() {
        localStorage.setItem('rocketLanded', 'true');
        localStorage.setItem('landingX', this.landingX);
        localStorage.setItem('landingY', this.landingY);
        localStorage.setItem('landingPositionType', 'absolute');
    }
    
    /**
     * 로컬 스토리지에서 상태 복원
     */
    restoreLandingState() {
        const isLanded = localStorage.getItem('rocketLanded') === 'true';
        
        if (isLanded) {
            this.isLanded = true;
            this.landingX = parseFloat(localStorage.getItem('landingX') || 100);
            this.landingY = parseFloat(localStorage.getItem('landingY') || 100);
            const positionType = localStorage.getItem('landingPositionType') || 'percent';
            
            // 상태 복원 - DOM이 모두 로드된 후 실행
            setTimeout(() => {
                // 원래 로켓 위치 및 스타일 복원
                if (this.rocket) {
                    this.rocket.style.opacity = 1;
                    
                    // 위치 타입에 따라 적용 방식 분리
                    if (positionType === 'absolute') {
                        // 절대 위치로 설정
                        this.rocket.style.position = 'absolute';
                        this.rocket.style.left = this.landingX + 'px';
                        this.rocket.style.top = this.landingY + 'px';
                    } else {
                        // 기존 방식 유지(이전 버전과의 호환성)
                        this.rocket.style.left = this.landingX + '%';
                        this.rocket.style.top = this.landingY + '%';
                    }
                    
                    // 로켓 스케일 및 회전 유지
                    gsap.set(this.rocket, {
                        scale: 3,
                        rotation: 0
                    });
                    
                    // 화염 효과 조절
                    const flame = this.rocket.querySelector('.rocket-flame');
                    if (flame) {
                        gsap.set(flame, {
                            height: '20px',
                            opacity: 0.4
                        });
                        // 착륙 상태에서는 화염을 숨김
                        flame.style.display = 'none';
                    }
                }
                
                // 컨택트 섹션에 착륙 클래스 추가
                if (this.contactSection) {
                    this.contactSection.classList.add('rocket-has-landed');
                }
            }, 500);
        }
    }
    
    /**
     * 로켓 착륙 애니메이션 - 모바일 최적화 버전
     */
    landRocket() {
        if (!this.rocket || this.isAnimating) return;
        
        // 애니메이션 상태 설정
        this.isAnimating = true;
        
        // 마우스/터치 추적 비활성화
        this.mouseFollowEnabled = false;
        if (window.improvedRocketAnimation) {
            this.originalRocketPosition = {
                left: parseFloat(this.rocket.style.left) || 50,
                top: parseFloat(this.rocket.style.top) || 50
            };
        }
        
        // 착륙 지점 위치 계산 - 우주복 캐릭터 위치 기준으로 계산
        const astronautChar = document.getElementById('kakao-chat-link');
        let landingX, landingY;
        
        if (astronautChar) {
            const astronautRect = astronautChar.getBoundingClientRect();
            
            // 모바일/데스크톱에 따른 위치 조정
            let xOffset = this.isMobile ? -200 : -300;
            let yOffset = this.isMobile ? -100 : -150;
            
            // 절대 위치(px) 계산
            landingX = astronautRect.right + xOffset + window.scrollX;
            landingY = astronautRect.bottom + yOffset + window.scrollY;
        } else {
            // 우주복 캐릭터를 찾을 수 없는 경우 기본 착륙 지점 사용
            const landingRect = this.landingSpot.getBoundingClientRect();
            
            // 모바일/데스크톱에 따른 위치 조정
            let xOffset = this.isMobile ? 150 : 200;
            let yOffset = this.isMobile ? 100 : 120;
            
            landingX = landingRect.left + landingRect.width / 2 + xOffset + window.scrollX;
            landingY = landingRect.top + landingRect.height / 2 + yOffset + window.scrollY;
        }
        
        // 착륙 위치 저장 (절대 위치)
        this.landingX = landingX;
        this.landingY = landingY;
        
        // 착륙 마커 활성화
        this.landingMarker.classList.add('active');
        
        // 로켓 최종 크기 설정
        const finalScale = this.isMobile ? 2.5 : 3; // 모바일에서 조금 더 작게
        
        // 간소화된 착륙 애니메이션: 마우스 커서의 로켓 페이드 아웃
        gsap.to(this.rocket, {
            opacity: 0, // 마우스 커서의 로켓 사라짐
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                // 행성 표면 충돌 효과
                this.createLandingImpact();
                
                // 마우스 커서의 로켓이 사라진 후 푸터의 로켓으로 전환
                this.rocket.style.position = 'absolute';
                this.rocket.style.left = this.landingX + 'px';
                this.rocket.style.top = this.landingY + 'px';
                
                // 컨택트 섹션에 착륙 클래스 추가
                if (this.contactSection) {
                    this.contactSection.classList.add('rocket-has-landed');
                }
                
                // 상태 업데이트
                this.isLanded = true;
                this.isAnimating = false;
                
                // 로컬 스토리지에 상태 저장
                this.saveLandingState();
                
                // 로켓 화염 줄이기
                const flame = this.rocket.querySelector('.rocket-flame');
                if (flame) {
                    flame.style.display = 'none'; // 화염 바로 숨김
                }
                
                // 푸터의 로켓 페이드 인
                gsap.fromTo(this.rocket, 
                    { opacity: 0, scale: finalScale }, 
                    { 
                        opacity: 1, 
                        duration: 0.8, 
                        ease: 'power2.in',
                        onComplete: () => {
                            console.log('로켓 착륙 완료 - 절대 위치:', this.landingX, this.landingY, '모바일:', this.isMobile);
                        }
                    }
                );
            }
        });
    }
    
    /**
     * 로켓 이륙 애니메이션 - 모바일 최적화 버전
     */
    launchRocket() {
        if (!this.rocket || this.isAnimating || !this.isLanded) return;
        
        // 애니메이션 상태 설정
        this.isAnimating = true;
        
        // 로컬 스토리지에서 착륙 상태 제거
        localStorage.removeItem('rocketLanded');
        localStorage.removeItem('landingX');
        localStorage.removeItem('landingY');
        localStorage.removeItem('landingPositionType');
        
        // 착륙 클래스 제거
        if (this.contactSection) {
            this.contactSection.classList.remove('rocket-has-landed');
        }
        
        // 간소화된 이륙 애니메이션: 푸터의 로켓 페이드 아웃
        gsap.to(this.rocket, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                // 이륙 효과
                this.createLaunchEffect();
                
                // 고정 위치에서 fixed 포지션으로 되돌림
                this.rocket.style.position = 'fixed';
                
                // 원래 위치로 설정 (중앙 또는 저장된 위치)
                if (this.originalRocketPosition) {
                    this.rocket.style.left = this.originalRocketPosition.left + '%';
                    this.rocket.style.top = this.originalRocketPosition.top + '%';
                } else {
                    this.rocket.style.left = '50%';
                    this.rocket.style.top = '50%';
                }
                
                // 로켓 크기 원래대로
                gsap.set(this.rocket, {
                    scale: this.isMobile ? 0.9 : 1,
                    rotation: 0
                });
                
                // 화염 효과 복원
                const flame = this.rocket.querySelector('.rocket-flame');
                if (flame) {
                    flame.style.display = 'block';
                    gsap.set(flame, {
                        height: this.isMobile ? '45px' : '60px',
                        opacity: 1
                    });
                }
                
                // 착륙 마커 비활성화
                if (this.landingMarker) {
                    this.landingMarker.classList.remove('active');
                }
                
                // 마우스 커서의 로켓 페이드 인
                gsap.to(this.rocket, {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.in',
                    onComplete: () => {
                        // 이륙 완료
                        this.isLanded = false;
                        this.isAnimating = false;
                        
                        // 마우스 추적 다시 활성화
                        this.mouseFollowEnabled = true;
                    }
                });
            }
        });
    }
    
    /**
     * 착륙 지점 마커 활성화
     */
    activateLandingMarker() {
        if (this.landingMarker) {
            // GSAP로 부드러운 효과 적용
            gsap.to(this.landingMarker, {
                opacity: 0.4,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    /**
     * 행성 표면 효과 초기화
     */
    initPlanetSurface() {
        // 행성 표면에 GSAP 애니메이션 적용
        const craters = document.querySelectorAll('.crater');
        
        // 크레이터 애니메이션
        craters.forEach(crater => {
            gsap.to(crater, {
                backgroundColor: 'rgba(10, 28, 52, 0.7)',
                boxShadow: 'inset 0 3px 10px rgba(0, 0, 0, 0.7)',
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 3
            });
        });
        
        // 행성 글로우 효과
        const planetGlow = document.querySelector('.planet-glow');
        if (planetGlow) {
            gsap.to(planetGlow, {
                opacity: 0.7,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    /**
     * 착륙 충격 효과 - 모바일 최적화 버전
     */
    createLandingImpact() {
        // 충격파 효과 요소 생성
        const impactWave = document.createElement('div');
        impactWave.className = 'impact-wave';
        this.landingSpot.appendChild(impactWave);
        
        // 모바일 환경에 따른 크기 및 효과 조정
        const waveSize = this.isMobile ? '80px' : '100px'; // 모바일에서 작게
        const waveBorder = this.isMobile ? '1px' : '2px';  // 모바일에서 얇게
        
        // 충격파 스타일 설정
        gsap.set(impactWave, {
            position: 'absolute',
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: waveBorder + ' solid rgba(76, 149, 219, 0.8)',
            opacity: 1,
            zIndex: 6
        });
        
        // 충격파 애니메이션
        gsap.to(impactWave, {
            width: waveSize,
            height: waveSize,
            opacity: 0,
            duration: this.isMobile ? 0.8 : 1, // 모바일에서 짧게
            ease: 'power2.out',
            onComplete: () => {
                // 애니메이션 완료 후 제거
                if (impactWave.parentNode) {
                    impactWave.parentNode.removeChild(impactWave);
                }
            }
        });
        
        // 먼지 효과 생성 - 모바일에서는 개수 감소
        const particleCount = this.isMobile ? 6 : 10;
        for (let i = 0; i < particleCount; i++) {
            this.createDustParticle();
        }
    }
    
    /**
     * 먼지 입자 생성 - 모바일 최적화 버전
     */
    createDustParticle() {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';
        this.landingSpot.appendChild(dust);
        
        // 모바일 환경에 따른 크기 및 효과 조정
        const baseSize = this.isMobile ? 1.5 : 2;  // 모바일에서 작게
        const maxSize = this.isMobile ? 4 : 6;     // 모바일에서 작게
        
        // 랜덤 위치와 크기
        const size = Math.random() * baseSize + maxSize;
        const xOffset = (Math.random() - 0.5) * (this.isMobile ? 40 : 60); // 모바일에서 작게
        
        // 먼지 기본 스타일
        gsap.set(dust, {
            position: 'absolute',
            left: 'calc(50% + ' + xOffset + 'px)',
            top: '50%',
            width: size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            backgroundColor: 'rgba(100, 140, 180, ' + (Math.random() * 0.5 + 0.2) + ')',
            opacity: 1,
            zIndex: 5
        });
        
        // 모바일에서는 낮은 높이, 짧은 지속 시간
        const moveY = this.isMobile ? (Math.random() * 30 + 8) : (Math.random() * 40 + 10);
        const moveX = (Math.random() - 0.5) * (this.isMobile ? 50 : 80);
        const animDuration = this.isMobile ? (Math.random() * 0.8 + 0.4) : (Math.random() * 1 + 0.5);
        
        // 먼지 애니메이션
        gsap.to(dust, {
            y: '-=' + moveY,
            x: moveX,
            opacity: 0,
            duration: animDuration,
            ease: 'power2.out',
            onComplete: () => {
                // 애니메이션 완료 후 제거
                if (dust.parentNode) {
                    dust.parentNode.removeChild(dust);
                }
            }
        });
    }
    
    /**
     * 이륙 효과 - 모바일 최적화 버전
     */
    createLaunchEffect() {
        // 먼지 입자 - 모바일에서는 개수 감소
        const particleCount = this.isMobile ? 12 : 20;
        for (let i = 0; i < particleCount; i++) {
            this.createDustParticle();
        }
        
        // 진동 효과 - 모바일에서는 강도 감소
        gsap.to(this.planetSurface, {
            x: this.isMobile ? 2 : 3,
            duration: 0.1,
            repeat: this.isMobile ? 3 : 5,
            yoyo: true,
            ease: 'none'
        });
    }
    
    /**
     * 마우스 추적 상태 확인
     * @returns {boolean} 마우스 추적 활성화 여부
     */
    isMouseFollowEnabled() {
        return this.mouseFollowEnabled;
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 로딩 화면이 제거된 후 로켓 착륙 시스템 초기화
    setTimeout(() => {
        // 새 객체 생성과 window에 할당
        window.rocketLanding = new RocketLanding();
    }, 3000);
});
