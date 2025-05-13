/**
 * Cosmic Portfolio - 포트폴리오 관련 자바스크립트
 * 김성민의 우주 테마 포트폴리오
 */

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 로딩 화면 처리
  setTimeout(function () {
    document.querySelector(".loading-screen").style.opacity = "0";
    setTimeout(function () {
      document.querySelector(".loading-screen").style.display = "none";
    }, 500);
  }, 1500);

  // 스크롤 이벤트에 따른 네비게이션 스타일 변경
  window.addEventListener("scroll", function () {
    const nav = document.querySelector(".main-nav");
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // 모바일 메뉴 토글
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }

  // 네비게이션 링크 클릭 시 스크롤 애니메이션
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // 모바일 메뉴가 열려있으면 닫기
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
      }

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // 현재 활성화된 섹션에 따라 네비게이션 링크 활성화
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // 프로필 섹션의 탭 기능 제거 - 모든 콘텐츠가 순차적으로 표시됨

  // 스킬 프로그레스 바 애니메이션
  function animateSkills() {
    const skillItems = document.querySelectorAll(".skill-level");

    skillItems.forEach((item) => {
      const level = item.getAttribute("data-level");
      const progress = item.querySelector(".skill-progress");

      progress.style.width = `${level}%`;
    });
  }

  // 스크롤 시 스킬 애니메이션 실행
  const skillsSection = document.getElementById("skills-tab");

  if (skillsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(skillsSection);
  } else {
    // 탭이 없는 경우 페이지 로드 시 스킬 애니메이션 실행
    animateSkills();
  }

  // 포트폴리오 필터링
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // 초기 상태 설정 - '전체' 탭 활성화
  const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilterBtn) {
    // 모든 버튼에서 active 클래스 제거
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    // '전체' 버튼에 active 클래스 추가
    allFilterBtn.classList.add("active");
  }

  // 모든 포트폴리오 아이템 표시
  portfolioItems.forEach((item) => {
    item.classList.add("show");
    item.classList.remove("hide");
    item.style.display = "block";

    // 이미지 영역에 클릭 이벤트 추가
    const imageContainer = item.querySelector(".portfolio-image");
    if (imageContainer) {
      imageContainer.addEventListener("click", function (e) {
        // 자세히 보기 버튼 클릭 시 이벤트 중복 방지
        if (!e.target.closest(".view-project")) {
          e.preventDefault();
          e.stopPropagation();

          // 이미지 정보 가져오기
          const img = this.querySelector("img");
          const imgSrc = img.getAttribute("src");
          const imgAlt = img.getAttribute("alt");

          // 모달 열기 함수 호출
          if (window.updatePortfolioModal) {
            // 이미지 경로에서 프로젝트 ID 추출
            const filename = imgSrc.split("/").pop();
            const projectId = filename.split(".")[0];

            // 모달 업데이트
            window.updatePortfolioModal(projectId);

            // 모달 활성화
            const modal = document.querySelector(".portfolio-pdf-modal");
            if (modal) {
              modal.classList.add("show");
              document.body.style.overflow = "hidden";
            }
          }
        }
      });
    }
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 활성 버튼 변경
      filterBtns.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.classList.remove("hide");
          item.classList.add("show");
          item.style.display = "block";
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
          // 숨김 처리를 display: none으로 변경하여 그리드가 자동정렬되도록 함
          item.style.display = "none";
          item.style.opacity = "0";
          item.style.pointerEvents = "none";
        }
      });
    });
  });

  // 포트폴리오 섹션으로 이동할 때 '전체' 탭 자동 활성화
  const portfolioLink = document.querySelector('a[href="#portfolio"]');
  if (portfolioLink) {
    portfolioLink.addEventListener("click", () => {
      setTimeout(() => {
        // 모든 버튼에서 active 클래스 제거
        filterBtns.forEach((btn) => btn.classList.remove("active"));
        // '전체' 버튼에 active 클래스 추가
        if (allFilterBtn) allFilterBtn.classList.add("active");

        // 모든 포트폴리오 아이템 표시
        portfolioItems.forEach((item) => {
          item.classList.remove("hide");
          item.classList.add("show");
          item.style.display = "block";
        });
      }, 300);
    });
  }

  // 포트폴리오 모달
  const portfolioLinks = document.querySelectorAll(".view-project");
  const portfolioImages = document.querySelectorAll(".portfolio-image");
  const modal = document.querySelector(".portfolio-modal");
  const closeModal = document.querySelector(".close-modal");

  if (modal) {
    // 자세히 보기 버튼 클릭 이벤트
    if (portfolioLinks.length > 0) {
      portfolioLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();

          // 부모 요소에서 프로젝트 정보 찾기
          const portfolioItem = this.closest(".portfolio-item");
          const imgSrc = portfolioItem.querySelector("img").getAttribute("src");
          const imgAlt = portfolioItem.querySelector("img").getAttribute("alt");

          // 모달 열기
          openModal(imgSrc, imgAlt);
        });
      });
    }

    // 이미지 클릭 이벤트 추가
    if (portfolioImages.length > 0) {
      portfolioImages.forEach((image) => {
        image.addEventListener("click", function (e) {
          // 클릭된 요소가 view-project 링크가 아닐 경우에만 처리
          if (!e.target.closest(".view-project")) {
            e.preventDefault();

            // 이미지 정보 가져오기
            const imgSrc = this.querySelector("img").getAttribute("src");
            const imgAlt = this.querySelector("img").getAttribute("alt");

            // 모달 열기
            openModal(imgSrc, imgAlt);
          }
        });
      });
    }

    // 모달 닫기 버튼
    closeModal.addEventListener("click", function () {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    // 이미지 경로에서 프로젝트 ID 추출 함수
    function getProjectIdFromPath(path) {
      if (!path) return null;

      // 경로에서 파일명 추출
      const filename = path.split("/").pop();
      // 확장자 제거
      const filenameWithoutExt = filename.split(".")[0];

      return filenameWithoutExt;
    }

    // 모달 열기 함수
    function openModal(imgSrc, imgAlt) {
      // 모달 활성화
      modal.classList.add("active");
      document.body.classList.add("modal-open");

      // 이미지 경로에서 프로젝트 ID 추출
      const projectId = getProjectIdFromPath(imgSrc);

      // 포트폴리오 모달 컨텐츠 업데이트
      if (window.updatePortfolioModal) {
        window.updatePortfolioModal(projectId);
      } else {
        console.warn("updatePortfolioModal 함수를 찾을 수 없습니다.");
      }
    }
  }

  // 우주 배경 파티클 생성
  createParticles();
});

