// 페이지가 완전히 로드된 후 로켓 인스턴스 강제 활성화
window.addEventListener('load', function() {
  // 로딩 화면 숨기기
  var loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    loadingScreen.style.pointerEvents = 'none';
    loadingScreen.style.zIndex = '-1';
  }
  
  // 로켓 인스턴스 강제 활성화
  if (window.rocketInstance) {
    window.rocketInstance.isActive = true;
    window.rocketInstance.isPaused = false;
    window.rocketInstance.setRocketStyles();
    window.rocketInstance.setupMouseTracking();
    window.rocketInstance.startAnimationLoop();
    console.log('페이지 로드 후 로켓 인스턴스 강제 활성화');
  } else {
    console.log('로켓 인스턴스가 없습니다, 새로 생성합니다.');
    try {
      window.rocketInstance = new ImprovedRocketAnimation();
      window.COSMIC_PORTFOLIO = window.COSMIC_PORTFOLIO || {};
      window.COSMIC_PORTFOLIO.rocket = window.rocketInstance;
    } catch (error) {
      console.error('로켓 인스턴스 생성 오류:', error);
    }
  }
  
  // 로켓 이벤트 핸들러 활성화
  if (window.activateRocketEventHandler) {
    window.activateRocketEventHandler();
    console.log('로켓 이벤트 핸들러 활성화됨');
  } else {
    console.log('로켓 이벤트 핸들러 함수를 찾을 수 없습니다');
  }
  
  // 로켓 요소 스타일 강제 적용
  var rocketElement = document.getElementById('rocket-element');
  if (rocketElement) {
    rocketElement.style.zIndex = '9000'; // 모달보다 낮게 설정
    rocketElement.style.pointerEvents = 'auto';
    rocketElement.style.opacity = '1';
    rocketElement.style.visibility = 'visible';
    
    var rocketImg = rocketElement.querySelector('img');
    if (rocketImg) {
      rocketImg.style.pointerEvents = 'auto';
    }
    
    console.log('로켓 요소 스타일 강제 적용 완료');
  }
  
  // 프로필 사진 무중력 효과 강화 (GSAP)
  if (window.gsap) {
    // 메인 섹션 프로필 사진
    const mainProfilePhoto = document.querySelector(".hero-profile .floating-profile-photo");
    if (mainProfilePhoto) {
      // 기본 CSS 애니메이션에 추가적인 GSAP 애니메이션 적용
      gsap.to(mainProfilePhoto, {
        y: "+=10", // 현재 위치에서 상대적으로 움직이도록 설정
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random()
      });
      
      // 프로필 프레임 회전 애니메이션
      const profileFrame = document.querySelector(".hero-profile .profile-frame");
      if (profileFrame) {
        gsap.to(profileFrame, {
          rotation: 1.5, // 회전 각도 감소
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut", 
          delay: 0.5
        });
      }
      
      console.log('프로필 사진 무중력 효과 강화 적용 완료');
    }
    
    // 프로필 섹션 사진에도 적용 (있다면)
    const profileSectionPhoto = document.querySelector(".profile-section-photo");
    if (profileSectionPhoto) {
      gsap.to(profileSectionPhoto, {
        y: "+=8", // 현재 위치에서 상대적 움직임 증가
        rotation: 1.5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 0.5
      });
    }
  }
});

// 마우스 이벤트 강제 추가 (백업)
document.addEventListener('mousemove', function(e) {
  if (window.rocketInstance && window.rocketInstance.isActive && !window.rocketInstance.isPaused) {
    window.rocketInstance.mouseX = e.clientX;
    window.rocketInstance.mouseY = e.clientY;
  }
}); 