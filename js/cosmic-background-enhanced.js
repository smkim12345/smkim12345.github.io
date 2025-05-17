/**
 * 우주 배경 효과 관리자 - 확장 버전
 * 반짝이는 별들 + 입자 효과 (성운 효과 제거)
 */

class EnhancedCosmicBackground {
    constructor() {
        this.container = null;
        this.starsContainer = null;
        this.nebulae = []; // 성운 배열은 유지하되 내용은 비움
        this.stars = [];
        this.particles = [];
        this.masterTimeline = null;
        this.isActive = true;
        this.isMobile = window.innerWidth <= 768;
        
        // 설정값
        this.config = {
            starCount: this.isMobile ? 40 : 60,
            // nebulaCount: 3, // 성운 개수 설정 제거
            starSizes: ['small', 'medium', 'large', 'bright'],
            twinkleSpeed: { min: 1, max: 4 },
            nebulaRotationSpeed: { min: 60, max: 120 }, // 값은 유지 (오류 방지)
            // 추가 효과 설정
            floatingParticles: this.isMobile ? 8 : 15
        };
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * 우주 배경 설정
     */
    setup() {
        this.createContainer();
        // this.createNebulae(); // 성운 생성 비활성화
        this.createStars();
        this.createFloatingParticles();
        this.setupAnimations();
        this.setupVisibilityController();
        
        console.log('확장된 우주 배경 효과 초기화 완료 (성운 효과 제외)');
    }
    
    /**
     * 배경 컨테이너 생성
     */
    createContainer() {
        // 기존 컨테이너가 있다면 제거
        const existing = document.querySelector('.cosmic-background, .enhanced-cosmic-background');
        if (existing) {
            existing.remove();
        }
        
        // 새 컨테이너 생성
        this.container = document.createElement('div');
        this.container.className = 'enhanced-cosmic-background cosmic-background';
        
        // body에 첫 번째 자식으로 추가 (다른 요소들보다 뒤에)
        document.body.insertBefore(this.container, document.body.firstChild);
    }
    
    /**
     * 성운 효과 생성 (비활성화)
     */
    /*
    createNebulae() {
        for (let i = 1; i <= this.config.nebulaCount; i++) {
            const nebula = document.createElement('div');
            nebula.className = `nebula nebula-${i}`;
            this.container.appendChild(nebula);
            this.nebulae.push(nebula);
        }
    }
    */
    
    /**
     * 별들 생성
     */
    createStars() {
        this.starsContainer = document.createElement('div');
        this.starsContainer.className = 'stars-container';
        this.container.appendChild(this.starsContainer);
        
        for (let i = 0; i < this.config.starCount; i++) {
            this.createStar();
        }
    }
    
    /**
     * 개별 별 생성
     */
    createStar() {
        const star = document.createElement('div');
        const sizeClass = this.getRandomStarSize();
        
        star.className = `star star-${sizeClass}`;
        
        // 랜덤 위치 설정
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // 초기 투명도 랜덤 설정
        const initialOpacity = 0.3 + Math.random() * 0.7;
        star.style.opacity = initialOpacity;
        
        this.starsContainer.appendChild(star);
        this.stars.push(star);
    }
    
    /**
     * 떠다니는 입자 생성
     */
    createFloatingParticles() {
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'floating-particles-container';
        this.container.appendChild(this.particlesContainer);
        
        this.particles = [];
        
        for (let i = 0; i < this.config.floatingParticles; i++) {
            this.createParticle();
        }
    }
    
    /**
     * 개별 입자 생성
     */
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // 랜덤 크기와 위치
        const size = 1 + Math.random() * 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.backgroundColor = '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.opacity = '0.3';
        particle.style.boxShadow = '0 0 4px rgba(255, 255, 255, 0.5)';
        particle.style.willChange = 'transform, opacity';
        
        this.particlesContainer.appendChild(particle);
        this.particles.push(particle);
    }
    
