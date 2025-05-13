/**
 * 프로필 탭 관련 기능을 담당하는 JavaScript 파일
 * 프로필 섹션의 탭 전환 및 관련 애니메이션을 제어합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 탭 변경 기능 초기화
    initProfileTabs();
    
    // 스킬 애니메이션 초기화 (프로필 탭으로 통합되었으므로 관련 기능 유지)
    initSkillAnimations();
});

/**
 * 프로필 탭 기능 초기화
 */
function initProfileTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // 각 탭 버튼에 클릭 이벤트 리스너 등록
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 모든 탭 콘텐츠에서 active 클래스 제거
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            // 클릭된 탭 버튼과 해당 콘텐츠에 active 클래스 추가
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // 탭 전환 시 스킬 애니메이션 재실행
            if (targetTab === 'skills') {
                resetSkillAnimations();
            }
        });
    });
}

/**
 * 스킬 프로그레스바 애니메이션 초기화
 */
function initSkillAnimations() {
    // ScrollTrigger를 사용하여 스킬 섹션이 보일 때 애니메이션 실행
    gsap.registerPlugin(ScrollTrigger);
    
    const skillSection = document.getElementById('profile');
    
    if (skillSection) {
        const skillBars = document.querySelectorAll('.skill-level');
        
        // ScrollTrigger 설정
        ScrollTrigger.create({
            trigger: skillSection,
            start: 'top 70%',
            onEnter: () => animateSkills(),
            once: false
        });
        
        // 탭 변경 시에도 애니메이션이 작동하도록 호출될 수 있음
        function animateSkills() {
            skillBars.forEach(bar => {
                const level = bar.getAttribute('data-level');
                const progress = bar.querySelector('.skill-progress');
                
                gsap.to(progress, {
                    width: `${level}%`,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            });
        }
    }
}

/**
 * 스킬 애니메이션 리셋 및 재실행
 */
function resetSkillAnimations() {
    // 모든 스킬 프로그레스바를 0으로 리셋
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    skillProgress.forEach(progress => {
        // 먼저 애니메이션을 중단하고 너비를 0으로 설정
        gsap.killTweensOf(progress);
        gsap.set(progress, { width: '0%' });
    });
    
    // 잠시 후 애니메이션 재실행
    setTimeout(() => {
        const skillBars = document.querySelectorAll('.skill-level');
        
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            const progress = bar.querySelector('.skill-progress');
            
            gsap.to(progress, {
                width: `${level}%`,
                duration: 1.2,
                ease: 'power2.out'
            });
        });
    }, 100);
}
