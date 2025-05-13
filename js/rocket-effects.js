/**
 * Cosmic Portfolio - 로켓 추가 효과 스크립트
 * 로켓 애니메이션을 위한 추가 인터랙티브 효과
 */

// 로켓 추가 효과 클래스
class RocketEffects {
    constructor() {
        // 요소 참조
        this.rocket = document.getElementById('rocket-element');
        this.body = document.body;
        
        // 상태 및 설정
        this.currentSection = 'home';
        this.lastSection = 'home';
        this.isFirstVisit = true;
        this.constellations = [];
        this.maxConstellations = 15;
        this.isLanded = false;
        this.landingOffset = 0;
        
        // 초기화
        this.init();
    }
    
    // 초기화
    init() {
        // 환영 메시지 추가
        this.createWelcomeMessage();
        
        // 섹션 플래시 효과 추가
        this.createSectionFlash();
        
        // 별자리 효과 초기화
        this.initConstellations();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 착륙 지점 초기화
        this.initLandingZone();
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 스크롤 이벤트
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 로켓 클릭 이벤트
        if (this.rocket) {
            this.rocket.addEventListener('click', this.handleRocketClick.bind(this));
        }
        
        // 섹션 링크 클릭 시 효과
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleSectionLink.bind(this));
        });
        
        // 마우스 이동 이벤트
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // 푸터 영역 감지
        window.addEventListener('resize', this.calculateFooterPosition.bind(this));
    }
    
    // 환영 메시지 생성
    createWelcomeMessage() {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'rocket-welcome';
        welcomeMsg.innerHTML = `
            <h3>우주 탐험 시작!</h3>
            <p>로켓이 당신의 포트폴리오 여행을 안내합니다. 스크롤하여 탐험하세요!</p>
        `;
        
        document.body.appendChild(welcomeMsg);
        
        // 페이지 로드 후 환영 메시지 표시
        setTimeout(() => {
            welcomeMsg.classList.add('rocket-welcome-show');
        }, 3000);
        
        // 일정 시간 후 환영 메시지 제거
        setTimeout(() => {
            welcomeMsg.remove();
        }, 8000);
    }
    
    // 섹션 플래시 효과 생성 (비활성화됨)
    createSectionFlash() {
        // 플래시 효과를 비활성화하여 화면 번쩍임 현상 제거
        // 요소를 실제로 생성하지 않음
        this.sectionFlash = null;
    }
    
    // 별자리 효과 초기화
    initConstellations() {
        // 최초 로드 시 별자리 생성 (개수 감소)
        for (let i = 0; i < 8; i++) {
            this.createConstellation();
        }
        
        // 주기적으로 별자리 생성 및 제거 (주기 증가)
        setInterval(() => {
            if (this.constellations.length < this.maxConstellations) {
                this.createConstellation();
            }
            
            // 랜덤하게 별자리 제거
            if (Math.random() > 0.7 && this.constellations.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.constellations.length);
                const constellation = this.constellations[randomIndex];
                
                if (constellation && constellation.parentNode) {
                    constellation.remove();
                    this.constellations.splice(randomIndex, 1);
                }
            }
        }, 4000);
    }
    
    // 착륙 지점 초기화
    initLandingZone() {
        // 착륙 지점 요소 찾기
        this.landingZone = document.querySelector('.landing-zone');
        if (this.landingZone) {
            // GSAP 애니메이션 설정
            gsap.set(this.landingZone, { autoAlpha: 0 });
        }
        
        // 푸터 위치 계산
        this.calculateFooterPosition();
        
        // 행성 표면 물결 효과 생성
        this.createSurfaceWaves();
    }
    
    // 푸터 위치 계산
    calculateFooterPosition() {
        const footer = document.querySelector('footer');
        if (footer) {
            this.footerPosition = footer.offsetTop;
            this.footerHeight = footer.offsetHeight;
        }
    }
    
    // 별자리 생성
    createConstellation() {
        const star = document.createElement('div');
        star.className = 'star-constellation';
        
        // 랜덤 위치
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        // 랜덤 크기
        const size = Math.random() * 3 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // 랜덤 애니메이션 지연
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        document.body.appendChild(star);
        this.constellations.push(star);
    }
    
    // 마우스 이동 이벤트 핸들러
    handleMouseMove(e) {
        // 로켓이 착륙 상태이면 무시
        if (this.isLanded || !this.rocket) return;
        
        // 로켓 위치 업데이트는 gsap-rocket-improved.js에서 처리함
    }
    
    // 스크롤 이벤트 핸들러
    handleScroll() {
        // 현재 섹션 감지
        this.detectCurrentSection();
        
        // 푸터 도달 여부 확인
        this.checkFooterPosition();
    }
    
    // 현재 스크롤 위치가 푸터(행성)에 도달했는지 확인
    checkFooterPosition() {
        if (!this.rocket || !this.footerPosition) return;
        
        // 현재 스크롤 위치
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // 푸터 도달 시 로켓 착륙
        if (scrollPosition >= this.footerPosition && !this.isLanded) {
            this.landRocket();
        } 
        // 푸터에서 벗어났을 때 로켓 이륙
        else if (scrollPosition < this.footerPosition && this.isLanded) {
            this.launchRocket();
        }
    }
    
    // 로켓 착륙 애니메이션
    landRocket() {
        if (!this.rocket || !this.landingZone) return;
        
        // 착륙 상태로 설정
        this.isLanded = true;
        
        // 착륙 지점 활성화
        this.landingZone.parentElement.classList.add('landing-active');
        
        // 로켓 불꽃 상태 변경
        const rocketFlame = this.rocket.querySelector('.rocket-flame');
        if (rocketFlame) {
            rocketFlame.classList.add('rocket-flame-landing');
        }
        
        // GSAP 애니메이션으로 착륙
        gsap.to(this.landingZone, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.inOut"
        });
        
        // 로켓 착륙 애니메이션
        gsap.timeline()
            .to(this.rocket, {
                bottom: "60px",
                left: "50%",
                xPercent: -50,
                yPercent: 0,
                rotation: 0,
                duration: 1.5,
                ease: "power3.out"
            })
            .to(this.rocket, {
                y: '+=10',
                duration: 0.3,
                ease: "power2.in",
                yoyo: true,
                repeat: 1
            })
            .to(this.rocket, {
                y: 0,
                duration: 0.2,
                onComplete: () => {
                    // 착륙 완료 클래스 추가
                    this.rocket.classList.add('rocket-landed');
                    
                    // 착륙 먼지 효과
                    this.createLandingDust();
                    
                    // 착륙 메시지 표시
                    this.showLandingMessage();
                }
            });
        
        // 행성 표면 물결 효과 강화
        this.enhanceSurfaceWaves();
    }
    
    // 착륙 메시지 표시
    showLandingMessage() {
        // 이미 존재하면 제거
        const existingMessage = document.querySelector('.landing-complete');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 착륙 메시지 생성
        const message = document.createElement('div');
        message.className = 'landing-complete';
        message.textContent = '행성 착륙 완료! 스크롤을 위로 올려 다시 이륙하세요.';
        
        document.body.appendChild(message);
        
        // 표시 애니메이션
        setTimeout(() => {
            message.classList.add('show');
        }, 500);
        
        // 자동 제거
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 5000);
    }
    
    // 행성 표면 물결 효과 강화
    enhanceSurfaceWaves() {
        const waves = document.querySelectorAll('.surface-wave');
        
        waves.forEach(wave => {
            // 기존 애니메이션 일시 중지
            gsap.killTweensOf(wave);
            
            // 강화된 물결 효과
            gsap.timeline()
                .set(wave, {
                    opacity: 0,
                    scaleX: 0.8,
                    y: 0
                })
                .to(wave, {
                    opacity: 0.9,
                    duration: 0.3,
                    ease: "power1.in"
                })
                .to(wave, {
                    scaleX: 1.5,
                    y: -30,
                    duration: 1.5,
                    ease: "sine.out"
                }, "-=0.2")
                .to(wave, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        // 원래 물결 애니메이션 재시작
                        this.animateSurfaceWave(wave, Math.random() * 2);
                    }
                }, "-=0.8");
        });
    }
    
    // 행성 표면 물결 애니메이션
    animateSurfaceWave(wave, delay) {
        const timeline = gsap.timeline({
            repeat: -1,
            delay: delay
        });
        
        timeline
            .set(wave, {
                opacity: 0,
                scaleX: 0.8,
                y: 0
            })
            .to(wave, {
                opacity: 0.7,
                duration: 0.5,
                ease: "power1.in"
            })
            .to(wave, {
                scaleX: 1.2,
                y: -20,
                duration: 3,
                ease: "sine.inOut"
            }, "-=0.5")
            .to(wave, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            }, "-=1.5");
    }
    
    // 로켓 이륙 애니메이션
    launchRocket() {
        if (!this.rocket) return;
        
        // 착륙 상태 해제
        this.isLanded = false;
        
        // 로켓 착륙 클래스 제거
        this.rocket.classList.remove('rocket-landed');
        
        // 로켓 불꽃 상태 복원
        const rocketFlame = this.rocket.querySelector('.rocket-flame');
        if (rocketFlame) {
            rocketFlame.classList.remove('rocket-flame-landing');
        }
        
        // 착륙 지점 비활성화
        if (this.landingZone) {
            this.landingZone.parentElement.classList.remove('landing-active');
            
            gsap.to(this.landingZone, {
                autoAlpha: 0,
                duration: 0.3
            });
        }
        
        // 행성 표면 물결 효과 강화
        this.enhanceSurfaceWaves();
        
        // 이륙 먼지 효과
        this.createLandingDust();
        
        // GSAP로 이륙 애니메이션
        gsap.timeline()
            .to(this.rocket, {
                y: -30,
                duration: 0.5,
                ease: "power2.out"
            })
            .to(this.rocket, {
                y: -100,
                rotation: -15,
                duration: 0.8,
                ease: "power3.in",
                onComplete: () => {
                    // 부스트 효과로 이륙
                    this.triggerBoost();
                }
            });
    }
    
    // 현재 섹션 감지
    detectCurrentSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // 모든 섹션 확인
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        // 섹션이 변경된 경우
        if (currentSection && currentSection !== this.currentSection) {
            this.lastSection = this.currentSection;
            this.currentSection = currentSection;
            
            // 섹션 전환 플래시 효과
            this.triggerSectionFlash();
        }
    }
    
    // 섹션 전환 플래시 효과 (비활성화됨)
    triggerSectionFlash() {
        // 플래시 효과를 비활성화하여 화면 번쩍임 현상 제거
        // 아무 동작도 하지 않음
    }
    
    // 로켓 클릭 이벤트 핸들러
    handleRocketClick() {
        // 로켓 클릭 효과 제거됨
        // 아무 동작도 수행하지 않음
    }
    
    // 섹션 링크 클릭 이벤트 핸들러
    handleSectionLink(e) {
        // 상태 업데이트 제거
    }
    
    // 부스트 효과
    triggerBoost() {
        if (!this.rocket) return;
        
        // 부스트 클래스 추가
        this.rocket.classList.add('rocket-boost');
        
        // 일정 시간 후 효과 제거
        setTimeout(() => {
            if (this.rocket) {
                this.rocket.classList.remove('rocket-boost');
            }
        }, 1000);
    }
    
    // 행성 표면 물결 효과 생성
    createSurfaceWaves() {
        const planetSurface = document.querySelector('.planet-surface');
        if (!planetSurface) return;
        
        // 3개의 파도 효과 생성
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'surface-wave';
            planetSurface.appendChild(wave);
            
            // 파도 애니메이션
            this.animateSurfaceWave(wave, i * 2);
        }
    }
    
    // 착륙 먼지 효과
    createLandingDust() {
        // 먼지 파티클 생성
        for (let i = 0; i < 10; i++) {
            const dust = document.createElement('div');
            dust.className = 'landing-dust';
            dust.style.left = `${Math.random() * 100 - 50}px`;
            
            this.rocket.parentNode.appendChild(dust);
            
            // 먼지 애니메이션
            gsap.to(dust, {
                x: `${Math.random() * 100 - 50}`,
                y: `${Math.random() * 20 + 10}`,
                opacity: 0,
                scale: Math.random() * 2 + 1,
                duration: Math.random() * 1 + 0.5,
                ease: "power2.out",
                onComplete: () => {
                    if (dust.parentNode) {
                        dust.parentNode.removeChild(dust);
                    }
                }
            });
        }
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 로켓 추가 효과 초기화
    setTimeout(() => {
        new RocketEffects();
    }, 2500); // 로딩 화면 후에 초기화
});
