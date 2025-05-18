/**
 * 스킬 섹션 애니메이션 관리자
 * 스킬 바 게이지 채우기 애니메이션 제어
 */

class SkillAnimationManager {
    constructor() {
        this.skillItems = null;
        this.isInitialized = false;
        this.observer = null;
        this.animationCompleted = false;
        
        this.init();
    }
    
    /**
     * 스킬 애니메이션 초기화
     */
    init() {
        // DOM이 준비될 때까지 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSkillAnimation());
        } else {
            this.setupSkillAnimation();
        }
    }
    
    /**
     * 스킬 애니메이션 설정
     */
    setupSkillAnimation() {
        this.skillItems = document.querySelectorAll('.skill-item');
        
        if (this.skillItems.length === 0) {
            console.warn('스킬 아이템을 찾을 수 없습니다.');
            return;
        }
        
        // 각 스킬 아이템에 퍼센트 표시 추가
        this.addPercentageDisplay();
        
        // Intersection Observer 설정
        this.setupIntersectionObserver();
        
        // 각 스킬 아이템 관찰 시작
        this.skillItems.forEach(item => {
            this.observer.observe(item);
        });
        
        this.isInitialized = true;
        console.log('스킬 애니메이션 초기화 완료');
    }
    
    /**
     * 각 스킬 아이템에 퍼센트 표시 추가
     */
    addPercentageDisplay() {
        this.skillItems.forEach(item => {
            const skillInfo = item.querySelector('.skill-info');
            const skillLevel = item.querySelector('.skill-level');
            
            if (!skillInfo || !skillLevel) return;
            
            // data-level 속성에서 레벨 값 가져오기
            const level = parseInt(skillLevel.getAttribute('data-level')) || 0;
            
            // 퍼센트 표시 요소가 이미 있는지 확인
            let percentElement = skillInfo.querySelector('.skill-percentage');
            if (!percentElement) {
                percentElement = document.createElement('span');
                percentElement.className = 'skill-percentage';
                percentElement.textContent = '0%';
                skillInfo.appendChild(percentElement);
            }
            
            // 스킬 진행 바에 최종 너비 설정 (CSS 변수로)
            const progressBar = skillLevel.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.setProperty('--target-width', `${level}%`);
            }
        });
    }
    
    /**
     * Intersection Observer 설정
     * 스킬 섹션이 화면에 보이기 시작하면 애니메이션 시작
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px 0px 0px', // 여백 없음
            threshold: 0.2 // 20% 이상 보이면 트리거
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateSkill(entry.target);
                }
            });
        }, options);
    }
    
    /**
     * 개별 스킬 애니메이션 실행
     * @param {Element} skillItem - 애니메이션할 스킬 아이템
     */
    animateSkill(skillItem) {
        const skillLevel = skillItem.querySelector('.skill-level');
        const progressBar = skillLevel.querySelector('.skill-progress');
        const percentElement = skillItem.querySelector('.skill-percentage');
        
        if (!skillLevel || !progressBar || !percentElement) return;
        
        // data-level 속성에서 목표 레벨 가져오기
        const targetLevel = parseInt(skillLevel.getAttribute('data-level')) || 0;
        
        // 애니메이션이 이미 실행된 경우 건너뛰기
        if (skillItem.classList.contains('animated')) return;
        
        // 애니메이션 시작 표시
        skillItem.classList.add('animated');
        
        // 애프터 이펙트 특별 처리
        const isAfterEffect = skillItem.classList.contains('aftereffect-item');
        
        // 애니메이션 지연 시간 (모든 스킬 동시에 채워지도록 수정)
        const delay = 100; // 모든 스킬 아이템에 동일한 지연 시간 적용
        
        // 지연 후 애니메이션 시작
        setTimeout(() => {
            this.runProgressAnimation(progressBar, percentElement, targetLevel);
        }, delay);
    }
    
    /**
     * 진행 바 애니메이션 실행
     * @param {Element} progressBar - 진행 바 요소
     * @param {Element} percentElement - 퍼센트 표시 요소
     * @param {number} targetLevel - 목표 레벨 (0-100)
     */
    runProgressAnimation(progressBar, percentElement, targetLevel) {
        const duration = 1000; // 애니메이션 지속 시간 (ms) 조정
        const frameRate = 60; // 초당 프레임 수
        const totalFrames = (duration / 1000) * frameRate;
        const increment = targetLevel / totalFrames;
        
        let currentLevel = 0;
        let frame = 0;
        
        // easeOutQuart 이징 함수 - 더 자연스러운 진행
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = easeOutQuart(progress);
            currentLevel = targetLevel * easedProgress;
            
            // 진행 바 너비 업데이트
            progressBar.style.width = `${currentLevel}%`;
            
            // 퍼센트 텍스트 업데이트 (정수로 반올림)
            percentElement.textContent = `${Math.round(currentLevel)}%`;
            
            // 애니메이션 계속 또는 완료
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                // 최종 값 정확히 설정
                progressBar.style.width = `${targetLevel}%`;
                percentElement.textContent = `${targetLevel}%`;
                
                // 완료 후 반짝임 효과 트리거
                this.triggerShimmerEffect(progressBar);
            }
        };
        
        // 애니메이션 시작
        requestAnimationFrame(animate);
    }
    
    /**
     * 반짝임 효과 트리거
     * @param {Element} progressBar - 진행 바 요소
     */
    triggerShimmerEffect(progressBar) {
        progressBar.classList.add('shimmer-active');
        
        // 2초 후 반짝임 효과 제거
        setTimeout(() => {
            progressBar.classList.remove('shimmer-active');
        }, 2000);
    }
    
    /**
     * 수동으로 모든 스킬 애니메이션 실행
     * (테스트 또는 강제 실행용)
     */
    animateAllSkills() {
        if (!this.isInitialized) {
            console.warn('스킬 애니메이션이 초기화되지 않았습니다.');
            return;
        }
        
        this.skillItems.forEach((item, index) => {
            setTimeout(() => {
                this.animateSkill(item);
            }, 100); // 모든 스킬에 동일한 지연 시간 적용
        });
        
        this.animationCompleted = true;
    }
    
    /**
     * 애니메이션 리셋
     */
    resetAnimations() {
        if (!this.skillItems) return;
        
        this.skillItems.forEach(item => {
            item.classList.remove('animated');
            const progressBar = item.querySelector('.skill-progress');
            const percentElement = item.querySelector('.skill-percentage');
            
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.classList.remove('shimmer-active');
            }
            
            if (percentElement) {
                percentElement.textContent = '0%';
            }
        });
        
        this.animationCompleted = false;
    }
    
    /**
     * 리소스 정리
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.skillItems = null;
        this.isInitialized = false;
        this.animationCompleted = false;
    }
}

// 전역 인스턴스 생성
window.skillAnimationManager = new SkillAnimationManager();

// 개발자 도구용 헬퍼 함수들
window.debugSkillAnimation = {
    // 모든 스킬 애니메이션 강제 실행
    animate: () => window.skillAnimationManager.animateAllSkills(),
    
    // 애니메이션 리셋
    reset: () => window.skillAnimationManager.resetAnimations(),
    
    // 상태 확인
    status: () => ({
        initialized: window.skillAnimationManager.isInitialized,
        completed: window.skillAnimationManager.animationCompleted,
        skillCount: window.skillAnimationManager.skillItems?.length || 0
    })
};

console.log('스킬 애니메이션 스크립트 로드 완료');
console.log('디버그 명령어: window.debugSkillAnimation.animate(), .reset(), .status()');
