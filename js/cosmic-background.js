/**
 * 우주 배경 효과 관리자 - 1단계
 * 반짝이는 별들 + 성운 애니메이션
 */

class CosmicBackground {
    constructor() {
        this.container = null;
        this.starsContainer = null;
        this.nebulae = [];
        this.stars = [];
        this.masterTimeline = null;
        this.isActive = true;
        this.isMobile = window.innerWidth <= 768;
        
        // 설정값
        this.config = {
            starCount: this.isMobile ? 40 : 60,
            nebulaCount: 3,
            starSizes: ['small', 'medium', 'large', 'bright'],
            twinkleSpeed: { min: 1, max: 4 },
            nebulaRotationSpeed: { min: 60, max: 120 }
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
        this.createNebulae();
        this.createStars();
        this.setupAnimations();
        this.setupVisibilityController();
        
        console.log('우주 배경 효과 초기화 완료');
    }
    
    /**
     * 배경 컨테이너 생성
     */
    createContainer() {
        // 기존 컨테이너가 있다면 제거
        const existing = document.querySelector('.cosmic-background');
        if (existing) {
            existing.remove();
        }
        
        // 새 컨테이너 생성
        this.container = document.createElement('div');
        this.container.className = 'cosmic-background';
        
        // body에 첫 번째 자식으로 추가 (다른 요소들보다 뒤에)
        document.body.insertBefore(this.container, document.body.firstChild);
    }
    
    /**
     * 성운 효과 생성
     */
    createNebulae() {
        for (let i = 1; i <= this.config.nebulaCount; i++) {
            const nebula = document.createElement('div');
            nebula.className = `nebula nebula-${i}`;
            this.container.appendChild(nebula);
            this.nebulae.push(nebula);
        }
    }
    
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
        
        // 성운 회전 애니메이션
        this.animateNebulae();
        
        // 별 반짝임 애니메이션
        this.animateStars();
    }
    
    /**
     * 성운 애니메이션
     */
    animateNebulae() {
        this.nebulae.forEach((nebula, index) => {
            const duration = this.config.nebulaRotationSpeed.min + 
                           Math.random() * (this.config.nebulaRotationSpeed.max - this.config.nebulaRotationSpeed.min);
            
            // clockwise 또는 counter-clockwise 랜덤 결정
            const direction = Math.random() > 0.5 ? 360 : -360;
            
            gsap.to(nebula, {
                rotation: direction,
                duration: duration,
                ease: 'none',
                repeat: -1
            });
            
            // 크기 변화 애니메이션 (아주 미세하게)
            gsap.to(nebula, {
                scale: 1.1,
                duration: duration * 0.7,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 10
            });
        });
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
        console.log('우주 배경 애니메이션 일시정지');
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
        console.log('우주 배경 애니메이션 재개');
    }
    
    /**
     * 리사이즈 처리
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // 모바일 ↔ 데스크톱 전환 시 별 개수 조정
        if (wasMobile !== this.isMobile) {
            this.updateStarCount();
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
        if (this.masterTimeline) {
            this.masterTimeline.kill();
        }
        
        if (this.container) {
            this.container.remove();
        }
        
        this.stars = [];
        this.nebulae = [];
        this.isActive = false;
        
        console.log('우주 배경 효과 정리 완료');
    }
    
    /**
     * 현재 상태 반환
     */
    getStatus() {
        return {
            isActive: this.isActive,
            starCount: this.stars.length,
            nebulaCount: this.nebulae.length,
            isMobile: this.isMobile
        };
    }
}

// 전역 인스턴스 생성
window.cosmicBackground = new CosmicBackground();

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
        window.cosmicBackground = new CosmicBackground();
    }
};

console.log('우주 배경 효과 스크립트 로드 완료');
console.log('디버그 명령어: window.debugCosmicBackground.status(), .pause(), .resume(), .restart()');
