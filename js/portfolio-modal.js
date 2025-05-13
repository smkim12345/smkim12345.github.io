// 포트폴리오 이미지 모달 기능
class PortfolioImageModal {
  constructor() {
    this.modal = null;
    this.portfolioItems = [];
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
    this.updatePortfolioItems();
    this.exposeGlobalMethods();
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
                                링크
                            </a>
                            <a href="#" class="modal-link-btn" id="process-btn" style="display: none;">
                                <i class="fas fa-file-pdf"></i>
                                작업과정
                            </a>
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
      },
      // 편의를 위해 URL 인코딩된 버전도 추가
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%ED%8A%B8%EB%A1%9C%ED%94%BC%EC%B9%B4%EB%82%98":
        {
          title: "트로피카나 스파클링 패키지 리디자인",
          imagePath: "images/트로피카나/상세_트로피카나.jpg",
          tools: ["Photoshop", "Illustrator"],
        },
      twosome: {
        title: "투썸 에이리스트 패키지 리디자인",
        imagePath: "images/portfolio/twosome-detail.jpg",
      },
      gatsby: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/갸스비/링크_갸스비 웹.url",
      },
      // 갸스비 프로젝트를 다양한 키워드로 접근 가능하도록 추가
      갸스비: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/갸스비/링크_갸스비 웹.url",
      },
      "gatsby-redesign": {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/갸스비/링크_갸스비 웹.url",
      },
      섬네일_갸스비: {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/갸스비/링크_갸스비 웹.url",
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%B8%EC%8A%A4%EB%B9%84": {
        title: "갸스비 웹 리디자인",
        imagePath: "images/갸스비/상세_갸스비.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/갸스비/링크_갸스비 웹.url",
      },
      genesis: {
        title: "제네시스 웹 리디자인",
        imagePath: "images/제네시스/상세_제네시스.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/제네시스/링크_제네시스.url",
        process: "images/제네시스/작업과정_제네시스.pdf",
      },
      섬네일_제네시스: {
        title: "제네시스 웹 리디자인",
        imagePath: "images/제네시스/상세_제네시스.jpg",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        link: "images/제네시스/링크_제네시스.url",
        process: "images/제네시스/작업과정_제네시스.pdf",
      },
      mcdelivery: {
        title: "맥딜리버리 앱 리디자인",
        imagePath: "images/portfolio/mcdelivery-detail.jpg",
      },
      riskeye: {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
      },
      "riskeye-logo": {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
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
      },
      갤럭시버즈3프로: {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
      },
      // 추가 매핑 - 새로 추가된 프로젝트들
      "섬네일_갤럭시 버즈3프로 상세페이지": {
        title: "갤럭시 버즈3 프로 상세페이지",
        imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
        tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EA%B0%A4%EB%9F%AD%EC%8B%9C%20%EB%B2%84%EC%A6%883%ED%94%84%EB%A1%9C%20%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80":
        {
          title: "갤럭시 버즈3 프로 상세페이지",
          imagePath: "images/갤럭시버즈/상세_갤럭시 버즈3프로.png",
          tools: ["Adobe XD", "Photoshop", "HTML/CSS"],
        },
      "섬네일_리스크아이 로고 디자인": {
        title: "리스크아이 로고 디자인",
        imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
        tools: ["Illustrator", "Photoshop"],
      },
      "%EC%84%AC%EB%84%A4%EC%9D%BC_%EB%A6%AC%EC%8A%A4%ED%81%AC%EC%95%84%EC%9D%B4%20%EB%A1%9C%EA%B3%A0%20%EB%94%94%EC%9E%90%EC%9D%B8":
        {
          title: "리스크아이 로고 디자인",
          imagePath: "images/리스크아이/상세_리스크아이 로고 디자인.jpg",
          tools: ["Illustrator", "Photoshop"],
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

    // URL 디코딩 시도
    try {
      const decodedName = decodeURIComponent(filenameWithoutExt);
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

    // 모달 제목 설정
    modalTitle.textContent = projectData.title;

    // 링크 버튼 설정
    if (projectData.link) {
      linkBtn.style.display = "block";
      linkBtn.onclick = async () => {
        try {
          // URL 파일 내용 읽기
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
          // 제네시스 링크를 직접 설정
          window.open(
            "https://smkim12345.github.io/project1/index.html",
            "_blank"
          );
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
  }
}

// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 포트폴리오 모달 초기화
  new PortfolioImageModal();
});
