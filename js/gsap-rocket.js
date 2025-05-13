/**
 * Cosmic Portfolio - GSAP 로켓 애니메이션
 * 스크롤과 마우스 움직임에 반응하는 향상된 로켓 애니메이션
 */

// GSAP 로켓 애니메이션 클래스
class GSAPRocketAnimation {
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
        this.mouseX = 0;
        this.mouseY = 0;
        this.trailElements = [];
        this.maxTrailElements = 15;
        this.trailInterval = null;
        
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
        
        // 초기 위치 설정
        gsap.set(this.rocket, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: 1
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
        
        // 스크롤에 따른 로켓 애니메이션 설정
        this.setupScrollAnimation();
        
        // 마우스 움직임에 따른 로켓 회전 설정
        this.setupMouseRotation();
        
        // 화면 크기 변경 이벤트 처리
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 로켓 클릭 시 부스트 효과
        this.rocket.addEventListener('click', this.boostEffect.bind(this));
        
        // 네비게이션 링크 클릭 시 부스트 효과
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.boostEffect.bind(this));
        });
    }
    
    /**
     * 스크롤 애니메이션 설정
     */
    setupScrollAnimation() {
        // 각 섹션별 스크롤 트리거 설정
        Object.entries(this.sections).forEach(([sectionName, sectionElement], index) => {
            if (!sectionElement) return;
            
            ScrollTrigger.create({
                trigger: sectionElement,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => this.animateToSection(sectionName, 'enter'),
                onEnterBack: () => this.animateToSection(sectionName, 'enterBack'),
                // markers: false // 디버깅용, 필요시 활성화
            });
        });
        
        // 전체 페이지 스크롤 진행도에 따른 로켓 움직임
        gsap.to(this.rocket, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // 부드러운 스크럽 효과
                onUpdate: (self) => {
                    // 스크롤 진행도에 따른 부가 효과
                    this.updateRocketPathPosition(self.progress);
                }
            }
        });
    }
    
    /**
     * 마우스 움직임에 따른 로켓 회전 설정
     */
    setupMouseRotation() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.rocket) return;
            
            const rocketRect = this.rocket.getBoundingClientRect();
            const rocketCenterX = rocketRect.left + rocketRect.width / 2;
            const rocketCenterY = rocketRect.top + rocketRect.height / 2;
            
            // 마우스와 로켓 사이의 각도 계산
            const angle = Math.atan2(this.mouseY - rocketCenterY, this.mouseX - rocketCenterX);
            
            // 현재 섹션의 기본 회전 값
            const baseRotation = this.getSectionRotation(this.currentSection);
            const tiltAmount = 10; // 최대 기울기 각도
            
            // 마우스 위치에 따른 회전 각도 조정
            gsap.to(this.rocket, {
                rotation: baseRotation + Math.sin(angle) * tiltAmount,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    }
    
    /**
     * 화면 크기 변경 이벤트 처리
     */
    handleResize() {
        // 현재 섹션에 맞게 로켓 위치 조정
        this.animateToSection(this.currentSection, 'resize');
    }
    
    /**
     * 섹션별 로켓 애니메이션
     * @param {string} sectionName - 섹션 이름
     * @param {string} direction - 전환 방향
     */
    animateToSection(sectionName, direction) {
        if (!this.rocket) return;
        
        // 섹션 변경 감지
        if (this.currentSection !== sectionName) {
            const prevSection = this.currentSection;
            this.currentSection = sectionName;
            
            // 섹션 전환 시 부스트 효과
            if (direction === 'enter' || direction === 'enterBack') {
                this.boostEffect();
                
                // 궤적 강화
                this.createEnhancedTrail();
            }
        }
        
        // 각 섹션별 애니메이션 설정
        const sectionConfig = this.getSectionConfig(sectionName);
        
        // 부드러운 위치 트랜지션
        gsap.to(this.rocket, {
            left: sectionConfig.x + '%',
            top: sectionConfig.y + '%',
            rotation: sectionConfig.rotation,
            scale: sectionConfig.scale,
            duration: direction === 'resize' ? 0.1 : 1,
            ease: 'power2.inOut'
        });
        
        // CSS 클래스 업데이트
        this.rocket.className = '';
        this.rocket.classList.add(`rocket-${sectionName}`);
        
        // 착륙 애니메이션 (컨택트 섹션에 도달했을 때)
        if (sectionName === 'contact') {
            this.startLandingAnimation();
        } else {
            this.stopLandingAnimation();
        }
    }
    
    /**
     * 섹션별 설정 가져오기
     * @param {string} sectionName - 섹션 이름
     * @returns {Object} - 섹션 설정
     */
    getSectionConfig(sectionName) {
        const configs = {
            home: {
                x: 50,              // 화면 중앙
                y: 50,              // 화면 중앙
                rotation: 0,        // 수직
                scale: 1            // 원본 크기
            },
            about: {
                x: 30,              // 화면 왼쪽으로
                y: 50,
                rotation: -15,      // 약간 기울어짐
                scale: 0.9          // 약간 작아짐
            },
            experience: {
                x: 60,              // 화면 오른쪽으로
                y: 50,
                rotation: -30,      // 더 기울어짐
                scale: 0.8
            },
            skills: {
                x: 40,
                y: 50,
                rotation: -45,      // 45도 기울어짐
                scale: 0.7
            },
            portfolio: {
                x: 70,
                y: 50,
                rotation: -60,      // 더 많이 기울어짐
                scale: 0.6
            },
            contact: {
                x: 50,
                y: 60,              // 화면 하단으로
                rotation: -90,      // 수평으로 눕힘
                scale: 0.5          // 가장 작게
            }
        };
        
        return configs[sectionName] || configs.home;
    }
    
    /**
     * 스크롤 진행도에 따른 로켓 경로 위치 업데이트
     * @param {number} progress - 스크롤 진행도 (0-1)
     */
    updateRocketPathPosition(progress) {
        if (!this.rocket) return;
        
        // 사인 곡선을 따라 좌우 이동 (부드러운 파동 효과)
        const waveX = Math.sin(progress * Math.PI * 2) * 10;
        
        // 현재 위치에 파동 효과 추가
        const currentX = parseFloat(this.rocket.style.left) || 50;
        gsap.to(this.rocket, {
            x: waveX,
            duration: 0.5,
            ease: 'sine.out',
            overwrite: 'auto'
        });
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
     * 부스트 효과
     */
    boostEffect() {
        if (!this.flame || !this.rocketImg) return;
        
        // 화염 강화 애니메이션
        gsap.to(this.flame, {
            height: '60px',
            opacity: 1,
            duration: 0.2,
            repeat: 3,
            yoyo: true,
            ease: 'power1.inOut'
        });
        
        // 로켓 펄스 애니메이션
        gsap.to(this.rocketImg, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
        
        // 강화된 궤적 생성
        this.createEnhancedTrail();
    }
    
    /**
     * 궤적 생성 시작
     */
    startTrailCreation() {
        // 이전 인터벌 제거
        if (this.trailInterval) {
            clearInterval(this.trailInterval);
        }
        
        // 새 인터벌 설정 (150ms마다 궤적 생성)
        this.trailInterval = setInterval(() => {
            this.createTrail();
        }, 150);
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
        
        // 새 궤적 생성
        const trail = document.createElement('div');
        trail.className = 'rocket-trail';
        
        // 로켓 위치에 궤적 배치
        const rocketRect = this.rocket.getBoundingClientRect();
        const trailSize = Math.random() * 5 + 5; // 5-10px 크기
        
        gsap.set(trail, {
            width: trailSize,
            height: trailSize,
            left: rocketRect.left + rocketRect.width / 2,
            top: rocketRect.bottom - 15,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%'
        });
        
        // 문서에 궤적 추가
        document.body.appendChild(trail);
        this.trailElements.push(trail);
        
        // 궤적 페이드 아웃 애니메이션
        gsap.to(trail, {
            width: trailSize * 1.5,
            height: trailSize * 1.5,
            opacity: 0,
            duration: 1.5,
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
     * 강화된 궤적 생성 (부스트 효과 때 사용)
     */
    createEnhancedTrail() {
        if (!this.rocket) return;
        
        // 다수의 궤적을 빠르게 생성
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                // 새 궤적 생성
                const trail = document.createElement('div');
                trail.className = 'rocket-trail enhanced';
                
                // 로켓 위치에 궤적 배치
                const rocketRect = this.rocket.getBoundingClientRect();
                const trailSize = Math.random() * 8 + 8; // 더 큰 크기 (8-16px)
                
                // 약간의 무작위성 추가
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = Math.random() * 10;
                
                gsap.set(trail, {
                    width: trailSize,
                    height: trailSize,
                    left: rocketRect.left + rocketRect.width / 2 + offsetX,
                    top: rocketRect.bottom - 15 + offsetY,
                    backgroundColor: 'rgba(255, 168, 0, 0.8)',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255, 100, 0, 0.8)'
                });
                
                // 문서에 궤적 추가
                document.body.appendChild(trail);
                
                // 궤적 페이드 아웃 애니메이션
                gsap.to(trail, {
                    width: trailSize * 2,
                    height: trailSize * 2,
                    opacity: 0,
                    y: '+=' + (Math.random() * 30 + 20),
                    x: offsetX * 3,
                    duration: 1,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (trail.parentNode) {
                            trail.parentNode.removeChild(trail);
                        }
                    }
                });
            }, i * 50); // 50ms 간격으로 생성
        }
    }
    
    /**
     * 착륙 애니메이션 시작
     */
    startLandingAnimation() {
        if (!this.rocket) return;
        
        // 기존 애니메이션 중지
        gsap.killTweensOf(this.rocket, "rotation");
        
        // 착륙 애니메이션 (약간 흔들리는 효과)
        this.landingAnimation = gsap.to(this.rocket, {
            rotation: -90 + 5, // -90도 기준으로 ±5도 흔들림
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
    
    /**
     * 착륙 애니메이션 중지
     */
    stopLandingAnimation() {
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
        window.gsapRocketAnimation = new GSAPRocketAnimation();
    }, 2000);
});