// 우주 배경 파티클 생성
function createParticles() {
  const canvas = document.getElementById("space-background");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particlesArray = [];
  // 파티클 개수를 반으로 줄임 (최적화)
  const numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 20));

  // 파티클 클래스
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 0.5;
      this.speedX = Math.random() * 0.3 - 0.15; // 속도 감소
      this.speedY = Math.random() * 0.3 - 0.15; // 속도 감소
      this.color = this.getRandomColor();
      this.opacity = Math.random() * 0.5 + 0.5;
      this.blinking = Math.random() > 0.8;
      this.blinkingSpeed = Math.random() * 0.02 + 0.005;
      this.blinkingDirection = 1;
    }

    getRandomColor() {
      const colors = [
        "#ffffff", // 흰색
        "#f8f7ff", // 연한 흰색
        "#e3e0ff", // 연한 보라색
        "#d1edff", // 연한 파란색
        "#fffaeb", // 연한 노란색
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 화면 경계 처리
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // 깜박임 효과
      if (this.blinking) {
        this.opacity += this.blinkingSpeed * this.blinkingDirection;

        if (this.opacity >= 1) {
          this.opacity = 1;
          this.blinkingDirection = -1;
        } else if (this.opacity <= 0.2) {
          this.opacity = 0.2;
          this.blinkingDirection = 1;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // 캔버스 크기 설정
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 초기 파티클 생성
  function init() {
    resizeCanvas();
    particlesArray.length = 0;

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  // 애니메이션
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    requestAnimationFrame(animate);
  }

  // 이벤트 리스너
  window.addEventListener("resize", init);

  // 초기화 및 애니메이션 시작
  init();
  animate();
}
