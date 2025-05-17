/**
 * 포트폴리오 필터링 기능 (애니메이션 없는 즉시 적용 버전)
 */

window.PortfolioFilter = (function() {
  
  // 초기화 플래그
  let isInitialized = false;
  
  // DOM 요소 캐싱
  let filterBtns = [];
  let portfolioItems = [];
  let activeFilter = 'all';
  
  /**
   * 필터링 시스템 초기화
   */
  function init() {
    if (isInitialized) {
      console.log('포트폴리오 필터링이 이미 초기화되었습니다.');
      return;
    }
    
    // DOM 요소 확인 및 캐싱
    filterBtns = document.querySelectorAll('.filter-btn');
    portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // 필수 요소 확인
    if (!filterBtns.length) {
      console.error('필터 버튼을 찾을 수 없습니다.');
      return;
    }
    
    if (!portfolioItems.length) {
      console.error('포트폴리오 아이템을 찾을 수 없습니다.');
      return;
    }
    
    console.log(`포트폴리오 필터링 초기화: ${filterBtns.length}개 버튼, ${portfolioItems.length}개 아이템`);
    
    // 초기 상태 설정
    setupInitialState();
    
    // 각 아이템의 data-category 확인
    portfolioItems.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      console.log(`아이템 ${index + 1}: ${category || '카테고리 없음'}`);
    });
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기화 완료
    isInitialized = true;
    activeFilter = 'all';
    console.log('✅ 포트폴리오 필터링 초기화 완료 (애니메이션 없음)');
  }
  
  /**
   * 초기 상태 설정
   */
  function setupInitialState() {
    portfolioItems.forEach(item => {
      // 모든 아이템을 기본 상태로 설정
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
      item.style.visibility = 'visible';
      
      // CSS 클래스 초기화
      item.classList.remove('hide', 'show');
      item.classList.add('show');
    });
  }
  
  /**
   * 이벤트 리스너 설정
   */
  function setupEventListeners() {
    filterBtns.forEach(btn => {
      // 기존 이벤트 리스너 제거 (중복 방지)
      btn.removeEventListener('click', handleFilterClick);
      // 새 이벤트 리스너 추가
      btn.addEventListener('click', handleFilterClick);
    });
  }
  
  /**
   * 필터 버튼 클릭 핸들러
   */
  function handleFilterClick(e) {
    e.preventDefault();
    
    // 현재 클릭된 버튼
    const clickedBtn = e.currentTarget;
    const filterValue = clickedBtn.getAttribute('data-filter');
    
    // 같은 필터를 다시 클릭한 경우 무시
    if (activeFilter === filterValue) {
      console.log(`이미 활성화된 필터: ${filterValue}`);
      return;
    }
    
    console.log(`필터 클릭: ${filterValue} (이전: ${activeFilter})`);
    
    // 활성 버튼 업데이트
    updateActiveButton(clickedBtn);
    
    // 필터링 즉시 실행
    filterItemsInstant(filterValue);
    
    // 활성 필터 업데이트
    activeFilter = filterValue;
  }
  
  /**
   * 활성 버튼 업데이트
   */
  function updateActiveButton(activeBtn) {
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }
  
  /**
   * 아이템 필터링 즉시 실행 (애니메이션 없음)
   */
  function filterItemsInstant(filterValue) {
    console.log(`즉시 필터링 실행: ${filterValue}`);
    
    let showCount = 0;
    let hideCount = 0;
    
    portfolioItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const shouldShow = filterValue === 'all' || itemCategory === filterValue;
      
      if (shouldShow) {
        // 보이기
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.visibility = 'visible';
        item.classList.remove('hide');
        item.classList.add('show');
        showCount++;
      } else {
        // 숨기기
        item.style.display = 'none';
        item.style.opacity = '0';
        item.style.transform = 'scale(1)';
        item.style.visibility = 'hidden';
        item.classList.remove('show');
        item.classList.add('hide');
        hideCount++;
      }
    });
    
    console.log(`필터링 완료: 보임 ${showCount}개, 숨김 ${hideCount}개`);
  }
  
  /**
   * 특정 카테고리로 필터링
   */
  function filterByCategory(category) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
    if (targetBtn) {
      targetBtn.click();
    } else {
      console.warn(`카테고리 '${category}'에 해당하는 필터 버튼을 찾을 수 없습니다.`);
    }
  }
  
  /**
   * 모든 아이템 표시
   */
  function showAll() {
    filterByCategory('all');
  }
  
  /**
   * 현재 활성 필터 반환
   */
  function getActiveFilter() {
    return activeFilter;
  }
  
  /**
   * 필터링 시스템 재초기화
   */
  function reinit() {
    console.log('포트폴리오 필터링 재초기화');
    
    // 상태 초기화
    isInitialized = false;
    activeFilter = 'all';
    
    // 다시 초기화
    init();
  }
  
  /**
   * 필터링 시스템 해제
   */
  function destroy() {
    console.log('포트폴리오 필터링 시스템 해제');
    
    // 이벤트 리스너 제거
    filterBtns.forEach(btn => {
      btn.removeEventListener('click', handleFilterClick);
    });
    
    // 상태 초기화
    isInitialized = false;
    filterBtns = [];
    portfolioItems = [];
    activeFilter = 'all';
  }
  
  // 공개 API
  return {
    init: init,
    filterByCategory: filterByCategory,
    showAll: showAll,
    getActiveFilter: getActiveFilter,
    reinit: reinit,
    destroy: destroy
  };
  
})();

// DOM이 로드된 후 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: 포트폴리오 필터링 초기화 시작');
  
  // 즉시 초기화 (지연 없음)
  setTimeout(() => {
    window.PortfolioFilter.init();
  }, 100);
});

// 디버깅을 위한 전역 함수
window.debugPortfolioFilter = function() {
  console.log('=== 포트폴리오 필터 디버그 정보 ===');
  console.log('필터 버튼:', document.querySelectorAll('.filter-btn'));
  console.log('포트폴리오 아이템:', document.querySelectorAll('.portfolio-item'));
  console.log('현재 활성 필터:', window.PortfolioFilter.getActiveFilter());
  console.log('GSAP 로드됨:', typeof gsap !== 'undefined');
  console.log('애니메이션 모드: 즉시 적용 (애니메이션 없음)');
};