// 포트폴리오 이미지 모달 기능
class PortfolioImageModal {
  constructor() {
    this.modal = null;
    this.portfolioItems = [];
    this.savedScrollPosition = 0;
    this.init();
  }

  // 간단한 모바일 뷰어 (현대적인 디자인)
  showMobilePreview(url, title, preserveDeviceSize = false) {
    // 기존 목업이 있으면 제거
    const existingMockup = document.getElementById("mobileMockup");
    if (existingMockup) {
      existingMockup.remove();
    }

    // 피그마 URL 파라미터 조정
    let adjustedUrl = url;
    if (url.includes("embed.figma.com") && preserveDeviceSize) {
      // 피그마 URL에서 scale-down을 scale-to-fit으로 변경하고 모바일 프레임 제거
      adjustedUrl = url
        .replace("scaling=scale-down", "scaling=scale-to-fit")
        .replace("content-scaling=fixed", "hide-ui=1");
    }

    // 현재 시간 구하기
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    // 새로운 모바일 목업 생성
    const mobileMockup = document.createElement("div");
    mobileMockup.id = "mobileMockup";

    // 피그마 프로토타입인 경우 모바일 디바이스 스타일 적용
    if (preserveDeviceSize && url.includes("embed.figma.com")) {
      mobileMockup.classList.add("figma-mobile-device");
      mobileMockup.innerHTML = `
        <button id="closeButton" type="button" aria-label="닫기"></button>
        <div id="dynamicIsland"></div>
        <div id="statusBar">
          <span>${currentTime}</span>
          <span><i class="fas fa-wifi"></i> <i class="fas fa-battery-three-quarters"></i></span>
        </div>
        <div id="mobileLoading"></div>
        <iframe id="mobileIframe" src="${adjustedUrl}" scrolling="yes"></iframe>
        <div id="homeIndicator"></div>
        <div id="reflection"></div>
      `;
    } else {
      mobileMockup.innerHTML = `
        <button id="closeButton" type="button" aria-label="닫기"></button>
        <div id="dynamicIsland"></div>
        <div id="statusBar">
          <span>${currentTime}</span>
          <span><i class="fas fa-wifi"></i> <i class="fas fa-battery-three-quarters"></i></span>
        </div>
        <div id="mobileLoading"></div>
        <iframe id="mobileIframe" src="${adjustedUrl}" scrolling="yes"></iframe>
        <div id="homeIndicator"></div>
        <div id="reflection"></div>
      `;
    }

    document.body.appendChild(mobileMockup);

    // 닫기 버튼에 직접 onclick 이벤트 할당
    document.getElementById("closeButton").onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.hideMobilePreview();
      return false;
    };

    // 모바일 목업 표시 (애니메이션 효과 추가)
    setTimeout(() => {
      mobileMockup.style.display = "block";
      setTimeout(() => {
        mobileMockup.style.opacity = "1";
        mobileMockup.style.transform = "translateX(-50%) scale(1)";
      }, 50);
    }, 100);

    // iframe 로드 이벤트
    const iframe = document.getElementById("mobileIframe");
    const loading = document.getElementById("mobileLoading");

    // iframe 스타일 직접 설정
    if (preserveDeviceSize && url.includes("embed.figma.com")) {
      // 피그마 프로토타입의 경우 모바일 디바이스 스타일 적용
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.transformOrigin = "center center";
      iframe.style.transform = "none";
      iframe.style.margin = "0";
    } else if (preserveDeviceSize) {
      // 일반 preserve 모드 (기존 스타일)
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.transformOrigin = "center center";
      iframe.style.transform = "none";
      iframe.style.margin = "0";

      // 목업 스타일 조정
      mobileMockup.classList.add("figma-prototype");
    } else {
      // 일반 모바일 사이트의 경우 기존 스타일 적용
      iframe.style.width = "600px";
      iframe.style.height = "140%";
      iframe.style.transformOrigin = "top left";
      iframe.style.transform = "scale(0.68)";
      iframe.style.margin = "40px 0";
    }

    iframe.style.display = "block";

