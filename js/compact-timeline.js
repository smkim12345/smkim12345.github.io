/**
 * Cosmic Portfolio - 컴팩트 타임라인 스크립트
 * 김성민의 우주 테마 포트폴리오
 */

document.addEventListener('DOMContentLoaded', function() {
    // 타임라인 요소 가져오기
    const timelineTrack = document.querySelector('.timeline-track');
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    // 카드 애니메이션 설정
    timelineCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // 애니메이션 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 뱃지와 카드에 애니메이션 추가
                const badges = document.querySelectorAll('.certificate-badge');
                badges.forEach((badge, index) => {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        badge.style.transition = 'all 0.5s ease';
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }, 150 * index);
                });
                
                // 옵저버 해제
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 자격증 디스플레이 섹션 관찰
    const certificatesTab = document.getElementById('certificates-tab');
    if (certificatesTab) {
        observer.observe(certificatesTab);
    }
});
