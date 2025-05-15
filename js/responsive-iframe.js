/**
 * 🖼️ ResponsiveIframe Component
 * 디바이스별 크기에 맞춤화된 iframe을 관리하는 컴포넌트
 */

class ResponsiveIframe {
  constructor(iframeElement, deviceConfig) {
    this.iframe = iframeElement;
    this.config = deviceConfig;
    this.currentUrl = null;
    this.loadHandlers = [];
    this.errorHandlers = [];

    this.init();
  }

  /**
   * iframe 초기화
   */
  init() {
    this.setupIframe();
    this.addEventListeners();
  }

  /**
   * iframe 설정
   */
  setupIframe() {
    // 디바이스별 뷰포트 메타태그 설정
    const viewportSettings = this.getViewportSettings();

    // iframe 속성 설정
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.setAttribute("frameborder", "0");
    this.iframe.setAttribute("scrolling", "auto");

    // 보안 설정
    this.iframe.setAttribute(
      "sandbox",
      "allow-same-origin allow-scripts allow-popups allow-forms"
    );

    // 접근성 설정
    this.iframe.setAttribute("title", `${this.config.type} Preview`);
  }

  /**
   * 디바이스별 뷰포트 설정 반환
   */
  getViewportSettings() {
    const settings = {
      desktop: {
        viewport: "width=1920,initial-scale=1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      tablet: {
        viewport: "width=768,initial-scale=1",
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      },
      mobile: {
        viewport: "width=480,initial-scale=0.5",
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      },
    };

    return settings[this.config.type] || settings.desktop;
  }

  /**
   * 이벤트 리스너 추가
   */
  addEventListeners() {
    this.iframe.addEventListener("load", (event) => {
      this.handleLoad(event);
    });

    this.iframe.addEventListener("error", (event) => {
      this.handleError(event);
    });
  }

  /**
   * 로드 이벤트 처리
   */
  handleLoad(event) {
    // 뷰포트 설정 적용 (가능한 경우)
    this.applyViewportSettings();

    // 등록된 로드 핸들러 실행
    this.loadHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error("Load handler error:", error);
      }
    });
  }

  /**
   * 에러 이벤트 처리
   */
  handleError(event) {
    console.error(`iframe error (${this.config.type}):`, event);

    // 등록된 에러 핸들러 실행
    this.errorHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error("Error handler error:", error);
      }
    });
  }

  /**
   * 뷰포트 설정 적용
   */
  applyViewportSettings() {
    try {
      const iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document;

      if (iframeDoc) {
        // 기존 viewport 메타태그 제거 및 새로 추가
        const existingViewport = iframeDoc.querySelector(
          'meta[name="viewport"]'
        );
        if (existingViewport) {
          existingViewport.remove();
        }

        const viewportMeta = iframeDoc.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content = this.getViewportSettings().viewport;
        iframeDoc.head.appendChild(viewportMeta);

        // 디바이스별 CSS 주입
        this.injectDeviceSpecificCSS(iframeDoc);
      }
    } catch (error) {
      // 크로스 오리진 제한으로 인한 에러는 무시
      console.warn("Cannot access iframe content (cross-origin)");
    }
  }

  /**
   * 디바이스별 CSS 주입
   */
  injectDeviceSpecificCSS(doc) {
    const deviceCSS = this.getDeviceSpecificCSS();

    if (deviceCSS) {
      const styleElement = doc.createElement("style");
      styleElement.textContent = deviceCSS;
      doc.head.appendChild(styleElement);
    }
  }

  /**
   * 디바이스별 특정 CSS 반환
   */
  getDeviceSpecificCSS() {
    const cssRules = {
      mobile: `
                /* 모바일 최적화 CSS */
                body {
                    -webkit-text-size-adjust: 100%;
                }
                
                /* 터치 인터페이스 최적화 */
                button, input, select, textarea {
                    font-size: 16px; /* iOS 줌 방지 */
                }
            `,
      tablet: `
                /* 태블릿 최적화 CSS */
                body {
                    -webkit-text-size-adjust: 100%;
                }
            `,
      desktop: `
                /* 데스크톱 최적화 CSS */
                body {
                    overflow-x: auto;
                }
            `,
    };

    return cssRules[this.config.type] || "";
  }

  /**
   * URL 설정
   */
  setUrl(url) {
    if (url !== this.currentUrl) {
      this.currentUrl = url;
      this.iframe.src = url;
    }
  }

  /**
   * URL 반환
   */
  getUrl() {
    return this.currentUrl;
  }

  /**
   * 로드 이벤트 핸들러 추가
   */
  onLoad(handler) {
    if (typeof handler === "function") {
      this.loadHandlers.push(handler);
    }
  }

  /**
   * 에러 이벤트 핸들러 추가
   */
  onError(handler) {
    if (typeof handler === "function") {
      this.errorHandlers.push(handler);
    }
  }

  /**
   * 리로드
   */
  reload() {
    if (this.currentUrl) {
      this.iframe.src = this.currentUrl;
    }
  }

  /**
   * 스크롤 위치 반환
   */
  getScrollPosition() {
    try {
      const iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document;

      if (iframeDoc) {
        return {
          top: iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop,
          left:
            iframeDoc.documentElement.scrollLeft || iframeDoc.body.scrollLeft,
        };
      }
    } catch (error) {
      console.warn("Cannot access iframe scroll position (cross-origin)");
    }

    return { top: 0, left: 0 };
  }

  /**
   * 스크롤 위치 설정
   */
  setScrollPosition(top, left = 0) {
    try {
      const iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document;

      if (iframeDoc) {
        if (iframeDoc.documentElement.scrollTo) {
          iframeDoc.documentElement.scrollTo(left, top);
        } else {
          iframeDoc.documentElement.scrollTop = top;
          iframeDoc.documentElement.scrollLeft = left;
        }
      }
    } catch (error) {
      console.warn("Cannot set iframe scroll position (cross-origin)");
    }
  }

  /**
   * 스크린샷 캡처 (가능한 경우)
   */
  captureScreenshot() {
    return new Promise((resolve, reject) => {
      try {
        // html2canvas 라이브러리가 있다면 사용
        if (typeof html2canvas !== "undefined") {
          const iframeDoc =
            this.iframe.contentDocument || this.iframe.contentWindow.document;

          if (iframeDoc) {
            html2canvas(iframeDoc.body)
              .then((canvas) => {
                resolve(canvas.toDataURL());
              })
              .catch(reject);
          } else {
            reject(new Error("Cannot access iframe content"));
          }
        } else {
          reject(new Error("html2canvas library not available"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * iframe 파괴
   */
  destroy() {
    this.loadHandlers = [];
    this.errorHandlers = [];
    this.currentUrl = null;
  }
}

// ResponsiveIframe을 전역 스코프에 노출
window.ResponsiveIframe = ResponsiveIframe;
