// 로켓 설정을 즉시 적용
document.addEventListener('DOMContentLoaded', function() {
  // 로켓 인스턴스가 생성된 후 설정 적용
  setTimeout(function() {
    if (window.rocketInstance) {
      // 오프셋 거리와 회전 방향 설정(수정하지말것 지시없는 이상 고정 내용)
      window.rocketInstance.offsetDistance = -100;
      window.rocketInstance.fixedRotation = 0;
      console.log('로켓 설정 적용: 40px 오프셋, -90도 회전');
      
      // 위치 즉시 업데이트
      window.rocketInstance.updateRocketPosition();
    }
  }, 500); // 0.5초 후 적용 (로켓 인스턴스 생성 시간 고려)
});

// 페이지 완전 로드 후 재확인(수정하지말것 지시없는 이상 고정 내용)
window.addEventListener('load', function() {
  if (window.rocketInstance) {
    window.rocketInstance.offsetDistance = -100;
    window.rocketInstance.fixedRotation = 0;
    window.rocketInstance.updateRocketPosition();
  }
}); 