    iframe.onload = () => {
      // 로딩 인디케이터 숨기기
      if (loading) {
        loading.style.display = "none";
      }

      // iframe 표시 애니메이션
      setTimeout(() => {
        iframe.classList.add("loaded");
      }, 200);

      // 피그마 프로토타입의 경우 스타일 조정하지 않음
      if (!preserveDeviceSize) {
        try {
          // 모바일 화면에 맞게 스타일 조정 시도
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;

          // 모바일 뷰포트 메타 태그 추가
          const meta = iframeDoc.createElement("meta");
          meta.name = "viewport";
          meta.content =
            "width=device-width, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes";

          if (iframeDoc.head) {
            iframeDoc.head.appendChild(meta);

            // 모바일 스타일 추가
            const style = iframeDoc.createElement("style");
            style.textContent = `
              body { 
                width: 100% !important; 
                max-width: 100% !important;
                overflow-x: hidden !important;
                zoom: 0.8;
                transform-origin: top center;
              }
              * { -webkit-tap-highlight-color: transparent; }
            `;
            iframeDoc.head.appendChild(style);
          }
        } catch (e) {
          console.log("iframe 컨텐츠 접근 제한 (크로스 오리진 정책)");
        }
      }
    };

    // 로딩 시간이 너무 오래 걸리면 로딩 인디케이터 숨기기
    setTimeout(() => {
      if (loading && loading.style.display !== "none") {
        loading.style.display = "none";
        iframe.classList.add("loaded");
      }
    }, 5000);
  }

  init() {
    this.createModal();
    this.createMobilePreviewStyles();
    this.bindEvents();
    this.updatePortfolioItems();
    this.exposeGlobalMethods();

    // 중앙화된 데이터 관리 시스템 확인
    if (window.COSMIC_PORTFOLIO) {
      console.log("중앙화된 포트폴리오 데이터 관리 시스템 사용 중");
    } else {
      console.warn("중앙화된 데이터 관리 시스템을 찾을 수 없습니다");
    }
  }

  // 모바일 미리보기 스타일 생성 (CSS 파일 사용)
  createMobilePreviewStyles() {
    // 스타일은 이제 mobile-viewer.css 파일에서 관리됨
    console.log("모바일 뷰어 스타일 로드 완료 (CSS 파일 사용)");
  }

  createModal() {
    // 모달 HTML 생성
    const modalHTML = `
            <div class="portfolio-pdf-modal" id="image-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-header-top">
                            <div class="modal-title">포트폴리오 상세보기</div>
                            <button class="modal-close" id="modal-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-links">
                            <a href="#" class="modal-link-btn" id="link-btn" style="display: none;">
                                <i class="fas fa-external-link-alt"></i>
                                웹
                            </a>
                        
                            <button class="modal-link-btn responsive-view-btn" id="responsive-view-btn" style="display: none;">
                                <i class="fas fa-tablet-alt"></i>
                                반응형
                            </button>
                             <a href="#" class="modal-link-btn" id="process-btn" style="display: none;">
                                <i class="fas fa-file-pdf"></i>
                                작업과정
                            </a>
                            <button class="modal-link-btn mobile-view-btn" id="mobile-view-btn" style="display: none;">
                                <i class="fas fa-mobile-alt"></i>
                                모바일
                            </button>
                        </div>
                    </div>
                    <div class="pdf-container">
                        <div class="modal-loading" id="modal-loading">
                            <div class="loading-spinner"></div>
                            <span>이미지를 불러오는 중...</span>
                        </div>
                        <img id="detail-image" style="display: none;">
                    </div>
                </div>
            </div>
        `;

    // body에 추가
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    this.modal = document.getElementById("image-modal");
  }

  bindEvents() {
    // 모달 닫기 버튼
    const closeBtn = document.getElementById("modal-close");
    closeBtn.addEventListener("click", () => this.closeModal());

    // 백그라운드 클릭시 모달 닫기
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.closeModal();
      }
    });
  }

  updatePortfolioItems() {
    // 포트폴리오 아이템 찾기
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    // 클릭 이벤트 연결
    portfolioItems.forEach((item) => {
      const image = item.querySelector(".portfolio-image");
      const viewButton = item.querySelector(".view-project");

      if (image) {
        // 이미지 클릭 이벤트
        image.addEventListener("click", (e) => {
          // 이미 .view-project 버튼을 클릭한 경우 이벤트 처리하지 않음
          if (e.target.closest(".view-project")) return;

          e.preventDefault();
          e.stopPropagation();
          this.handleProjectClick(item);
        });
      }

      if (viewButton) {
        // 자세히 보기 버튼 클릭 이벤트
        viewButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleProjectClick(item);
        });
      }
    });

    console.log(`포트폴리오 아이템 이벤트 처리 (${portfolioItems.length}개)`);
  }

  handleProjectClick(item) {
    // 클릭 시 현재 스크롤 위치 저장
    this.savedScrollPosition = window.scrollY || window.pageYOffset || 0;
    console.log("현재 스크롤 위치 저장:", this.savedScrollPosition);

    // 프로젝트 ID 추출
    const projectId = this.getProjectId(item);

    if (projectId) {
      try {
        // 프로젝트 데이터 가져오기
        const projectData = this.getProjectData(projectId);

        if (projectData) {
          // 모달 열기
          this.openModal(projectData);
        } else {
          console.error(
            `프로젝트 ID에 해당하는 데이터를 찾을 수 없음: ${projectId}`
          );
        }
      } catch (error) {
        console.error("프로젝트 모달 열기 오류:", error);
      }
    } else {
      console.error("유효한 프로젝트 ID를 찾을 수 없음");
    }
  }

  getProjectId(item) {
    // 먼저 data-project-id 속성 체크
    let projectId = item.getAttribute("data-project-id");

    // 없으면 이미지 경로에서 추출
    if (!projectId) {
      const img = item.querySelector("img");
      if (img) {
        projectId = this.getProjectIdFromPath(img.getAttribute("src"));
      }
    }

    // 마지막으로 클래스명에서 추출 시도
    if (!projectId) {
      const classes = item.className.split(" ");
      for (const cls of classes) {
        if (cls.startsWith("project-")) {
          projectId = cls.replace("project-", "");
          break;
        }
      }
    }

    return projectId;
  }

  getProjectData(projectId) {
    // 중앙화된 데이터 시스템 있으면 사용
    if (window.COSMIC_PORTFOLIO && window.COSMIC_PORTFOLIO.getProjectData) {
      return window.COSMIC_PORTFOLIO.getProjectData(projectId);
    }

    // 호환성을 위한 레거시 방식
    return this.getProjectDataLegacy(projectId);
  }

  // 이전 버전과의 호환성을 위해 유지하는 레거시 메서드
  getProjectIdFromPath(path) {
    if (!path) return null;

    // URL에서 파일명 추출
    let filename = path.split("/").pop();
    if (!filename) return null;

    // 확장자 제거
    let name = filename.split(".")[0];

    // 접두사 "섬네일_"이 있으면 프로젝트 ID로 사용
    if (name.startsWith("섬네일_")) {
      return name;
    }

    // 파일 이름에서 프로젝트 ID 추출 시도
    if (name.includes("_")) {
      // 언더스코어로 구분된 이름의 첫 부분 사용
      return name.split("_")[0];
    }

    return name;
  }

  // 이전 버전과의 호환성을 위해 유지하는 레거시 메서드
  getProjectDataLegacy(projectId) {
    // 하드코딩된 프로젝트 데이터 (이전 버전과의 호환성 유지)
    const projectsData = {
      // 트로피카나 프로젝트
      섬네일_트로피카나: {
        title: "트로피카나 스파클링 패키지 리디자인",
        imagePath: "images/트로피카나/상세_트로피카나.jpg",
        tools: ["Photoshop", "Illustrator"],
        process: "images/트로피카나/작업과정_트로피카나.pdf",
        category: "package",
      },

      // 투썸 프로젝트
      twosome: {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/투썸/상세_투썸.jpg",
        tools: ["Photoshop", "Illustrator"],
        category: "package",
      },
      섬네일_투썸: {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/투썸/상세_투썸.jpg",
        tools: ["Photoshop", "Illustrator"],
        category: "package",
      },

      // 갸스비 프로젝트
      gatsby: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        link: "images/갸스비/링크_갸스비 웹.url",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project2/index.html",
        hasMobile: true,
        mobileUrl: "https://smkim12345.github.io/project2mobile/index.html",
        category: "web",
      },
      섬네일_갸스비: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        link: "images/갸스비/링크_갸스비 웹.url",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project2/index.html",
        hasMobile: true,
        mobileUrl: "https://smkim12345.github.io/project2mobile/index.html",
        category: "web",
      },

      // 제네시스 프로젝트
      섬네일_제네시스: {
        title: "제네시스 웹 리디자인",
        imagePath: "images/제네시스/상세_제네시스.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/제네시스/링크_제네시스.url",
        process: "images/제네시스/작업과정_제네시스.pdf",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project1/index.html",
        category: "web",
      },

      // 맥딜리버리 프로젝트
      섬네일_맥도날드: {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/맥도날드/상세_맥도날드.jpg",
        tools: ["Adobe XD", "Photoshop"],
        hasMobile: true,
        mobileUrl:
          "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
        openInNewTab: true,
        category: "app",
      },

      // 리스크아이 프로젝트
      "섬네일_리스크아이 로고 디자인": {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
        process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
        category: "branding",
      },

      // 박람회 프로젝트
      섬네일_박람회: {
        title: "2025 국제인공지능 박람회 리플렛 디자인",
        imagePath: "images/박람회/상세_박람회.jpg",
        tools: ["Photoshop", "Illustrator"],
        category: "print",
      },

      // AI 박람회 프로젝트 (이전 데이터, 호환성을 위해 유지)
      "ai-expo": {
        title: "AI 박람회 리플렛",
        imagePath: "images/portfolio/ai-expo-detail.jpg",
        category: "print",
      },

      // 인스타그램 광고 배너
      "섬네일_인스타그램 광고배너디자인": {
        title: "인스타그램 광고 배너",
        imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
        tools: ["Photoshop", "Illustrator"],
        category: "web",
      },

      // 갤럭시 버즈 프로젝트
      "섬네일_갤럭시 버즈3프로 상세페이지": {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.jpg", // 확장자 수정: .png → .jpg
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        category: "web",
      },

      // 광고 포스터 프로젝트
      "섬네일_광고 포스터": {
        title: "광고 포스터 디자인",
        imagePath: "images/광고 포스터/상세_광고 포스터.png",
        tools: ["Photoshop", "Illustrator"],
        category: "print",
      },

      // 내지 디자인 프로젝트
      섬네일_내지: {
        title: "내지 디자인",
        imagePath: "images/광고 포스터/상세_내지 디자인.png",
        tools: ["Photoshop", "InDesign"],
        category: "print",
      },
    };

    return projectsData[projectId];
  }

  openModal(projectData) {
    // 스크롤 위치 저장
    this.savedScrollPosition = window.scrollY || window.pageYOffset || 0;
    console.log("모달 열기: 스크롤 위치 저장", this.savedScrollPosition);

    // 모달 요소 참조
    const modalTitle = document.querySelector(".modal-title");
    const detailImage = document.getElementById("detail-image");
    const loading = document.getElementById("modal-loading");
    const linkBtn = document.getElementById("link-btn");
    const processBtn = document.getElementById("process-btn");
    const responsiveViewBtn = document.getElementById("responsive-view-btn");
    const mobileViewBtn = document.getElementById("mobile-view-btn");

    // 로켓 애니메이션 일시 중지 (성능 향상)
    this.pauseRocketAnimation();

    // 모달 제목 설정
    modalTitle.textContent = projectData.title;

    // 링크 버튼 설정
    if (projectData.link) {
      linkBtn.style.display = "block";
      linkBtn.href = this.getActualUrl(projectData) || "#";

      // 핸들러 교체
      const oldBtn = linkBtn;
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault(); // 링크 기본 동작 방지

        try {
          // 실제 URL 가져오기
          const urlToOpen = this.getActualUrl(projectData);

          if (urlToOpen) {
            console.log("외부 링크 열기:", urlToOpen);

            // 새 창에서 열기
            window.open(urlToOpen, "_blank");

            // 로켓 애니메이션 계속 유지 (새 창에서 열리므로)
            this.resumeRocketAnimation();
          } else {
            console.error("유효한 URL을 찾을 수 없습니다");
          }
        } catch (error) {
          console.error("링크 열기 오류:", error);

          // 폴백 URL 사용
          if (projectData.title.includes("갸스비")) {
            window.open(
              "https://smkim12345.github.io/project2/index.html",
              "_blank"
            );
          } else if (projectData.title.includes("제네시스")) {
            window.open(
              "https://smkim12345.github.io/project1/index.html",
              "_blank"
            );
          }

          // 로켓 애니메이션 재개
          this.resumeRocketAnimation();
        }
      });
    } else {
      linkBtn.style.display = "none";
    }

    // 작업과정 버튼 설정
    if (projectData.process) {
      processBtn.style.display = "block";
      processBtn.onclick = (e) => {
        e.preventDefault(); // 링크 기본 동작 방지

        // 새 창에서 열기
        window.open(projectData.process, "_blank");

        // 로켓 애니메이션 재개 (외부 링크를 새 창에서 열기 때문에)
        this.resumeRocketAnimation();
      };
    } else {
      processBtn.style.display = "none";
    }

    // 반응형 보기 버튼 설정
    if (projectData.hasResponsive && projectData.responsiveUrl) {
      responsiveViewBtn.style.display = "block";
      console.log(
        "반응형 보기 버튼 표시:",
        projectData.title,
        "URL:",
        projectData.responsiveUrl
      );

      // 기존 이벤트 리스너 제거
      const newBtn = responsiveViewBtn.cloneNode(true);
      responsiveViewBtn.parentNode.replaceChild(newBtn, responsiveViewBtn);

      // 새로운 이벤트 리스너 추가
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("반응형 보기 버튼 클릭:", projectData.responsiveUrl);
        this.showMobilePreview(projectData.responsiveUrl, projectData.title);
      });
    } else {
      responsiveViewBtn.style.display = "none";
    }

    // 모바일 보기 버튼 설정
    if (projectData.hasMobile && projectData.mobileUrl) {
      mobileViewBtn.style.display = "block";
      console.log(
        "모바일 보기 버튼 표시:",
        projectData.title,
        "URL:",
        projectData.mobileUrl
      );

      // 기존 이벤트 리스너 제거
      const newBtn = mobileViewBtn.cloneNode(true);
      mobileViewBtn.parentNode.replaceChild(newBtn, mobileViewBtn);

      // 새로운 이벤트 리스너 추가
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("모바일 보기 버튼 클릭:", projectData.mobileUrl);

        // openInNewTab 속성이 있으면 새 창에서 열기
        if (projectData.openInNewTab) {
          window.open(projectData.mobileUrl, "_blank");
          // 로켓 애니메이션 재개 (외부 링크를 새 창에서 열기 때문에)
          this.resumeRocketAnimation();
        } else {
          // 모바일 프리뷰 표시
          this.showMobilePreview(
            projectData.mobileUrl,
            projectData.title,
            projectData.preserveDeviceSize || false
          );
        }
      });
    } else {
      mobileViewBtn.style.display = "none";
    }

    // 로딩 표시
    loading.style.display = "flex";
    detailImage.style.display = "none";

    // 이미지 사전 로드
    const preloadImage = new Image();
    preloadImage.src = projectData.imagePath;

    preloadImage.onload = () => {
      // 이미지 로드 성공 시
      detailImage.src = projectData.imagePath;
      loading.style.display = "none";
      detailImage.style.display = "block";
    };

    preloadImage.onerror = () => {
      // 이미지 로드 실패 시
      loading.innerHTML = `
        <div class="loading-spinner"></div>
        <span>이미지를 불러올 수 없습니다.</span>
      `;
    };

    // 모달 표시
    this.modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    // 모달 닫기
    this.modal.classList.remove("show");
    document.body.style.overflow = "auto";

    // 이미지 숨기기 (성능 최적화)
    const detailImage = document.getElementById("detail-image");
    if (detailImage) {
      detailImage.style.display = "none";
      detailImage.src = "";
    }

    // 관련 버튼들 숨기기
    const linkBtn = document.getElementById("link-btn");
    const processBtn = document.getElementById("process-btn");
    const mobileViewBtn = document.getElementById("mobile-view-btn");
    const responsiveViewBtn = document.getElementById("responsive-view-btn");

    if (linkBtn) linkBtn.style.display = "none";
    if (processBtn) processBtn.style.display = "none";
    if (mobileViewBtn) mobileViewBtn.style.display = "none";
    if (responsiveViewBtn) responsiveViewBtn.style.display = "none";

    // 저장된 스크롤 위치로 복원
    window.scrollTo(0, this.savedScrollPosition);

    // 로켓 애니메이션 재개
    this.resumeRocketAnimation();

    // 콘솔 로그로 확인
    console.log("모달 닫기: 스크롤 위치 복원", this.savedScrollPosition);
  }

  // 로켓 애니메이션 일시 중지
  pauseRocketAnimation() {
    console.log("로켓 애니메이션 일시 중지");
    if (
      window.rocketInstance &&
      typeof window.rocketInstance.pauseAnimation === "function"
    ) {
      window.rocketInstance.pauseAnimation();
    }
  }

  // 로켓 애니메이션 재개
  resumeRocketAnimation() {
    console.log("로켓 애니메이션 재개");
    if (
      window.rocketInstance &&
      typeof window.rocketInstance.resumeAnimation === "function"
    ) {
      window.rocketInstance.resumeAnimation();
    }
  }

  // 실제 URL 가져오기
  getActualUrl(projectData) {
    // 데이터에 직접 URL이 있으면 사용
    if (projectData.responsiveUrl) {
      return projectData.responsiveUrl;
    }

    if (projectData.link) {
      // link가 URL 객체를 가리키는 경우 문자열 추출 시도
      try {
        // '링크_' 접두사가 있는 파일명에서 실제 URL 추출
        if (
          typeof projectData.link === "string" &&
          projectData.link.includes("링크_")
        ) {
          // 프로젝트 타이틀로 확인
          if (projectData.title.includes("갸스비")) {
            return "https://smkim12345.github.io/project2/index.html";
          } else if (projectData.title.includes("제네시스")) {
            return "https://smkim12345.github.io/project1/index.html";
          } else if (projectData.title.includes("갤럭시 버즈")) {
            return "https://smkim12345.github.io/galaxybuds/";
          }
        } else {
          return projectData.link;
        }
      } catch (error) {
        console.error("URL 추출 오류:", error);
      }
    }

    // 제목으로 판단 (대체 URL)
    if (projectData.title.includes("갸스비")) {
      return "https://smkim12345.github.io/project2/index.html";
    } else if (projectData.title.includes("제네시스")) {
      return "https://smkim12345.github.io/project1/index.html";
    } else if (projectData.title.includes("갤럭시 버즈")) {
      return "https://smkim12345.github.io/galaxybuds/";
    }

    return null;
  }

  exposeGlobalMethods() {
    const self = this; // this 참조 저장

    // 전역 객체에 메서드 노출하여 외부에서 호출 가능하게 함
    window.showMobilePreview = (url, title, preserveDeviceSize = false) => {
      // 로켓 애니메이션 일시 중지
      self.pauseRocketAnimation();

      self.showMobilePreview(url, title, preserveDeviceSize);
    };

    window.hideMobilePreview = () => {
      const mobileMockup = document.getElementById("mobileMockup");
      if (mobileMockup) {
        // 닫기 애니메이션 추가
        mobileMockup.style.opacity = "0";
        mobileMockup.style.transform = "translateX(-50%) scale(0.9)";

        // 애니메이션 후 요소 제거
        setTimeout(() => {
          mobileMockup.remove();
        }, 300);

        // 로켓 애니메이션 재개
        self.resumeRocketAnimation();
      }
    };
  }
}

// 페이지 로드 후 모달 초기화
document.addEventListener("DOMContentLoaded", () => {
  const modal = new PortfolioImageModal();

  // 페이지 로드 시 이전에 저장된 스크롤 위치 복원
  if (window.savedPortfolioScrollPosition) {
    console.log(
      "저장된 스크롤 위치 복원:",
      window.savedPortfolioScrollPosition
    );
    setTimeout(() => {
      window.scrollTo({
        top: window.savedPortfolioScrollPosition,
        behavior: "auto",
      });
    }, 300);
  }

  // DOM 업데이트 후 이벤트 리스너 다시 연결
  setTimeout(() => {
    console.log("포트폴리오 항목 이벤트 리스너 다시 연결");
    modal.updatePortfolioItems();
  }, 1000);
});
