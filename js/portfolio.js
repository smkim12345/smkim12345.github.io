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
    item.style.opacity = "1";
    item.style.transform = "scale(1)";
    item.style.pointerEvents = "auto";

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
      
      // 현재 카테고리 저장 (페이지 이동 후 돌아올 때 사용)
      sessionStorage.setItem('lastPortfolioFilter', filterValue);

      // GSAP으로 부드러운 애니메이션 적용
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        
        if (filterValue === "all" || category === filterValue) {
          // 보여질 항목
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onStart: () => {
              item.style.display = "block";
              item.style.pointerEvents = "auto";
            }
          });
        } else {
          // 숨겨질 항목
          gsap.to(item, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              item.style.display = "none";
              item.style.pointerEvents = "none";
            }
          });
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
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onStart: () => {
              item.style.display = "block";
              item.style.pointerEvents = "auto";
            }
          });
        });
      }, 300);
    });
  }
  
  // 페이지 로드 시 마지막으로 선택한 필터 복원
  const lastFilter = sessionStorage.getItem('lastPortfolioFilter');
  if (lastFilter) {
    const targetButton = document.querySelector(`.filter-btn[data-filter="${lastFilter}"]`);
    if (targetButton) {
      setTimeout(() => {
        targetButton.click();
      }, 500);
    }
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
      // 스크롤 위치 저장
      const scrollPosition = window.scrollY;
      
      // 모달 닫기
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      
      // 스크롤 위치 복원
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 100);
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
      // 스크롤 위치 저장
      window.modalScrollPosition = window.scrollY;
      
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

  if (!canvas) {
    console.warn("space-background 캔버스를 찾을 수 없습니다");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("캔버스 컨텍스트를 가져올 수 없습니다");
    return;
  }
  
  // 애니메이션이 이미 실행 중인지 확인 (중복 실행 방지)
  if (window.particleAnimationRunning) {
    console.log("파티클 애니메이션이 이미 실행 중입니다");
    return;
  }
  
  // 전역 플래그 설정
  window.particleAnimationRunning = true;
  
  const particlesArray = [];
  // 파티클 개수를 화면 크기에 맞게 최적화 (기기 성능에 따라 조정)
  const isMobile = window.innerWidth <= 768;
  const numberOfParticles = isMobile ? 
    Math.min(30, Math.floor(window.innerWidth / 25)) : 
    Math.min(60, Math.floor(window.innerWidth / 20));

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
    
    // 캔버스 크기가 변경되면 파티클을 다시 생성
    if (particlesArray.length > 0) {
      particlesArray.length = 0;
      init();
    }
  }

  // 초기 파티클 생성
  function init() {
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  // 애니메이션 최적화 (requestAnimationFrame 사용)
  let animationId = null;
  let lastFrameTime = 0;
  // 모바일 기기에서는 더 적은 FPS로 렌더링 (배터리 최적화)
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;
  
  function animate(timestamp = 0) {
    // 페이지가 숨겨져 있을 때는 애니메이션 일시 중지 (성능 최적화)
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    // 프레임 속도 제한 (성능 최적화)
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < frameInterval) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime = timestamp - (elapsed % frameInterval);
    
    // 캔버스 지우기 (높은 투명도 적용으로 잔상 효과)
    ctx.fillStyle = 'rgba(10, 13, 31, 0.2)';  // 배경 색상에 맞춘 높은 투명도의 색상
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    animationId = requestAnimationFrame(animate);
  }

  // 이벤트 리스너
  window.addEventListener("resize", resizeCanvas);
  
  // 가시성 변경 감지 (탭 전환 시 성능 최적화)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 페이지가 숨겨져 있을 때 애니메이션 일시 중지
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (!animationId) {
      // 페이지가 다시 보일 때 애니메이션 재개
      animate();
    }
  });

  // 초기화 및 애니메이션 시작
  resizeCanvas();
  init();
  animate();
  
  console.log("우주 배경 파티클 효과 초기화 완료");
}
