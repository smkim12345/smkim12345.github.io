/**
 * 메인 섹션 텍스트 전환 애니메이션
 * name 박스와 title+tagline 박스가 번갈아 나타나는 효과
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM이 로드된 후에 실행
  const nameContainer = document.querySelector(".name-container");
  const titleContainer = document.querySelector(".title-container");
  
  // 두 요소가 모두 존재하는지 확인
  if (nameContainer && titleContainer) {
    // 페이지 로드 시 초기 상태 설정 (name 박스가 활성화 상태)
    nameContainer.classList.add("active");
    titleContainer.classList.remove("active");
    
    // 전환 상태 추적 변수
    let showingName = true;
    
    // 전환 함수
    function toggleTextContent() {
      if (showingName) {
        // name → title+tagline 전환
        nameContainer.classList.remove("active");
        setTimeout(() => {
          titleContainer.classList.add("active");
        }, 400); // 페이드 아웃 후 다음 요소 페이드 인
      } else {
        // title+tagline → name 전환
        titleContainer.classList.remove("active");
        setTimeout(() => {
          nameContainer.classList.add("active");
        }, 400); // 페이드 아웃 후 다음 요소 페이드 인
      }
      
      // 상태 토글
      showingName = !showingName;
    }
    
    // 2초마다 전환 설정
    setInterval(toggleTextContent, 3000); // 각 요소가 2초씩 보이도록 총 4초 간격
  } else {
    console.error("텍스트 전환 애니메이션: 필요한 요소를 찾을 수 없습니다.");
  }
}); 