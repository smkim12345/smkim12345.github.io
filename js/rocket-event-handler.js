/**
 * Cosmic Portfolio - 로켓 이벤트 핸들러
 * 모든 마우스/터치 이벤트를 캡처하여 로켓 인스턴스에 전달
 */

(() => {
    // 처리 상태 관리
    const state = {
        isActive: true,
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        lastUpdateTime: Date.now(),
        isProcessing: false
    };

    // 주요 DOM 요소 참조
    let rocketElement = null;
    let rocketInstance = null;

    /**
     * 문서 초기화
     */
    function init() {
        console.log('로켓 이벤트 핸들러 초기화');
        
        // 로켓 요소 참조 얻기
        rocketElement = document.getElementById('rocket-element');
        
        // 이벤트 오버레이 생성 (모든 마우스 이벤트 캡처용)
        createEventOverlay();
        
        // 이벤트 리스너 등록
        setupEventListeners();
        
        // 로켓 인스턴스 참조 모니터링
        monitorRocketInstance();
        
        // 요소 포인터 이벤트 설정
        setupElementPointerEvents();
    }

    /**
     * 이벤트 오버레이 생성
     */
    function createEventOverlay() {
        // 이미 존재하는지 확인
        let overlay = document.querySelector('.rocket-event-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'rocket-event-overlay';
            document.body.appendChild(overlay);
            console.log('로켓 이벤트 오버레이 생성됨');
        }
    }

    /**
     * 전역 이벤트 리스너 설정
     */
    function setupEventListeners() {
        // 마우스 이동 이벤트
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        // 터치 이동 이벤트
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // 클릭 이벤트
        document.addEventListener('click', handleClick, { passive: true });
        document.addEventListener('touchstart', handleClick, { passive: true });
        
        console.log('이벤트 리스너 등록 완료');
    }

    /**
     * 요소별 포인터 이벤트 설정
     */
    function setupElementPointerEvents() {
        // 로켓 요소에 포인터 이벤트 설정
        if (rocketElement) {
            rocketElement.style.zIndex = '10000';
            rocketElement.style.pointerEvents = 'auto';
            
            const rocketImg = rocketElement.querySelector('img');
            if (rocketImg) {
                rocketImg.style.pointerEvents = 'auto';
            }
            
            const rocketFlame = rocketElement.querySelector('.rocket-flame');
            if (rocketFlame) {
                rocketFlame.style.pointerEvents = 'none';
            }
        }
        
        // 네비게이션 바에 포인터 이벤트 설정
        const navElement = document.querySelector('.main-nav');
        if (navElement) {
            navElement.style.pointerEvents = 'none';
            
            // 내부 요소들은 이벤트 받을 수 있도록 설정
            const navInteractiveElements = navElement.querySelectorAll(
                '.nav-container, .logo, .menu-toggle, .nav-links, .nav-links li, .nav-links a'
            );
            
            navInteractiveElements.forEach(element => {
                element.style.pointerEvents = 'auto';
            });
        }
    }

    /**
     * 로켓 인스턴스 모니터링 및 활성화
     */
    function monitorRocketInstance() {
        const checkInterval = setInterval(() => {
            // 전역 인스턴스 참조
            rocketInstance = window.rocketInstance || 
                            (window.COSMIC_PORTFOLIO && window.COSMIC_PORTFOLIO.rocket);
            
            if (rocketInstance) {
                clearInterval(checkInterval);
                console.log('로켓 인스턴스 참조 획득');
                
                // 로켓 인스턴스 활성화
                rocketInstance.isActive = true;
                rocketInstance.isPaused = false;
                
                if (typeof rocketInstance.setRocketStyles === 'function') {
                    rocketInstance.setRocketStyles();
                }
                
                if (typeof rocketInstance.setupMouseTracking === 'function') {
                    rocketInstance.setupMouseTracking();
                }
                
                if (typeof rocketInstance.startAnimationLoop === 'function') {
                    rocketInstance.startAnimationLoop();
                }
            }
        }, 100);
        
        // 일정 시간 후 체크 중단 (메모리 누수 방지)
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }

    /**
     * 마우스 이동 이벤트 핸들러
     */
    function handleMouseMove(e) {
        if (!state.isActive || state.isProcessing) return;
        
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        state.lastUpdateTime = Date.now();
        
        updateRocketPosition();
    }

    /**
     * 터치 이동 이벤트 핸들러
     */
    function handleTouchMove(e) {
        if (!state.isActive || state.isProcessing || !e.touches || !e.touches[0]) return;
        
        state.mouseX = e.touches[0].clientX;
        state.mouseY = e.touches[0].clientY;
        state.lastUpdateTime = Date.now();
        
        updateRocketPosition();
        
        // 로켓 요소에서 발생한 이벤트만 preventDefault (스크롤 방지)
        if (e.target === rocketElement || 
            (rocketElement && e.target === rocketElement.querySelector('img'))) {
            e.preventDefault();
        }
    }

    /**
     * 클릭/터치 이벤트 핸들러
     */
    function handleClick(e) {
        if (!state.isActive) return;
        
        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
        
        if (x !== null && y !== null) {
            state.mouseX = x;
            state.mouseY = y;
            state.lastUpdateTime = Date.now();
            
            // 클릭 시 즉시 로켓 위치 이동 (마우스 위치에서 위쪽으로 오프셋 적용)
            if (rocketElement) {
                const offsetY = -100; // 마우스보다 40px 위에 위치
                rocketElement.style.left = `${x}px`;
                rocketElement.style.top = `${y - offsetY}px`;
                rocketElement.style.transform = 'translate(-50%, -50%) rotate(0deg)'; // 고정 회전 적용 (-90도)
            }
            
            // 로켓 인스턴스가 있으면 업데이트
            if (rocketInstance) {
                rocketInstance.mouseX = x;
                rocketInstance.mouseY = y;
                
                if (typeof rocketInstance.updateRocketPosition === 'function') {
                    rocketInstance.updateRocketPosition();
                }
            }
        }
    }

    /**
     * 로켓 위치 업데이트 (로켓 인스턴스에 데이터 전달)
     */
    function updateRocketPosition() {
        // 처리 중 상태로 설정 (중복 호출 방지)
        state.isProcessing = true;
        
        try {
            // 로켓 인스턴스가 있으면 위치 전달
            if (rocketInstance) {
                rocketInstance.mouseX = state.mouseX;
                rocketInstance.mouseY = state.mouseY;
                
                // 인스턴스 메소드 호출
                if (typeof rocketInstance.updateRocketPosition === 'function') {
                    rocketInstance.updateRocketPosition();
                }
            } 
            // 로켓 인스턴스가 없으면 직접 위치 설정
            else if (rocketElement) {
                const x = state.mouseX;
                const y = state.mouseY;
                const offsetY = -100; // 마우스보다 40px 위에 위치
                
                // 현재 위치와 목표 위치 사이의 거리 계산
                const rect = rocketElement.getBoundingClientRect();
                const currentX = rect.left + rect.width / 2;
                const currentY = rect.top + rect.height / 2;
                
                const deltaX = x - currentX;
                const deltaY = (y - offsetY) - currentY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // 충분한 거리가 있을 때만 위치 업데이트 (미세한 떨림 방지)
                if (distance > 5) {
                    // 직접 스타일 조정 - 고정된 회전 사용
                    rocketElement.style.left = `${x}px`;
                    rocketElement.style.top = `${y - offsetY}px`;
                    rocketElement.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                }
            }
        } catch (error) {
            console.error('로켓 위치 업데이트 오류:', error);
        } finally {
            // 처리 완료 상태로 설정
            state.isProcessing = false;
        }
    }

    // 페이지 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 페이지 완전히 로드된 후 추가 초기화
    window.addEventListener('load', () => {
        // 로켓 요소 다시 확인
        rocketElement = document.getElementById('rocket-element');
        
        // 인스턴스 확인
        if (!rocketInstance) {
            monitorRocketInstance();
        }
        
        // 포인터 이벤트 다시 설정
        setupElementPointerEvents();
        
        console.log('로켓 이벤트 핸들러 로드 완료');
    });
    
    // 전역 함수로 노출
    window.activateRocketEventHandler = function() {
        state.isActive = true;
        console.log('로켓 이벤트 핸들러 활성화');
        
        // 로켓 인스턴스 강제 활성화
        monitorRocketInstance();
    };
    
    window.deactivateRocketEventHandler = function() {
        state.isActive = false;
        console.log('로켓 이벤트 핸들러 비활성화');
    };
})(); 