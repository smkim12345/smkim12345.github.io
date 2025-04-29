// 문서가 완전히 로드된 후 스크립트 실행
document.addEventListener("DOMContentLoaded", function () {
  // 사이드 메뉴 토글
  initSideMenu();

  // 검색바 토글
  initSearchBar();

  // 카테고리 탭
  initCategoryTabs();

  // 필터 탭
  initFilterTabs();

  // 정렬 드롭다운
  initSortDropdown();

  // 필터 모달
  initFilterModal();

  // 서브메뉴 토글
  initSubmenuToggle();

  // 스와이퍼 초기화
  initSwiper();

  // URL 파라미터 처리
  handleUrlParams();

  // 찜 버튼 토글
  initWishButtons();
});

// 사이드 메뉴 초기화
function initSideMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const sideMenu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".side-menu-overlay");

  if (!menuToggle || !menuClose || !sideMenu || !overlay) return;

  // 메뉴 열기
  menuToggle.addEventListener("click", function () {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // 스크롤 방지
  });

  // 메뉴 닫기
  function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // 스크롤 복원
  }

  menuClose.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // 터치 스와이프로 메뉴 닫기 (왼쪽으로 스와이프)
  let touchStartX = 0;
  let touchEndX = 0;

  sideMenu.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sideMenu.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 70) {
        // 왼쪽으로 70px 이상 스와이프하면 닫기
        closeMenu();
      }
    },
    { passive: true }
  );
}

// 검색바 초기화
function initSearchBar() {
  const searchToggle = document.querySelector(".search-toggle");
  const searchBar = document.querySelector(".search-bar");
  const searchClose = document.querySelector(".search-close");

  if (!searchToggle || !searchBar || !searchClose) return;

  searchToggle.addEventListener("click", function () {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) {
      searchBar.querySelector("input").focus();
    }
  });

  searchClose.addEventListener("click", function () {
    searchBar.classList.remove("active");
  });
}

// 카테고리 탭 초기화
function initCategoryTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");

  if (tabBtns.length === 0) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 모든 탭 비활성화
      tabBtns.forEach((b) => b.classList.remove("active"));
      // 클릭한 탭 활성화
      this.classList.add("active");

      // 해당 탭 컨텐츠 표시
      const category = this.dataset.category;
      const tabContents = document.querySelectorAll(".tab-content");

      tabContents.forEach((content) => {
        content.classList.remove("active");
      });

      document.getElementById(`${category}-tab`).classList.add("active");
    });
  });
}

// 필터 탭 초기화
function initFilterTabs() {
  const filterTabs = document.querySelectorAll(".filter-tab");

  if (filterTabs.length === 0) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // 모든 탭 비활성화
      filterTabs.forEach((t) => t.classList.remove("active"));
      // 클릭한 탭 활성화
      this.classList.add("active");

      // 제품 필터링
      const filter = this.dataset.filter;
      const products = document.querySelectorAll(".product-card");

      products.forEach((product) => {
        if (filter === "all" || product.dataset.category === filter) {
          product.style.display = "block";
        } else {
          product.style.display = "none";
        }
      });
    });
  });
}

// 정렬 드롭다운 초기화
function initSortDropdown() {
  const sortBtn = document.querySelector(".sort-btn");
  const sortDropdown = document.querySelector(".sort-dropdown");
  const sortOptions = document.querySelectorAll(".sort-options button");

  if (!sortBtn || !sortDropdown || sortOptions.length === 0) return;

  sortBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sortDropdown.classList.toggle("active");
  });

  sortOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // 모든 옵션 비활성화
      sortOptions.forEach((o) => o.classList.remove("active"));
      // 선택한 옵션 활성화
      this.classList.add("active");

      // 정렬 텍스트 업데이트
      sortBtn.querySelector("span:first-child").textContent = this.textContent;

      // 드롭다운 닫기
      sortDropdown.classList.remove("active");

      // 정렬 로직 구현 (데이터 속성 기반)
      const sortType = this.dataset.sort;
      sortProducts(sortType);
    });
  });

  // 다른 곳 클릭 시 드롭다운 닫기
  document.addEventListener("click", function (e) {
    if (!sortDropdown.contains(e.target)) {
      sortDropdown.classList.remove("active");
    }
  });
}