    /**
     * 랜덤 별 크기 결정
     */
    getRandomStarSize() {
        const weights = [40, 30, 20, 10]; // small, medium, large, bright 비율
        const random = Math.random() * 100;
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return this.config.starSizes[i];
            }
        }
        
        return this.config.starSizes[0];
    }
    
    /**
     * GSAP 애니메이션 설정
     */
    setupAnimations() {
        this.masterTimeline = gsap.timeline();
        
        // 성운 회전 애니메이션 비활성화
        // this.animateNebulae();
        
        // 별 반짝임 애니메이션
        this.animateStars();
        
        // 입자 애니메이션
        this.animateParticles();
    }
    
    /**
     * 별 반짝임 애니메이션
     */
    animateStars() {
        this.stars.forEach((star, index) => {
            // 각 별마다 다른 반짝임 패턴
            const minOpacity = 0.2 + Math.random() * 0.3;
            const maxOpacity = 0.8 + Math.random() * 0.2;
            const duration = this.config.twinkleSpeed.min + 
                           Math.random() * (this.config.twinkleSpeed.max - this.config.twinkleSpeed.min);
            
            gsap.to(star, {
                opacity: minOpacity,
                duration: duration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 5 // 초기 딜레이
            });
            
            // 일부 별에 추가 크기 변화 효과
            if (Math.random() > 0.8) {
                gsap.to(star, {
                    scale: 1.5,
                    duration: duration * 1.5,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: Math.random() * 3
                });
            }
        });
    }
    
    /**
     * 입자 애니메이션 (위아래로 떠다니기)
     */
    animateParticles() {
        this.particles.forEach((particle, index) => {
            // Y축 움직임
            const yMovement = 30 + Math.random() * 50;
            const duration = 8 + Math.random() * 5; // 8-13초
            
            gsap.to(particle, {
                y: `-=${yMovement}`,
                duration: duration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 5
            });
            
            // X축 미세한 움직임
            if (Math.random() > 0.5) {
                const xMovement = 10 + Math.random() * 15;
                gsap.to(particle, {
                    x: `+=${xMovement}`,
                    duration: duration * 1.5,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: Math.random() * 7
                });
            }
            
            // 투명도 변화
            gsap.to(particle, {
                opacity: 0.1 + Math.random() * 0.2,
                duration: duration * 0.8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 3
            });
        });
    }
    
    /**
     * 가시성 컨트롤러 설정 (성능 최적화)
     */
    setupVisibilityController() {
        // 페이지 가시성 변경 감지
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // 리사이즈 이벤트 처리
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 500));
        
        // 저전력 모드 감지
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.pause();
        }
    }
    
    /**
     * 애니메이션 일시정지
     */
    pause() {
        if (this.masterTimeline) {
            this.masterTimeline.pause();
        }
        gsap.globalTimeline.pause();
        this.isActive = false;
        console.log('확장된 우주 배경 애니메이션 일시정지');
    }
    
    /**
     * 애니메이션 재개
     */
    resume() {
        if (this.masterTimeline) {
            this.masterTimeline.resume();
        }
        gsap.globalTimeline.resume();
        this.isActive = true;
        console.log('확장된 우주 배경 애니메이션 재개');
    }
    
    /**
     * 리사이즈 처리
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // 모바일 ↔ 데스크톱 전환 시 별/입자 개수 조정
        if (wasMobile !== this.isMobile) {
            this.updateStarCount();
            this.updateParticleCount();
        }
    }
    
    /**
     * 별 개수 업데이트
     */
    updateStarCount() {
        const newStarCount = this.isMobile ? 40 : 60;
        const currentStarCount = this.stars.length;
        
        if (newStarCount > currentStarCount) {
            // 별 추가
            for (let i = 0; i < newStarCount - currentStarCount; i++) {
                this.createStar();
            }
        } else if (newStarCount < currentStarCount) {
            // 별 제거
            for (let i = 0; i < currentStarCount - newStarCount; i++) {
                const star = this.stars.pop();
                if (star) {
                    star.remove();
                }
            }
        }
        
        // 새로 추가된 별들 애니메이션 설정
        this.animateStars();
    }
    
    /**
     * 입자 개수 업데이트
     */
    updateParticleCount() {
        const newParticleCount = this.isMobile ? 8 : 15;
        const currentParticleCount = this.particles.length;
        
        if (newParticleCount > currentParticleCount) {
            // 입자 추가
            for (let i = 0; i < newParticleCount - currentParticleCount; i++) {
                this.createParticle();
            }
        } else if (newParticleCount < currentParticleCount) {
            // 입자 제거
            for (let i = 0; i < currentParticleCount - newParticleCount; i++) {
                const particle = this.particles.pop();
                if (particle) {
                    particle.remove();
                }
            }
        }
        
        // 새로 추가된 입자들 애니메이션 설정
        this.animateParticles();
    }
    
    /**
     * 디바운스 유틸리티
     */
    debounce(func, wait) {
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
     * 리소스 정리
     */
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        
        if (this.masterTimeline) {
            this.masterTimeline.kill();
        }
        
        this.container = null;
        this.starsContainer = null;
        this.nebulae = [];
        this.stars = [];
        this.particles = [];
        console.log('우주 배경 효과 제거 완료');
    }
    
    /**
     * 현재 상태 반환
     */
    getStatus() {
        return {
            isActive: this.isActive,
            starCount: this.stars.length,
            nebulaCount: 0, // 성운은 이제 사용하지 않음
            particleCount: this.particles.length,
            isMobile: this.isMobile
        };
    }
}

// 기존 우주 배경이 있다면 제거하고 확장 버전으로 교체
if (window.cosmicBackground) {
    window.cosmicBackground.destroy();
}

// 전역 인스턴스 생성
window.cosmicBackground = new EnhancedCosmicBackground();

// 개발자 도구용 헬퍼 함수들
window.debugCosmicBackground = {
    // 상태 확인
    status: () => window.cosmicBackground.getStatus(),
    
    // 일시정지/재개
    pause: () => window.cosmicBackground.pause(),
    resume: () => window.cosmicBackground.resume(),
    
    // 재시작
    restart: () => {
        window.cosmicBackground.destroy();
        window.cosmicBackground = new EnhancedCosmicBackground();
    },
    
    // 유성 강제 생성
    createShootingStar: () => window.cosmicBackground.createShootingStar()
};

console.log('확장된 우주 배경 효과 스크립트 로드 완료');
console.log('디버그 명령어: window.debugCosmicBackground.status(), .pause(), .resume(), .restart(), .createShootingStar()');
