/**
 * Cosmic Portfolio - 메인 자바스크립트
 * 김성민의 우주 테마 포트폴리오
 */

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 로딩 화면 처리
  const loadingScreen = document.querySelector(".loading-screen");
  const rocket = document.getElementById("rocket-element");
  
  console.log("DOM 로드: 로켓 초기화 준비");
  
  // 로켓 인스턴스 즉시 초기화 (지연 없이)
  if (!window.rocketInstance && typeof ImprovedRocketAnimation === 'function') {
    console.log("로켓 인스턴스 초기화 중...");
    try {
      window.rocketInstance = new ImprovedRocketAnimation();
      window.COSMIC_PORTFOLIO = {
        rocket: window.rocketInstance
      };
      console.log("로켓 인스턴스 생성 완료");
    } catch (error) {
      console.error("로켓 인스턴스 생성 오류:", error);
    }
  }

  window.addEventListener("load", () => {
    // 로딩 화면 숨기기
    setTimeout(() => {
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.5, // 로딩화면 전환 속도 단축
        onComplete: () => {
          // 로딩 화면 숨김
          loadingScreen.style.display = "none";
          loadingScreen.style.visibility = "hidden";
          loadingScreen.style.zIndex = "-1";
          
          // 인트로 애니메이션 시작
          startIntroAnimation();

          // 로켓 활성화 확인
          if (rocket) {
            // 로켓 부스터 효과
            rocket.classList.add("rocket-boost");
            setTimeout(() => {
              rocket.classList.remove("rocket-boost");
            }, 1000);
            
            // 로켓 인스턴스 활성화
            if (window.rocketInstance) {
              console.log("로켓 인스턴스 활성화");
              
              // 강제로 활성화 상태 설정
              window.rocketInstance.isActive = true;
              window.rocketInstance.isPaused = false;
              
              // 마우스 추적 강제 활성화
              if (typeof window.rocketInstance.setupMouseTracking === 'function') {
                window.rocketInstance.setupMouseTracking();
              } else if (typeof window.rocketInstance.setupMouseRotation === 'function') {
                window.rocketInstance.setupMouseRotation();
              }
              
              // 초기 위치 강제 업데이트
              if (typeof window.rocketInstance.updateRocketPosition === 'function') {
                // 마우스 포인터 위치 강제 설정 (화면 중앙)
                window.rocketInstance.mouseX = window.innerWidth / 2;
                window.rocketInstance.mouseY = window.innerHeight / 2;
                window.rocketInstance.updateRocketPosition();
              }
            } else {
              console.warn("로켓 인스턴스가 없습니다. 새로 생성합니다.");
              try {
                // 로켓 인스턴스 새로 생성
                window.rocketInstance = new ImprovedRocketAnimation();
                window.COSMIC_PORTFOLIO = {
                  rocket: window.rocketInstance
                };
                window.rocketInstance.isActive = true;
              } catch (error) {
                console.error("로켓 인스턴스 재생성 오류:", error);
              }
            }
          } else {
            console.error("로켓 요소를 찾을 수 없습니다.");
          }
        }
      });
    }, 300); // 로딩 시간 단축 (500ms -> 300ms)
  });

  // 스크롤 시 내비게이션 스타일 변경
  const nav = document.querySelector(".main-nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // 모바일 메뉴 토글
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // 내비게이션 링크 클릭 시 부드러운 스크롤
  const navLink = document.querySelectorAll(".nav-link");

  navLink.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 모바일 메뉴 닫기
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");

      // 해당 섹션으로 스크롤
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth",
      });

      // 활성 링크 표시
      navLink.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 스크롤 위치에 따른 활성 메뉴 표시
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (
        pageYOffset >= sectionTop &&
        pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLink.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
    
    // 네비게이션 바 업데이트
    updateNavbar();
  });
  
  // 페이지 로드 시 현재 활성 섹션에 맞게 네비게이션 바 업데이트
  updateNavbar();
  
  // 네비게이션 바 업데이트 함수
  function updateNavbar() {
    // 현재 활성화된 링크 찾기
    const activeLink = document.querySelector('.nav-link.active');
    
    if (activeLink) {
      // 활성 링크의 위치와 너비 가져오기
      const linkRect = activeLink.getBoundingClientRect();
      const linkWidth = linkRect.width;
      const linkLeft = linkRect.left;
      
      // active-indicator 요소 가져오기 (없으면 생성)
      let activeIndicator = document.querySelector('.active-indicator');
      
      if (!activeIndicator) {
        activeIndicator = document.createElement('div');
        activeIndicator.className = 'active-indicator';
        document.querySelector('.nav-links').appendChild(activeIndicator);
        
        // 인디케이터 스타일 설정
        activeIndicator.style.position = 'absolute';
        activeIndicator.style.bottom = '-4px';
        activeIndicator.style.height = '3px';
        activeIndicator.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
        activeIndicator.style.borderRadius = '2px';
        activeIndicator.style.transition = 'all 0.3s ease';
      }
      
      // 인디케이터 위치와 너비 설정
      activeIndicator.style.width = `${linkWidth}px`;
      activeIndicator.style.left = `${linkLeft}px`;
      activeIndicator.style.opacity = '1';
    }
  }

  // 포트폴리오 필터링
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // 페이지 로드 시 '전체' 탭이 활성화되도록 설정
  const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilterBtn) {
    // 모든 버튼에서 active 클래스 제거
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    // '전체' 버튼에 active 클래스 추가
    allFilterBtn.classList.add("active");

    // 모든 포트폴리오 아이템 표시
    portfolioItems.forEach((item) => {
      item.style.display = "block";
      gsap.to(item, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        clearProps: "opacity,scale",
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 활성 버튼 표시
      filterBtns.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");

      // 필터링
      const filterValue = btn.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");

        if (filterValue === "all" || filterValue === category) {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            clearProps: "opacity,scale",
            onStart: () => {
              item.style.display = "block";
              item.style.pointerEvents = "auto";
            },
          });
        } else {
          gsap.to(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            onComplete: () => {
              // 숨김 처리를 display: none으로 변경하여 그리드가 자동정렬되도록 함
              item.style.display = "none";
              item.style.pointerEvents = "none";
            },
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
          item.style.display = "block";
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            clearProps: "opacity,scale",
          });
        });
      }, 300);
    });
  }

  // 연락 폼 제출 처리
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 폼 데이터 수집
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      // 여기에 폼 제출 로직 구현 (실제 사이트에서는 이메일 전송 등)
      console.log("Form submitted:", formData);

      // 성공 메시지 표시 (간단한 구현)
      alert("메시지가 성공적으로 전송되었습니다!");

      // 폼 초기화
      contactForm.reset();
    });
  }

  // 스킬 프로그레스 바 애니메이션
  // 참고: 프로필로 병합되어 profile-tabs.js로 이동
  // 이 코드는 이전 버전과의 호환성을 위해 유지됨
  const skillLevels = document.querySelectorAll(".skill-level");

  function animateSkills() {
    skillLevels.forEach((skill) => {
      const level = skill.getAttribute("data-level");
      const progress = skill.querySelector(".skill-progress");

      gsap.to(progress, {
        width: `${level}%`,
        duration: 1.5,
        ease: "power2.out",
      });
    });
  }

  // 프로필 섹션에서 스크롤 감지하여 스킬 애니메이션 시작
  const profileSection = document.querySelector(".profile-section");

  // 스크롤 트리거 설정
  if (profileSection) {
    ScrollTrigger.create({
      trigger: profileSection,
      start: "top 80%",
      onEnter: animateSkills,
      once: true,
    });
  }

  // 컨택트 폼 포커스 효과
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );

  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      if (input.value === "") {
        input.parentElement.classList.remove("focused");
      }
    });
  });
});

// 페이지 로드 완료 후 인트로 애니메이션 시작
function startIntroAnimation() {
  // 헤더 텍스트 애니메이션
  const nameElement = document.querySelector(".name");
  const titleElement = document.querySelector(".title");
  const taglineElement = document.querySelector(".tagline");
  const ctaButtons = document.querySelector(".cta-buttons");

  // 타임라인 생성
  const introTl = gsap.timeline();

  introTl
    .from(nameElement, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
    .from(
      titleElement,
      {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .from(
      taglineElement,
      {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .from(
      ctaButtons,
      {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5"
    );

  // 부유하는 행성 애니메이션
  const planets = document.querySelectorAll(".planet, .satellite");

  planets.forEach((planet, index) => {
    gsap.to(planet, {
      y: `random(-20, 20)`,
      x: `random(-20, 20)`,
      rotation: `random(-10, 10)`,
      duration: `random(3, 6)`,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.2,
    });
  });

  // 내비게이션 애니메이션
  const navLinks = document.querySelectorAll(".nav-links li");
  const logo = document.querySelector(".logo");

  gsap.from(logo, {
    y: -30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(navLinks, {
    y: -30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
  });
}