// 제품 정렬 함수
function sortProducts(sortType) {
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) return;

  const products = Array.from(productsGrid.querySelectorAll(".product-card"));

  products.sort((a, b) => {
    switch (sortType) {
      case "popular":
        // 리뷰 수 기준 정렬 (많은 순)
        const reviewsA = parseInt(
          a.querySelector(".reviews")?.textContent.replace(/[()]/g, "") || "0"
        );
        const reviewsB = parseInt(
          b.querySelector(".reviews")?.textContent.replace(/[()]/g, "") || "0"
        );
        return reviewsB - reviewsA;

      case "recent":
        // 신상품(NEW 태그) 먼저 정렬
        const isNewA = a.querySelector(".product-badge.new") !== null;
        const isNewB = b.querySelector(".product-badge.new") !== null;
        return isNewB - isNewA;

      case "price-low":
        // 가격 낮은 순
        const priceA = parseInt(
          a
            .querySelector(".current-price")
            ?.textContent.replace(/[^0-9]/g, "") || "0"
        );
        const priceB = parseInt(
          b
            .querySelector(".current-price")
            ?.textContent.replace(/[^0-9]/g, "") || "0"
        );
        return priceA - priceB;

      case "price-high":
        // 가격 높은 순
        const priceHighA = parseInt(
          a
            .querySelector(".current-price")
            ?.textContent.replace(/[^0-9]/g, "") || "0"
        );
        const priceHighB = parseInt(
          b
            .querySelector(".current-price")
            ?.textContent.replace(/[^0-9]/g, "") || "0"
        );
        return priceHighB - priceHighA;

      case "discount":
        // 할인율 높은 순
        const discountA = parseInt(
          a.querySelector(".discount")?.textContent.replace(/[^0-9]/g, "") ||
            "0"
        );
        const discountB = parseInt(
          b.querySelector(".discount")?.textContent.replace(/[^0-9]/g, "") ||
            "0"
        );
        return discountB - discountA;

      default:
        return 0;
    }
  });

  // 정렬된 제품을 그리드에 다시 추가
  products.forEach((product) => {
    productsGrid.appendChild(product);
  });
}

// 필터 모달 초기화
function initFilterModal() {
  const filterBtn = document.querySelector(".filter-btn");
  const filterModal = document.querySelector(".filter-modal");
  const modalClose = document.querySelector(".modal-close");
  const modalOverlay = document.querySelector(".modal-overlay");
  const resetBtn = document.querySelector(".reset-btn");
  const applyBtn = document.querySelector(".apply-btn");

  if (!filterBtn || !filterModal || !modalClose || !modalOverlay) return;

  // 모달 열기
  filterBtn.addEventListener("click", function () {
    filterModal.classList.add("active");
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // 스크롤 방지
  });

  // 모달 닫기 함수
  function closeModal() {
    filterModal.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // 스크롤 복원
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // 초기화 버튼
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      // 체크박스 초기화
      const checkboxes = filterModal.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });

      // 가격 범위 초기화
      const minPrice = filterModal.querySelector(".min-price");
      const maxPrice = filterModal.querySelector(".max-price");
      const rangeInput = filterModal.querySelector(".range");

      if (minPrice && maxPrice && rangeInput) {
        minPrice.value = "0";
        maxPrice.value = "50000";
        rangeInput.value = "50000";
      }
    });
  }

  // 적용 버튼
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      // 필터 적용 로직
      applyFilters();
      closeModal();
    });
  }

  // 가격 범위 슬라이더 연동
  const rangeInput = filterModal.querySelector(".range");
  const maxPrice = filterModal.querySelector(".max-price");

  if (rangeInput && maxPrice) {
    rangeInput.addEventListener("input", function () {
      maxPrice.value = this.value;
    });

    maxPrice.addEventListener("input", function () {
      rangeInput.value = this.value;
    });
  }
}

