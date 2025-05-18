// 연락하기 섹션 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  // GSAP와 ScrollTrigger가 로드되었는지 확인
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const contactSection = document.querySelector('#contact');

    if (contactSection) {
      // GSAP 타임라인 생성
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactSection, // 연락하기 섹션 전체를 트리거로 사용
          start: 'top 75%',      // 섹션의 상단이 뷰포트의 75% 지점에 도달했을 때 시작
          once: true,            // 애니메이션을 한 번만 실행
        }
      });

      // 1. 섹션 헤더 애니메이션
      tl.from(contactSection.querySelector('.section-header'), {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
      });

      // 2. 연락처 정보 애니메이션
      // 헤더 애니메이션과 거의 동시에 시작하되 약간의 지연
      tl.from(contactSection.querySelector('.contact-info'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power1.out'
      }, "-=0.4"); // 이전 애니메이션(헤더) 시작 후 0.2초 뒤

      // 3. 우주소년 이미지 애니메이션
      // 연락처 정보 애니메이션과 거의 동시에 시작하되 약간의 지연 및 다른 효과
      tl.from(contactSection.querySelector('.space-boy'), {
        opacity: 0,
        Y: 40, // 아래에서 더 많이 올라오는 느낌
        scale: 0.8,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)' // 탄성 효과 조정
      }, "-=0.3"); // 이전 애니메이션(연락처 정보) 시작 후 0.2초 뒤

    } else {
      console.error('#contact 섹션을 찾을 수 없습니다.');
    }

  } else {
    console.error('GSAP 또는 ScrollTrigger가 contact-animations.js에 로드되지 않았습니다.');
  }
}); 