// 포트폴리오 섹션 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  // GSAP와 ScrollTrigger가 로드되었는지 확인
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const portfolioSection = document.querySelector('#portfolio');

    if (portfolioSection) {
      // GSAP 타임라인 생성
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioSection, // 포트폴리오 섹션 전체를 트리거로 사용
          start: 'top 75%',      // 섹션의 상단이 뷰포트의 75% 지점에 도달했을 때 시작
          once: true,            // 애니메이션을 한 번만 실행
        }
      });

      // 1. 섹션 헤더 애니메이션 (타임라인에 추가)
      tl.from(portfolioSection.querySelector('.section-header'), {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
      });

      // 2. 포트폴리오 필터 컨테이너 애니메이션 (타임라인에 추가)
      // 헤더 애니메이션과 거의 동시에 시작하되 약간의 지연을 둠 (0.2초 후)
      tl.from(portfolioSection.querySelector('.portfolio-filter-container'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power1.out'
      }, "-=0.4"); // 이전 애니메이션(헤더)이 시작되고 0.4초 후, 즉 헤더보다 약간 늦지만 겹치도록

      // 3. 포트폴리오 아이템들 애니메이션 (타임라인에 추가)
      const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
      if (portfolioItems.length > 0) {
        tl.from(portfolioItems, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          stagger: 0.07, // 아이템들이 0.07초 간격으로 순차적으로 나타남
          ease: 'power1.out'
        }, "-=0.2"); // 필터 애니메이션과 거의 동시에 시작, 필터보다 약간 뒤
      }
    } else {
      console.error('#portfolio 섹션을 찾을 수 없습니다.');
    }

  } else {
    console.error('GSAP 또는 ScrollTrigger가 portfolio-animations.js에 로드되지 않았습니다.');
  }
}); 