/**
 * 🖥️ DeviceFrame Component
 * 개별 디바이스 프레임을 렌더링하고 관리하는 클래스
 */

class DeviceFrame {
    constructor(deviceConfig, options = {}) {
        this.config = deviceConfig;
        this.options = {
            index: 0,
            galleryContainer: null,
            animationDelay: 0,
            ...options
        };

        this.element = null;
        this.iframe = null;
        this.isLoading = false;
        this.currentUrl = null;
        this.scrollSyncEnabled = false;
        this.syncDevices = [];

        // 디바이스별 설정
        this.deviceSettings = this.getDeviceSettings();
    }

    /**
     * 디바이스별 설정 반환
     */
    getDeviceSettings() {
        const settings = {
            desktop: {
                name: 'Desktop',
                icon: '🖥️',
                bezelWidth: 8,
                borderRadius: '10px'
            },
            tablet: {
                name: 'Tablet',
                icon: '📱',
                bezelWidth: 12,
                borderRadius: '20px'
            },
            mobile: {
                name: 'Mobile',
                icon: '📱',
                bezelWidth: 10,
                borderRadius: '25px'
            }
        };

        return settings[this.config.type] || settings.desktop;
    }

    /**
     * 디바이스 프레임 초기화
     */
    async init() {
        try {
            this.createElement();
            this.appendToContainer();
            this.setupEventListeners();
            
            // 초기 애니메이션 지연
            if (this.options.animationDelay > 0) {
                await this.delay(this.options.animationDelay * 1000);
            }
            
            this.animateEntry();
            
            console.log(`✅ DeviceFrame (${this.config.type}) initialized`);
        } catch (error) {
            console.error(`❌ DeviceFrame (${this.config.type}) initialization failed:`, error);
            this.handleError(error);
        }
    }

    /**
     * 디바이스 프레임 HTML 요소 생성
     */
    createElement() {
        const frameElement = document.createElement('div');
        frameElement.className = `device-frame ${this.config.type}`;
        
        const scale = this.config.scale || 1;
        const width = this.config.width * scale;
        const height = this.config.height * scale;
        
        frameElement.style.width = `${width}px`;
        frameElement.style.height = `${height}px`;
        
        frameElement.innerHTML = `
            <div class="device-label">
                <span class="device-icon">${this.deviceSettings.icon}</span>
                <span class="device-name">${this.deviceSettings.name}</span>
                <span class="device-size">${this.config.width}×${this.config.height}</span>
            </div>
            <div class="device-screen">
                <div class="iframe-container" style="width: 100%; height: 100%; position: relative;">
                    <div class="iframe-loading" id="loading-${this.config.type}">
                        <div class="loading-text">Loading...</div>
                    </div>
                    <iframe 
                        id="iframe-${this.config.type}" 
                        class="device-iframe"
                        style="width: 100%; height: 100%; border: none; opacity: 0;"
                        frameborder="0"
                        scrolling="auto">
                    </iframe>
                </div>
            </div>
        `;

        this.element = frameElement;
        this.iframe = frameElement.querySelector('.device-iframe');
        this.loadingElement = frameElement.querySelector('.iframe-loading');
    }

    /**
     * 컨테이너에 요소 추가
     */
    appendToContainer() {
        if (this.options.galleryContainer) {
            this.options.galleryContainer.appendChild(this.element);
        } else {
            throw new Error('Gallery container not provided');
        }
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // iframe 로드 이벤트
        this.iframe.addEventListener('load', () => {
            this.handleIframeLoad();
        });

        // iframe 에러 이벤트
        this.iframe.addEventListener('error', (error) => {
            this.handleError(error);
        });
    }

    /**
     * 진입 애니메이션
     */
    animateEntry() {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // 초기 상태 설정
            gsap.set(this.element, {
                opacity: 0,
                scale: 0.8,
                y: 50
            });

            // 애니메이션 실행
            tl.to(this.element, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        } else {
            // CSS 애니메이션 대안
            this.element.style.animation = 'deviceFrameEntry 0.6s ease-out forwards';
        }
    }

