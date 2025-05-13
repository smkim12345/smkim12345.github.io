/**
 * Cosmic Portfolio - 우주 테마 연락하기 섹션 스크립트
 * 로켓 착륙과 캐릭터 상호작용 처리
 */

document.addEventListener('DOMContentLoaded', () => {
    // 기본 변수 초기화
    const contactSection = document.getElementById('contact');
    const astronautChar = document.getElementById('kakao-chat-link');
    
    // 카카오톡 오픈채팅 링크 설정 (실제 링크 예시)
    const KAKAO_OPENCHAT_URL = 'https://open.kakao.com/o/sEGoDXHg';
    
    /**
     * 초기화 함수
     */
    function init() {
        // 우주복 캐릭터 클릭 이벤트 설정
        if (astronautChar) {
            astronautChar.addEventListener('click', openKakaoChat);
            // href 속성 설정
            astronautChar.setAttribute('href', KAKAO_OPENCHAT_URL);
            astronautChar.setAttribute('target', '_blank');
            astronautChar.setAttribute('rel', 'noopener noreferrer');
        }
    }
    
    /**
     * 카카오톡 오픈채팅 열기
     * @param {Event} e 클릭 이벤트
     */
    function openKakaoChat(e) {
        // 기본 동작은 그대로 유지 (링크 열기)
        // 여기서는 추가 애니메이션만 처리
        
        // 우주복 캐릭터 애니메이션 효과
        const character = e.currentTarget;
        gsap.timeline()
            .to(character, {
                scale: 1.1,
                y: -10,
                duration: 0.2,
                ease: 'power2.out'
            })
            .to(character, {
                scale: 0.95,
                y: 5,
                duration: 0.1,
                ease: 'power1.in'
            })
            .to(character, {
                scale: 1,
                y: 0,
                duration: 0.2,
                ease: 'elastic.out(1, 0.3)'
            });
    }
    
    // 초기화 실행
    init();
});