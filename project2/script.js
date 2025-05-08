// 문서가 완전히 로드된 후 스크립트 실행
document.addEventListener("DOMContentLoaded", function () {
  // 메인 메뉴의 모든 상위 항목 선택
  const menuItems = document.querySelectorAll(".nav-menu > li");

  // 각 메뉴 항목에 이벤트 리스너 추가
  menuItems.forEach((item) => {
    const submenu = item.querySelector(".submenu");
    if (!submenu) return; // 서브메뉴가 없는 항목은 건너뛰기

    // 지연 시간을 저장할 변수 (마우스가 메뉴에서 나갈 때 사용)
    let timeout;

    // 마우스가 메뉴 항목에 들어왔을 때
    item.addEventListener("mouseenter", function () {
      // 이전 타임아웃 취소 (있다면)
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // 서브메뉴에 active 클래스 추가
      submenu.classList.add("active");
    });

    // 마우스가 메뉴 항목에서 나갔을 때
    item.addEventListener("mouseleave", function () {
      // 약간의 지연 시간을 두어 사용자가 실수로 메뉴에서 벗어났을 때 즉시 닫히지 않도록 함
      timeout = setTimeout(() => {
        submenu.classList.remove("active");
      }, 50); // 50ms 후에 닫힘
    });
  });

  // 모바일 환경에서의 터치 이벤트도 처리
  if ("ontouchstart" in window) {
    menuItems.forEach((item) => {
      const submenu = item.querySelector(".submenu");
      if (!submenu) return;

      item.addEventListener("touchstart", function (e) {
        // 현재 메뉴에 서브메뉴가 표시되어 있지 않다면
        if (!submenu.classList.contains("active")) {
          e.preventDefault(); // 링크 이동 방지

          // 다른 모든 서브메뉴 닫기
          document.querySelectorAll(".submenu.active").forEach((menu) => {
            if (menu !== submenu) {
              menu.classList.remove("active");
            }
          });

          // 현재 서브메뉴 열기
          submenu.classList.add("active");
        }
      });
    });

    // 서브메뉴 영역 외 터치 시 모든 서브메뉴 닫기
    document.addEventListener("touchstart", function (e) {
      const target = e.target;
      if (!target.closest(".nav-menu")) {
        document.querySelectorAll(".submenu.active").forEach((menu) => {
          menu.classList.remove("active");
        });
      }
    });
  }

  // URL에서 카테고리 파라미터 확인 및 처리
  setTimeout(function () {
    try {
      // URL에서 카테고리 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get("category");

      // 모든 필터 버튼
      const allButtons = Array.from(document.querySelectorAll(".filter-btn"));

      // 카테고리 파라미터가 있으면 해당 필터 버튼 활성화
      if (categoryParam) {
        // 정확히 텍스트가 일치하는 버튼 찾기
        const matchingFilterBtn = allButtons.find(
          (btn) => btn.textContent.trim() === categoryParam
        );

        if (matchingFilterBtn) {
          // 모든 버튼의 active 클래스 제거
          allButtons.forEach((btn) => btn.classList.remove("active"));
          // 해당 버튼에 active 클래스 추가
          matchingFilterBtn.classList.add("active");

          // 제품 필터링 (product-card와 product-item 모두 처리)
          const productCards = document.querySelectorAll(".product-card");
          const productItems = document.querySelectorAll(".product-item");

          const products = [...productCards, ...productItems];

          products.forEach((card) => {
            if (
              categoryParam === "전체" ||
              card.dataset.category === categoryParam
            ) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        }
      } else {
        // 페이지가 product2-page인 경우, "전체" 버튼 활성화 건너뛰기
        if (window.location.pathname.toLowerCase().includes("product2-page")) {
          // '전체' 버튼 활성화 건너뛰기 - 이미 HTML에서 설정된 active 클래스 유지
        } else {
          // 다른 페이지의 경우 "전체" 버튼 활성화
          const allBtn = allButtons.find(
            (btn) => btn.textContent.trim() === "전체"
          );
          if (allBtn) {
            allBtn.classList.add("active");
          }
        }
      }
    } catch (error) {
      console.error("URL 파라미터 처리 중 오류:", error);
    }
  }, 0);

  // 서브메뉴 링크 처리 (제품 페이지 내에서 클릭 시)
  const productSubmenuLinks = document.querySelectorAll(
    ".nav-item:first-child .submenu .nav-link"
  );

  if (productSubmenuLinks.length > 0) {
    productSubmenuLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // 현재 페이지가 제품 페이지인 경우에만 기본 동작 방지
        const currentPath = window.location.pathname.toLowerCase();
        const isProductPage = currentPath.includes("sub1.html".toLowerCase());

        if (isProductPage) {
          e.preventDefault();

          const submenuCategory = this.textContent.trim();
          const allButtons = Array.from(
            document.querySelectorAll(".filter-btn")
          );

          const matchingFilterBtn = allButtons.find(
            (btn) => btn.textContent.trim() === submenuCategory
          );

          if (matchingFilterBtn) {
            matchingFilterBtn.click();
          }
        }
      });
    });
  }

  // 필터 버튼 클릭 이벤트 처리
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const productItems = document.querySelectorAll(".product-item");

  if (
    filterButtons.length > 0 &&
    (productCards.length > 0 || productItems.length > 0)
  ) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // 활성화된 버튼 스타일 변경
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // 선택된 카테고리 가져오기
        const selectedCategory = this.textContent.trim();

        // 모든 제품 카드와 아이템 순회
        const products = [...productCards, ...productItems];

        products.forEach((card) => {
          if (
            selectedCategory === "전체" ||
            card.dataset.category === selectedCategory
          ) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Swiper 초기화 (Swiper가 페이지에 있을 경우에만 실행)
  if (document.querySelector(".mySwiper") && typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
});
