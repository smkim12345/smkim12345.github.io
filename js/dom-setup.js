// 로켓 요소 및 네비게이션 설정
document.addEventListener('DOMContentLoaded', function() {
  // 로켓 요소에 인라인 스타일 적용
  var rocketElement = document.getElementById('rocket-element');
  if (rocketElement) {
    rocketElement.style.zIndex = '9000'; // 모달보다 낮게 설정
    rocketElement.style.pointerEvents = 'auto';
    
    // 이미지와 화염에도 스타일 적용
    var rocketImg = rocketElement.querySelector('img');
    var rocketFlame = rocketElement.querySelector('.rocket-flame');
    
    if (rocketImg) {
      rocketImg.style.pointerEvents = 'auto';
    }
    
    if (rocketFlame) {
      rocketFlame.style.pointerEvents = 'none';
    }
    
    console.log('DOM 설정: 로켓 스타일 적용 완료');
  }
  
  // 네비게이션 바 스타일 적용
  var navElement = document.querySelector('.main-nav');
  if (navElement) {
    navElement.style.pointerEvents = 'none';
    
    // 네비게이션 내부 요소들 스타일 적용
    var navInteractiveElements = navElement.querySelectorAll('.nav-container, .logo, .menu-toggle, .nav-links, .nav-links li, .nav-links a');
    navInteractiveElements.forEach(function(element) {
      element.style.pointerEvents = 'auto';
    });
    
    console.log('DOM 설정: 네비게이션 스타일 적용 완료');
  }
  
  // 로켓 인스턴스 강제 활성화
  setTimeout(function() {
    if (window.rocketInstance) {
      window.rocketInstance.isActive = true;
      window.rocketInstance.isPaused = false;
      window.rocketInstance.setRocketStyles();
      window.rocketInstance.setupMouseTracking();
      window.rocketInstance.startAnimationLoop();
      console.log('DOM 설정: 로켓 인스턴스 강제 활성화');
    }
  }, 1000); // 1초 후 실행
}); 