// 필터 적용 함수
function applyFilters() {
  const filterModal = document.querySelector(".filter-modal");
  if (!filterModal) return;

  // 선택된 카테고리 가져오기
  const selectedCategories = [];
  const categoryCheckboxes = filterModal.querySelectorAll(
    '.checkbox-group:first-child input[type="checkbox"]'
  );

  categoryCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      // 체크박스 라벨 텍스트 가져오기
      const label = checkbox.closest(".checkbox-label").textContent.trim();
      selectedCategories.push(label);
    }
  });

  // 가격 범위 가져오기
  const minPrice = parseInt(
    filterModal.querySelector(".min-price").value || "0"
  );
  const maxPrice = parseInt(
    filterModal.querySelector(".max-price").value || "50000"
  );

  // 할인상품 필터 가져오기
  const discountOnly = filterModal.querySelector(
    '.filter-group:last-child input[type="checkbox"]'
  ).checked;

  // 제품 필터링
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    // 카테고리 일치 여부
    const category = product.dataset.category;
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(category);

    // 가격 일치 여부
    const price = parseInt(
      product
        .querySelector(".current-price")
        ?.textContent.replace(/[^0-9]/g, "") || "0"
    );
    const priceMatch = price >= minPrice && price <= maxPrice;

    // 할인 상품 일치 여부
    const hasDiscount = product.querySelector(".discount") !== null;
    const discountMatch = !discountOnly || hasDiscount;

    // 조건 모두 만족시 표시
    if (categoryMatch && priceMatch && discountMatch) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// 서브메뉴 토글 초기화
function initSubmenuToggle() {
  const submenuToggles = document.querySelectorAll(".submenu-toggle");

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      // 토글 버튼 상태 변경
      this.classList.toggle("active");

      // 서브메뉴 표시/숨김
      const submenu = this.nextElementSibling;
      submenu.classList.toggle("active");

      // 메뉴 항목 표시 조정
      const menuItem = this.closest(".menu-item");
      menuItem.classList.toggle("expanded");
    });
  });

  // 액티브 메뉴 자동 펼치기
  const activeMenuItem = document.querySelector(
    ".menu-item:has(.menu-link.active)"
  );

  if (activeMenuItem && activeMenuItem.classList.contains("has-submenu")) {
    const submenuToggle = activeMenuItem.querySelector(".submenu-toggle");
    const submenu = activeMenuItem.querySelector(".submenu");

    submenuToggle.classList.add("active");
    submenu.classList.add("active");
    activeMenuItem.classList.add("expanded");
  }
}

// 스와이퍼 초기화
function initSwiper() {
  if (typeof Swiper === "undefined" || !document.querySelector(".app-swiper"))
    return;

  new Swiper(".app-swiper", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// URL 파라미터 처리
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  if (categoryParam) {
    // 필터 탭에서 해당 카테고리 찾기
    const filterTab = document.querySelector(
      `.filter-tab[data-filter="${categoryParam}"]`
    );

    if (filterTab) {
      // 필터 탭 클릭 이벤트 트리거
      filterTab.click();
    } else {
      // 서브메뉴에 해당 카테고리가 있는지 확인
      const categoryLinks = document.querySelectorAll(".submenu a");

      categoryLinks.forEach((link) => {
        if (link.textContent.trim() === categoryParam) {
          // 해당 카테고리의 상위 메뉴 펼치기
          const menuItem = link.closest(".menu-item.has-submenu");
          if (menuItem) {
            const submenuToggle = menuItem.querySelector(".submenu-toggle");
            const submenu = menuItem.querySelector(".submenu");

            submenuToggle.classList.add("active");
            submenu.classList.add("active");
            menuItem.classList.add("expanded");
          }
        }
      });
    }
  }
}

// 찜 버튼 토글
function initWishButtons() {
  const wishButtons = document.querySelectorAll(".wish-btn");

  wishButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.classList.toggle("active");

      // 실제로는 여기에 찜 API 호출 로직 추가
    });
  });
}
