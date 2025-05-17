/**
 * 네비게이션 활성화 관리자
 * 스크롤 위치에 따른 네비게이션 메뉴 활성화 제어
 */

class NavigationManager {
    constructor() {
        this.sections = null;
        this.navLinks = null;
        this.isInitialized = false;
        this.activeSection = null;
        this.navigationHeight = 80; // 네비게이션 바 높이
        
        this.init();
    }
    
    /**
     * 네비게이션 관리자 초기화
     */
    init() {
        // DOM이 준비될 때까지 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    /**
     * 네비게이션 설정
     */
    setupNavigation() {
        // 섹션과 네비게이션 링크 요소 가져오기
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a');
        
        if (this.sections.length === 0 || this.navLinks.length === 0) {
            console.warn('네비게이션 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 스크롤 이벤트 리스너 등록
        this.setupScrollListener();
        
        // 네비게이션 클릭 이벤트 등록
        this.setupClickEvents();
        
        // 초기 활성화 설정
        this.updateActiveNavigation();
        
        // URL 해시가 있는 경우 해당 메뉴 활성화
        this.handleInitialHash();
        
        this.isInitialized = true;
        console.log('네비게이션 관리자 초기화 완료');
    }
    
    /**
     * 스크롤 이벤트 리스너 설정
     */
    setupScrollListener() {
        // throttle 함수 구현 (없을 때 대비)
        const throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };
        
        // 스크롤 이벤트에 throttle 적용
        window.addEventListener('scroll', throttle(() => {
            this.updateActiveNavigation();
        }, 100));
    }
    
    /**
     * 네비게이션 클릭 이벤트 설정
     */
    setupClickEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 일시적으로 활성화 (스크롤이 완료되면 정확한 위치로 업데이트)
                this.setActiveLink(link);
                
                // 부드러운 스크롤을 위한 추가 처리
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        // 스크롤 완료 후 정확한 활성화를 위해 지연 적용
                        setTimeout(() => {
                            this.updateActiveNavigation();
                        }, 500);
                    }
                }
            });
        });
    }
    
    /**
     * 현재 스크롤 위치에 따른 네비게이션 업데이트
     */
    updateActiveNavigation() {
        if (!this.sections || !this.navLinks) return;
        
        const scrollPosition = window.scrollY + this.navigationHeight + 50; // 여유 공간 추가
        let currentSection = null;
        
        // 섹션들을 순회하며 현재 보이는 섹션 찾기
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // 현재 스크롤 위치가 섹션 범위 내에 있는지 확인
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        });
        
        // 맨 아래까지 스크롤한 경우 마지막 섹션 활성화
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollHeight = window.scrollY;
        
        if (scrollHeight + windowHeight >= documentHeight - 100) {
            // 마지막 섹션으로 설정
            currentSection = this.sections[this.sections.length - 1];
        }
        
        // 활성 섹션이 변경된 경우에만 업데이트
        if (currentSection && currentSection !== this.activeSection) {
            this.activeSection = currentSection;
            const sectionId = currentSection.getAttribute('id');
            this.activateNavBySection(sectionId);
        }
    }
    
    /**
     * 섹션 ID에 따른 네비게이션 활성화
     * @param {string} sectionId - 활성화할 섹션 ID
     */
    activateNavBySection(sectionId) {
        // 모든 링크에서 active 클래스 제거
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 해당 섹션의 링크에 active 클래스 추가
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log(`네비게이션 활성화: ${sectionId}`);
        }
    }
    
    /**
     * 특정 링크 활성화
     * @param {Element} clickedLink - 클릭된 링크 요소
     */
    setActiveLink(clickedLink) {
        // 모든 링크에서 active 클래스 제거
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 클릭된 링크에 active 클래스 추가
        clickedLink.classList.add('active');
    }
    
    /**
     * 초기 URL 해시 처리
     */
    handleInitialHash() {
        if (window.location.hash) {
            const targetLink = document.querySelector(`.nav-links a[href="${window.location.hash}"]`);
            if (targetLink) {
                this.setActiveLink(targetLink);
            }
        }
    }
    
    /**
     * 네비게이션 높이 업데이트
     * @param {number} height - 새로운 네비게이션 높이
     */
    setNavigationHeight(height) {
        this.navigationHeight = height;
    }
    
    /**
     * 수동으로 네비게이션 업데이트 강제 실행
     */
    forceUpdate() {
        this.updateActiveNavigation();
    }
    
    /**
     * 리소스 정리
     */
    destroy() {
        // 이벤트 리스너는 자동으로 정리되므로 별도 처리 불필요
        this.sections = null;
        this.navLinks = null;
        this.isInitialized = false;
        this.activeSection = null;
    }
}

// 전역 인스턴스 생성
window.navigationManager = new NavigationManager();

// 개발자 도구용 헬퍼 함수들
window.debugNavigation = {
    // 강제 업데이트
    update: () => window.navigationManager.forceUpdate(),
    
    // 상태 확인
    status: () => ({
        initialized: window.navigationManager.isInitialized,
        sectionsCount: window.navigationManager.sections?.length || 0,
        navLinksCount: window.navigationManager.navLinks?.length || 0,
        activeSection: window.navigationManager.activeSection?.getAttribute('id') || 'none',
        navigationHeight: window.navigationManager.navigationHeight
    }),
    
    // 섹션 위치 정보
    getSectionPositions: () => {
        if (!window.navigationManager.sections) return [];
        
        return Array.from(window.navigationManager.sections).map(section => ({
            id: section.getAttribute('id'),
            offsetTop: section.offsetTop,
            height: section.offsetHeight,
            bottom: section.offsetTop + section.offsetHeight
        }));
    }
};

console.log('네비게이션 관리자 스크립트 로드 완료');
console.log('디버그 명령어: window.debugNavigation.update(), .status(), .getSectionPositions()');
