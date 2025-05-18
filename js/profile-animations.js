// 프로필 섹션 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  // GSAP ScrollTrigger가 로드되었는지 확인
  if (typeof ScrollTrigger !== 'undefined') {
    // 프로필 섹션 헤더 애니메이션
    gsap.from('#profile .section-header', {
      scrollTrigger: {
        trigger: '#profile',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
    
    // 프로필 소개 텍스트 애니메이션
    gsap.from('#profile .profile-text p', {
      scrollTrigger: {
        trigger: '#profile .profile-intro',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.7,
      ease: 'power1.out'
    });
    
    // 프로필 이미지 애니메이션
    gsap.from('#profile .profile-image', {
      scrollTrigger: {
        trigger: '#profile .profile-intro',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.8,
      duration: 1,
      delay: 0.3,
      ease: 'back.out(1.2)'
    });
    
    // 각 탭 컨텐츠 애니메이션 - 클래스 수정
    // 연혁 섹션 애니메이션
    gsap.from('#history-tab .section-subtitle', {
      scrollTrigger: {
        trigger: '#history-tab',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    
    // 연혁 카드 - 개별 카드 애니메이션 (왼쪽에서 오른쪽으로)
    const timelineCards = document.querySelectorAll('#history-tab .timeline-card');
    timelineCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
    
    // 자격증 섹션 애니메이션
    gsap.from('#certificates-tab .section-subtitle', {
      scrollTrigger: {
        trigger: '#certificates-tab',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    
    // 자격증 배지 - 개별 배지 애니메이션 (위에서 아래로)
    const certBadges = document.querySelectorAll('#certificates-tab .certificate-badge');
    certBadges.forEach((badge, index) => {
      gsap.from(badge, {
        scrollTrigger: {
          trigger: badge,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power1.out'
      });
    });
    
    // 스킬 섹션 애니메이션 - skill-animation.js와 충돌 방지를 위해 삭제
    gsap.from('#skills-tab .section-subtitle', {
      scrollTrigger: {
        trigger: '#skills-tab',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    
    // 스킬 카테고리만 애니메이션, 프로그레스 바는 기존 스크립트 사용
    gsap.from('#skills-tab .skill-category', {
      scrollTrigger: {
        trigger: '#skills-tab .skills-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.7,
      ease: 'power2.out'
    });
    
    // 스킬 게이지바 애니메이션은 기존 skill-animation.js를 사용하도록 제거
  } else {
    console.error('GSAP ScrollTrigger is not loaded');
  }
}); 