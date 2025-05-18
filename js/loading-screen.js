// 페이지 로드 후 5초가 지나도 로딩 화면이 표시되어 있으면 강제로 숨김
window.addEventListener('load', function() {
  setTimeout(function() {
    var loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      loadingScreen.style.display = 'none';
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
      loadingScreen.style.pointerEvents = 'none';
      loadingScreen.style.zIndex = '-1';
      console.log('인라인 스크립트: 로딩 화면 강제 제거');
    }
  }, 5000); // 5초 후 체크
});

// 페이지 로드 후 2초 뒤 체크
setTimeout(function() {
  var loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden'; 
    loadingScreen.style.pointerEvents = 'none';
    loadingScreen.style.zIndex = '-1';
    console.log('인라인 스크립트: 2초 후 로딩 화면 강제 제거');
  }
}, 2000);

// 클릭 이벤트를 통한 로딩 화면 제거
document.addEventListener('click', function() {
  var loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
    console.log('인라인 스크립트: 클릭으로 로딩 화면 제거');
  }
}); 