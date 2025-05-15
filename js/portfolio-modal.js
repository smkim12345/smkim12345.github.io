// 포트폴리오 이미지 모달 기능
class PortfolioImageModal {
  constructor() {
    this.modal = null;
    this.portfolioItems = [];
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
    // 각 포트폴리오 아이템에 대한 상세 이미지 경로 매핑
    this.portfolioData = {
      섬네일_트로피카나: {
        title: "트로피카나 스파클링 패키지 리디자인",
        imagePath: "images/트로피카나/상세_트로피카나.jpg",
        tools: ["Photoshop", "Illustrator"],
        process: "images/트로피카나/작업과정_트로피카나.pdf",
      },
      // 편의를 위해 URL 인코딩된 버전도 추가
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%ED%8A%B8%EB%A1%9C%ED%94%BC%EC%B9%B4%EB%82%98":
        {
          title: "트로피카나 스파클링 패키지 리디자인",
          imagePath: "images/트로피카나/상세_트로피카나.jpg",
          tools: ["Photoshop", "Illustrator"],
          process: "images/트로피카나/작업과정_트로피카나.pdf",
        },
      twosome: {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/투썸/상세_투썸.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      // 투썸 URL 매핑 추가
      섬네일_투썸: {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/투썸/상세_투썸.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%ED%88%AC%EC%8D%B8": {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/투썸/상세_투썸.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      // 갸스비 프로젝트 정보 (메인 데이터)
      gatsby: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        link: "images/갸스비/링크_갸스비 웹.url",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project2/index.html",
        hasMobile: true,
        mobileUrl: "https://smkim12345.github.io/project2mobile/index.html",
      },
      genesis: {
        title: "제네시스 웹 리디자인",
        imagePath: "images/제네시스/상세_제네시스.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/제네시스/링크_제네시스.url",
        process: "images/제네시스/작업과정_제네시스.pdf",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project1/index.html",
      },
      섬네일_제네시스: {
        title: "제네시스 웹 리디자인",
        imagePath: "images/제네시스/상세_제네시스.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/제네시스/링크_제네시스.url",
        process: "images/제네시스/작업과정_제네시스.pdf",
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/project1/index.html",
      },
      mcdelivery: {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/맥도날드/상세_맥도날드.jpg",
        tools: ["Adobe XD", "Photoshop"],
        hasMobile: true,
        mobileUrl:
          "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
        openInNewTab: true,
      },
      // 맥도날드 URL 매핑 추가
      맥도날드: {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/맥도날드/상세_맥도날드.jpg",
        tools: ["Adobe XD", "Photoshop"],
        hasMobile: true,
        mobileUrl:
          "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
        openInNewTab: true,
      },
      섬네일_맥도날드: {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/맥도날드/상세_맥도날드.jpg",
        tools: ["Adobe XD", "Photoshop"],
        hasMobile: true,
        mobileUrl:
          "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
        openInNewTab: true,
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%A7%A5%EB%8F%84%EB%82%A0%EB%93%9C": {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/맥도날드/상세_맥도날드.jpg",
        tools: ["Adobe XD", "Photoshop"],
        hasMobile: true,
        mobileUrl:
          "https://www.figma.com/proto/rbQY9g5Pl4imNGlIcJAeN7/%EA%B9%80%EC%84%B1%EB%AF%BC_%EB%A7%A5%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC-%EC%95%B1%EB%A6%AC%EB%94%94%EC%9E%90%EC%9D%B8?node-id=0-1&t=iVqeKfXFMDC01kcH-1",
        openInNewTab: true,
      },
      riskeye: {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
        process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
      },
      "riskeye-logo": {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
        process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
      },
      "ai-expo": {
        title: "AI 박람회 리플렛",
        imagePath: "images/portfolio/ai-expo-detail.jpg",
      },
      banner: {
        title: "인스타그램 광고 배너",
        imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      "instagram-ad": {
        title: "인스타그램 광고 배너",
        imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      "galaxy-buds": {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/galaxybuds/",
      },
      갤럭시버즈3프로: {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/galaxybuds/",
      },
      // 추가 매핑 - 새로 추가된 프로젝트들
      "섬네일_갤럭시 버즈3프로 상세페이지": {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        hasResponsive: true,
        responsiveUrl: "https://smkim12345.github.io/galaxybuds/",
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%A4%EB%9F%AD%EC%8B%9C%20%EB%B2%84%EC%A6%883%ED%94%84%EB%A1%9C%20%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80":
        {
          title: "갤럭시 버즈3 프로 상세페이지",
          imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
          tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
          hasResponsive: true,
          responsiveUrl: "https://smkim12345.github.io/galaxybuds/",
        },
      "섬네일_리스크아이 로고 디자인": {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
        process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%A6%AC%EC%8A%A4%ED%81%AC%EC%95%84%EC%9D%B4%20%EB%A1%9C%EA%B3%A0%20%EB%94%94%EC%9E%90%EC%9D%B8":
        {
          title: "리스크아이 로고 디자인",
          imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
          tools: ["Illustrator", "Photoshop"],
          process: "images/리스크아이/작업과정_리스크아이 로고 디자인.pdf",
        },
      "섬네일_인스타그램 광고배너디자인": {
        title: "인스타그램 광고 배너",
        imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
        tools: ["Photoshop", "Illustrator"],
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8%20%EA%B4%91%EA%B3%A0%EB%B0%B0%EB%84%88%EB%94%94%EC%9E%90%EC%9D%B8":
        {
          title: "인스타그램 광고 배너",
          imagePath: "images/인스타그램/상세_인스타그램 광고배너디자인.jpg",
          tools: ["Photoshop", "Illustrator"],
        },
    };

    // 포트폴리오 아이템 클릭 이벤트 추가
    this.portfolioItems = document.querySelectorAll(".portfolio-item");

    this.portfolioItems.forEach((item) => {
      const viewBtn = item.querySelector(".view-project");

      if (viewBtn) {
        viewBtn.addEventListener("click", (e) => {
          e.preventDefault();

          const projectId = this.getProjectId(item);

          if (projectId && this.portfolioData[projectId]) {
            this.openModal(this.portfolioData[projectId]);
          }
        });
      }
    });
  }

  getProjectId(item) {
    // 이미지 src나 클래스명에서 프로젝트 ID 추출
    const img = item.querySelector("img");
    if (img && img.src) {
      // 방법 1: URL 디코딩 후 처리
      let imageName = img.src.split("/").pop();
      imageName = decodeURIComponent(imageName);
      imageName = imageName.split(".")[0];

      // 방법 2: URL 인코딩 상태 그대로
      let encodedName = img.src.split("/").pop().split(".")[0];

      // 갸스비 관련 키워드 처리
      if (
        imageName === "섬네일_갸스비" ||
        imageName === "갸스비" ||
        encodedName ===
          "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%B8%EC%8A%A4%EB%B9%84" ||
        imageName === "gatsby-redesign"
      ) {
        return "gatsby";
      }

      // 두 방법 모두 시도
      if (this.portfolioData[imageName]) {
        return imageName;
      }

      if (this.portfolioData[encodedName]) {
        return encodedName;
      }

      // 다른 방법: 이미지 alt 속성 사용
      if (img.alt && this.portfolioData[img.alt]) {
        return img.alt;
      }

      // 폴백: 기본 ID 반환
      return "default";
    }
    return null;
  }

  // 이미지 경로에서 프로젝트 ID 추출
  getProjectIdFromPath(path) {
    if (!path) return null;

    // 경로에서 파일명 추출
    const filename = path.split("/").pop();
    // 확장자 제거
    const filenameWithoutExt = filename.split(".")[0];

    // 갸스비 관련 키워드 처리
    if (
      filenameWithoutExt === "섬네일_갸스비" ||
      filenameWithoutExt === "갸스비" ||
      filenameWithoutExt ===
        "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%B8%EC%8A%A4%EB%B9%84" ||
      filenameWithoutExt === "gatsby-redesign"
    ) {
      return "gatsby";
    }

    // URL 디코딩 시도
    try {
      const decodedName = decodeURIComponent(filenameWithoutExt);
      // 갸스비 관련 키워드 디코딩 후 처리
      if (decodedName === "섬네일_갸스비" || decodedName === "갸스비") {
        return "gatsby";
      }

      if (this.portfolioData[decodedName]) {
        return decodedName;
      }
    } catch (e) {
      console.error("URL 디코딩 오류:", e);
    }

    // 원본 이름으로 시도
    if (this.portfolioData[filenameWithoutExt]) {
      return filenameWithoutExt;
    }

    return null;
  }

  openModal(projectData) {
    // 모달 요소 참조
    const modalTitle = document.querySelector(".modal-title");
    const detailImage = document.getElementById("detail-image");
    const loading = document.getElementById("modal-loading");
    const linkBtn = document.getElementById("link-btn");
    const processBtn = document.getElementById("process-btn");
    const responsiveViewBtn = document.getElementById("responsive-view-btn");
    const mobileViewBtn = document.getElementById("mobile-view-btn");

    // 모달 제목 설정
    modalTitle.textContent = projectData.title;

    // 링크 버튼 설정
    if (projectData.link) {
      linkBtn.style.display = "block";
      linkBtn.onclick = async () => {
        try {
          // 갸스비 프로젝트인 경우 별도 처리
          if (projectData === this.portfolioData.gatsby) {
            // 갸스비용 URL은 링크_반응형.url 파일에서 가져오기
            const response = await fetch("images/갸스비/반응형.url");
            const urlContent = await response.text();
            const urlMatch = urlContent.match(/URL=(.+)/);

            if (urlMatch && urlMatch[1]) {
              window.open(urlMatch[1], "_blank");
            } else {
              // 파일에서 URL을 추출할 수 없는 경우 기본 URL 사용
              window.open(
                "https://smkim12345.github.io/project2/index.html",
                "_blank"
              );
            }
            return;
          }

          // 다른 프로젝트의 경우 기존 로직 유지
          const response = await fetch(projectData.link);
          const urlContent = await response.text();
          const urlMatch = urlContent.match(/URL=(.+)/);

          if (urlMatch && urlMatch[1]) {
            window.open(urlMatch[1], "_blank");
          } else {
            // 제네시스 링크를 직접 설정
            window.open(
              "https://smkim12345.github.io/project1/index.html",
              "_blank"
            );
          }
        } catch (error) {
          console.log("URL 파일 로드 오류:", error);

          // 갸스비 프로젝트인 경우 별도 처리
          if (projectData === this.portfolioData.gatsby) {
            window.open(
              "https://smkim12345.github.io/project2/index.html",
              "_blank"
            );
          } else {
            // 제네시스 링크를 직접 설정
            window.open(
              "https://smkim12345.github.io/project1/index.html",
              "_blank"
            );
          }
        }
      };
    } else {
      linkBtn.style.display = "none";
    }

    // 작업과정 버튼 설정
    if (projectData.process) {
      processBtn.style.display = "block";
      processBtn.onclick = () => {
        window.open(projectData.process, "_blank");
      };
    } else {
      processBtn.style.display = "none";
    }

    // 반응형 보기 버튼 설정
    if (projectData.hasResponsive && projectData.responsiveUrl) {
      responsiveViewBtn.style.display = "block";
      console.log(
        "모바일 보기 버튼 표시:",
        projectData.title,
        "URL:",
        projectData.responsiveUrl
      );

      // 기존 이벤트 리스너 제거
      const newBtn = responsiveViewBtn.cloneNode(true);
      responsiveViewBtn.parentNode.replaceChild(newBtn, responsiveViewBtn);

      // 새로운 이벤트 리스너 추가 (참고 자료 방식 사용)
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("모바일 보기 버튼 클릭 시도:", projectData.responsiveUrl);
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
        console.log("모바일 보기 버튼 클릭 시도:", projectData.mobileUrl);

        // openInNewTab 속성이 있으면 새 창에서 열기
        if (projectData.openInNewTab) {
          window.open(projectData.mobileUrl, "_blank");
        } else {
          // 기존 방식으로 모바일 프리뷰 표시
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
    this.modal.classList.remove("show");
    document.body.style.overflow = "";

    // 이미지 초기화
    const detailImage = document.getElementById("detail-image");
    detailImage.src = "";

    // 로딩 상태 초기화
    const loading = document.getElementById("modal-loading");
    loading.innerHTML = `
      <div class="loading-spinner"></div>
      <span>이미지를 불러오는 중...</span>
    `;
  }

  // 전역 함수로 노출
  exposeGlobalMethods() {
    // 전역 함수로 노출
    window.updatePortfolioModal = (projectId) => {
      if (projectId && this.portfolioData[projectId]) {
        this.openModal(this.portfolioData[projectId]);
      } else {
        // 프로젝트 ID로 찾을 수 없는 경우 경로에서 추출 시도
        const extractedId = this.getProjectIdFromPath(projectId);
        if (extractedId && this.portfolioData[extractedId]) {
          this.openModal(this.portfolioData[extractedId]);
        } else {
          console.warn("프로젝트 데이터를 찾을 수 없습니다:", projectId);
        }
      }
    };

    // 모바일 미리보기 닫기 전역 함수 추가
    window.hideMobilePreview = () => {
      const mobileMockup = document.getElementById("mobileMockup");
      if (mobileMockup) {
        // 닫기 애니메이션 추가
        mobileMockup.style.opacity = "0";
        mobileMockup.style.transform = "translateX(-50%) scale(0.9)";

        setTimeout(() => {
          mobileMockup.style.display = "none";
          const iframe = document.getElementById("mobileIframe");
          if (iframe) {
            iframe.src = ""; // iframe 초기화
          }
          mobileMockup.remove(); // DOM에서 제거
        }, 300);
      }
    };

    // ESC 키로 모바일 뷰어 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const mobileMockup = document.getElementById("mobileMockup");
        if (mobileMockup && mobileMockup.style.display === "block") {
          window.hideMobilePreview();
        }
      }
    });
  }
}

// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 포트폴리오 모달 초기화
  new PortfolioImageModal();
});
