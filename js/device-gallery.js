/**
 * 🚀 Interactive Device Gallery
 * 여러 디바이스 모형을 나란히 배치하여 반응형 웹사이트를 시연하는 컴포넌트
 */

class DeviceGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }

        // 기본 설정
        this.options = {
            devices: [
                { type: 'desktop', width: 1920, height: 1080, scale: 0.3 },
                { type: 'tablet', width: 768, height: 1024, scale: 0.4 },
                { type: 'mobile', width: 375, height: 812, scale: 0.5 }
            ],
            animationDuration: 0.6,
            staggerDelay: 0.2,
            ...options
        };

        this.deviceFrames = [];
        this.isInitialized = false;

        this.init();
    }

    /**
     * 갤러리 초기화
     */
    async init() {
        try {
            this.createGalleryStructure();
            await this.createDeviceFrames();
            this.setupEventListeners();
            this.animateEntry();
            this.isInitialized = true;
            
            console.log('🚀 Device Gallery initialized successfully');
        } catch (error) {
            console.error('❌ DeviceGallery initialization failed:', error);
        }
    }

    /**
     * 갤러리 기본 구조 생성
     */
    createGalleryStructure() {
        this.container.innerHTML = `
            <div class="device-gallery-wrapper">
                <div class="device-gallery-header">
                    <h3 class="gallery-title">Responsive Preview</h3>
                    <p class="gallery-subtitle">다양한 기기에서의 반응형 디자인 체험</p>
                </div>
                <div class="device-gallery-content">
                    <div class="device-frames-container" id="device-frames-container">
                        <!-- 디바이스 프레임들이 여기에 동적으로 추가됩니다 -->
                    </div>
                </div>
                <div class="gallery-controls">
                    <button class="sync-scroll-btn" id="sync-scroll-btn">
                        동기화 스크롤 OFF
                    </button>
                </div>
            </div>
        `;

        this.framesContainer = this.container.querySelector('#device-frames-container');
        this.syncScrollBtn = this.container.querySelector('#sync-scroll-btn');
    }

    /**
     * 디바이스 프레임들 생성
     */
    async createDeviceFrames() {
        for (const [index, device] of this.options.devices.entries()) {
            const deviceFrame = new DeviceFrame(device, {
                index,
                galleryContainer: this.framesContainer,
                animationDelay: index * this.options.staggerDelay
            });

            await deviceFrame.init();
            this.deviceFrames.push(deviceFrame);
        }
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 동기화 스크롤 토글
        this.syncScrollBtn.addEventListener('click', () => {
            this.toggleSyncScroll();
        });

        // 리사이즈 이벤트
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 300));
    }

    /**
     * 디바이스 갤러리 진입 애니메이션
     */
    animateEntry() {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();

            // 헤더 애니메이션
            tl.from('.device-gallery-header', {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: 'power2.out'
            });

            // 디바이스 프레임들 순차 애니메이션
            tl.from('.device-frame', {
                opacity: 0,
                scale: 0.8,
                y: 50,
                duration: 0.6,
                stagger: this.options.staggerDelay,
                ease: 'back.out(1.7)'
            }, '-=0.3');

            // 컨트롤 버튼 애니메이션
            tl.from('.gallery-controls', {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.2');
        }
    }

    /**
     * 동기화 스크롤 토글
     */
    toggleSyncScroll() {
        const isCurrentlySync = this.syncScrollBtn.textContent.includes('OFF');
        
        if (isCurrentlySync) {
            this.enableSyncScroll();
            this.syncScrollBtn.textContent = '동기화 스크롤 ON';
            this.syncScrollBtn.classList.add('active');
        } else {
            this.disableSyncScroll();
            this.syncScrollBtn.textContent = '동기화 스크롤 OFF';
            this.syncScrollBtn.classList.remove('active');
        }
    }

    /**
     * 동기화 스크롤 활성화
     */
    enableSyncScroll() {
        this.deviceFrames.forEach(frame => {
            frame.enableSyncScroll(this.deviceFrames);
        });
    }

    /**
     * 동기화 스크롤 비활성화
     */
    disableSyncScroll() {
        this.deviceFrames.forEach(frame => {
            frame.disableSyncScroll();
        });
    }

    /**
     * 리사이즈 처리
     */
    handleResize() {
        this.deviceFrames.forEach(frame => {
            frame.handleResize();
        });
    }

    /**
     * 특정 URL로 모든 디바이스 업데이트
     */
    updateAllDevicesUrl(url) {
        this.deviceFrames.forEach(frame => {
            frame.updateUrl(url);
        });
    }

    /**
     * 갤러리 파괴
     */
    destroy() {
        this.deviceFrames.forEach(frame => {
            frame.destroy();
        });
        this.deviceFrames = [];
        this.container.innerHTML = '';
        this.isInitialized = false;
    }

    /**
     * 디바운스 유틸리티
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// DeviceGallery를 전역 스코프에 노출
window.DeviceGallery = DeviceGallery;