    /**
     * URL 업데이트
     */
    updateUrl(url) {
        if (!url || url === this.currentUrl) return;

        this.showLoading();
        this.currentUrl = url;
        this.iframe.src = url;
    }

    /**
     * 로딩 표시
     */
    showLoading() {
        this.isLoading = true;
        this.element.classList.add('loading');
        this.loadingElement.style.display = 'flex';
        this.iframe.style.opacity = '0';
    }

    /**
     * 로딩 숨김
     */
    hideLoading() {
        this.isLoading = false;
        this.element.classList.remove('loading');
        this.loadingElement.style.display = 'none';
        
        // iframe 페이드인
        if (typeof gsap !== 'undefined') {
            gsap.to(this.iframe, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            this.iframe.style.opacity = '1';
        }
    }

    /**
     * iframe 로드 처리
     */
    handleIframeLoad() {
        this.hideLoading();
        this.element.classList.remove('error');
        
        // 동기화 스크롤이 활성화되어 있다면 설정
        if (this.scrollSyncEnabled) {
            this.setupScrollSync();
        }
    }

    /**
     * 에러 처리
     */
    handleError(error) {
        this.hideLoading();
        this.element.classList.add('error');
        console.error(`Error in ${this.config.type} device frame:`, error);
    }

    /**
     * 동기화 스크롤 활성화
     */
    enableSyncScroll(allDevices) {
        this.scrollSyncEnabled = true;
        this.syncDevices = allDevices.filter(device => device !== this);
        this.setupScrollSync();
    }

    /**
     * 동기화 스크롤 비활성화
     */
    disableSyncScroll() {
        this.scrollSyncEnabled = false;
        this.syncDevices = [];
        this.removeScrollSync();
    }

    /**
     * 스크롤 동기화 설정
     */
    setupScrollSync() {
        // iframe 내부 문서에 접근이 가능한 경우에만 동기화 설정
        try {
            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            
            if (iframeDoc) {
                iframeDoc.addEventListener('scroll', this.handleScroll.bind(this));
            }
        } catch (error) {
            // 크로스 오리진 제한으로 인한 에러는 무시
            console.warn('Cross-origin iframe - scroll sync not available');
        }
    }

    /**
     * 스크롤 동기화 제거
     */
    removeScrollSync() {
        try {
            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            
            if (iframeDoc) {
                iframeDoc.removeEventListener('scroll', this.handleScroll.bind(this));
            }
        } catch (error) {
            // 에러 무시
        }
    }

    /**
     * 스크롤 이벤트 처리
     */
    handleScroll(event) {
        if (!this.scrollSyncEnabled) return;

        const scrollTop = event.target.scrollTop;
        const scrollPercent = scrollTop / (event.target.scrollHeight - event.target.clientHeight);

        // 다른 디바이스들과 스크롤 동기화
        this.syncDevices.forEach(device => {
            try {
                const otherDoc = device.iframe.contentDocument || device.iframe.contentWindow.document;
                if (otherDoc) {
                    const targetScrollTop = scrollPercent * (otherDoc.scrollHeight - otherDoc.clientHeight);
                    otherDoc.scrollTop = targetScrollTop;
                }
            } catch (error) {
                // 크로스 오리진 에러 무시
            }
        });
    }

    /**
     * 리사이즈 처리
     */
    handleResize() {
        // 필요시 디바이스 크기 조정 로직 구현
        // 현재는 CSS로 반응형 처리되어 있음
    }

    /**
     * 프레임 파괴
     */
    destroy() {
        this.disableSyncScroll();
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.iframe = null;
        this.loadingElement = null;
    }

    /**
     * 딜레이 유틸리티
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// DeviceFrame을 전역 스코프에 노출
window.DeviceFrame = DeviceFrame;