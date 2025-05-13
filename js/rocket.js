/**
 * Cosmic Portfolio - 로켓 애니메이션 스크립트
 * 스크롤에 따라 로켓이 사용자를 따라다니는 애니메이션
 */

// 로켓 애니메이션 클래스
class RocketAnimation {
    constructor() {
        // 로켓 요소
        this.rocket = document.getElementById('rocket-element');
        this.rocketImg = this.rocket.querySelector('img');
        this.flame = this.rocket.querySelector('.rocket-flame');
        
        // 섹션 요소들
        this.sections = {
            home: document.getElementById('home'),
            about: document.getElementById('about'),
            experience: document.getElementById('experience'),
            skills: document.getElementById('skills'),
            portfolio: document.getElementById('portfolio'),
            contact: document.getElementById('contact')
        };
        
        // 로켓 상태 및 설정
        this.currentSection = 'home';
        this.rocketPath = [];
        this.pathPoints = 100; // 경로 포인트 수
        this.isFlying = false;
        this.boostTimeout = null;
        this.trailElements = [];
        this.maxTrailElements = 20;
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 경로 설정
        this.initPath();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기 위치 설정
        this.setInitialPosition();
    }
    
    // 경로 초기화
    initPath() {
        // 각 섹션의 경로 포인트 생성
        let totalHeight = document.body.scrollHeight;
        let sectionCount = Object.keys(this.sections).length;
        
        // 섹션별 경로 계산
        for (let i = 0; i < this.pathPoints; i++) {
            let progress = i / (this.pathPoints - 1);
            let scrollY = progress * totalHeight;
            
            // X 좌표는 부드러운 곡선을 따라 이동 (사인파 사용)
            let x = Math.sin(progress * Math.PI * 2) * 150 + window.innerWidth / 2;
            
            // 안전 여백
            if (x < 100) x = 100;
            if (x > window.innerWidth - 100) x = window.innerWidth - 100;
            
            this.rocketPath.push({
                x: x,
                y: scrollY,
                rotation: -progress * 90 // 0도에서 -90도로 회전 (아래쪽으로)
            });
        }
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 스크롤 이벤트
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 창 크기 조정 이벤트
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 마우스 움직임 이벤트
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // 링크 클릭 이벤트 감지 (로켓 부스터 효과)
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
    }
    
    // 초기 위치 설정
    setInitialPosition() {
        if (this.rocket) {
            const initialPosition = this.getPositionFromScroll(window.scrollY);
            this.updateRocketPosition(initialPosition);
            
            // 초기에는 로켓 숨기기 (페이지 로드 애니메이션 후 표시)
            this.rocket.style.opacity = '0';
            
            // 페이지 로드 후 로켓 표시
            setTimeout(() => {
                this.rocket.style.opacity = '1';
                this.rocket.style.transition = 'opacity 1s ease-in-out';
            }, 2500);
        }
    }
    
    // 스크롤 이벤트 핸들러
    handleScroll() {
        if (!this.rocket) return;
        
        // 현재 스크롤 위치에 따른 로켓 위치 계산
        const position = this.getPositionFromScroll(window.scrollY);
        
        // 로켓 위치 업데이트
        this.updateRocketPosition(position);
        
        // 로켓 궤적 생성
        this.createTrail(position);
        
        // 현재 섹션 감지 및 클래스 업데이트
        this.updateCurrentSection();
    }
    
    // 크기 조정 이벤트 핸들러
    handleResize() {
        // 경로 재계산
        this.rocketPath = [];
        this.initPath();
        
        // 현재 위치 업데이트
        const position = this.getPositionFromScroll(window.scrollY);
        this.updateRocketPosition(position);
    }
    
    // 마우스 이동 이벤트 핸들러
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // 로켓이 마우스를 향해 약간 회전
        if (this.rocket) {
            const rocketRect = this.rocket.getBoundingClientRect();
            const rocketCenterX = rocketRect.left + rocketRect.width / 2;
            const rocketCenterY = rocketRect.top + rocketRect.height / 2;
            
            // 마우스와 로켓 사이의 각도 계산
            const angle = Math.atan2(this.mouseY - rocketCenterY, this.mouseX - rocketCenterX);
            
            // 현재 회전 각도에 약간의 영향만 주기
            const currentRotation = this.getCurrentRotation();
            const tiltAmount = 15; // 최대 회전 각도
            const tilt = Math.sin(angle) * tiltAmount;
            
            // 현재 섹션별 회전 + 마우스 영향
            this.rocket.style.transform = `rotate(${currentRotation + tilt}deg)`;
        }
    }
    
    // 링크 클릭 이벤트 핸들러
    handleLinkClick(e) {
        // 현재 페이지 내 링크인 경우에만 처리
        if (e.currentTarget.getAttribute('href').startsWith('#')) {
            // 로켓 부스터 효과
            this.activateBoost();
        }
    }
    
    // 스크롤 위치에 따른 로켓 위치 계산
    getPositionFromScroll(scrollY) {
        // 스크롤 위치를 기준으로 경로 포인트 찾기
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollY / totalHeight, 1);
        const pathIndex = Math.floor(scrollProgress * (this.rocketPath.length - 1));
        
        // 정확한 경로 포인트가 없는 경우, 보간
        if (pathIndex >= this.rocketPath.length - 1) {
            return this.rocketPath[this.rocketPath.length - 1];
        }
        
        const currentPoint = this.rocketPath[pathIndex];
        const nextPoint = this.rocketPath[pathIndex + 1];
        
        // 두 포인트 사이의 진행률 계산
        const pointProgress = (scrollProgress * (this.rocketPath.length - 1)) - pathIndex;
        
        // 두 포인트 사이 보간
        return {
            x: currentPoint.x + (nextPoint.x - currentPoint.x) * pointProgress,
            y: scrollY,
            rotation: currentPoint.rotation + (nextPoint.rotation - currentPoint.rotation) * pointProgress
        };
    }
    
    // 로켓 위치 업데이트
    updateRocketPosition(position) {
        if (!this.rocket) return;
        
        // 화면 밖으로 나가지 않도록 제한
        const rocketWidth = this.rocket.offsetWidth;
        const rocketHeight = this.rocket.offsetHeight;
        const maxX = window.innerWidth - rocketWidth / 2;
        const minX = rocketWidth / 2;
        
        // 마우스 위치와의 거리 조절을 위한 계수 (값이 클수록 마우스와 멀어짐)
        const distanceMultiplier = 1.5; // 거리 계수 증가 (기본값 1.0에서 1.5로 조정)
        const smoothingFactor = 0.2; // 부드러운 이동을 위한 계수 (0.1 ~ 1.0 사이 값, 작을수록 부드러움)
        
        // 마우스 위치에 따른 위치 조정
        const targetX = position.x + (this.mouseX - position.x) * (1 - 1/distanceMultiplier);
        const targetY = window.innerHeight * 0.5 + (this.mouseY - window.innerHeight * 0.5) * (1 - 1/distanceMultiplier);
        
        // 부드러운 이동 적용
        let x = parseFloat(this.rocket.style.left) || position.x;
        x = x + (targetX - x) * smoothingFactor;
        
        // 화면 경계 제한
        x = Math.min(Math.max(x, minX), maxX);
        
        // 로켓 위치 설정
        this.rocket.style.left = `${x}px`;
        this.rocket.style.top = `${targetY}px`;
    }
    
    // 현재 섹션 감지 및 클래스 업데이트
    updateCurrentSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // 현재 섹션 찾기
        for (const [section, element] of Object.entries(this.sections)) {
            if (!element) continue;
            
            const sectionTop = element.offsetTop;
            const sectionBottom = sectionTop + element.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
                break;
            }
        }
        
        // 현재 섹션이 바뀌면 클래스 업데이트
        if (currentSection && currentSection !== this.currentSection) {
            // 현재 섹션 변경 감지
            const prevSection = this.currentSection;
            this.currentSection = currentSection;
            
            // 로켓에 섹션별 클래스 추가
            this.rocket.className = '';
            this.rocket.classList.add(`rocket-${currentSection}`);
            
            // 섹션 전환 시 로켓 부스터 효과
            this.activateBoost();
            
            // 착륙 애니메이션 (컨택트 섹션에 도달했을 때)
            if (currentSection === 'contact') {
                this.rocket.style.animation = 'landing 2s ease-in-out infinite';
            } else {
                this.rocket.style.animation = '';
            }
        }
    }
    
    // 로켓 부스터 효과
    activateBoost() {
        // 화염 효과 강화
        this.flame.style.height = '60px';
        this.flame.style.opacity = '1';
        
        // 로켓 이미지에 클래스 추가
        this.rocketImg.classList.add('rocket-boost');
        
        // 이전 타임아웃 취소
        if (this.boostTimeout) {
            clearTimeout(this.boostTimeout);
        }
        
        // 일정 시간 후 효과 제거
        this.boostTimeout = setTimeout(() => {
            this.flame.style.height = '';
            this.flame.style.opacity = '';
            this.rocketImg.classList.remove('rocket-boost');
        }, 500);
    }
    
    // 로켓 궤적 생성
    createTrail(position) {
        // 궤적이 너무 많으면 오래된 것 제거
        if (this.trailElements.length >= this.maxTrailElements) {
            const oldTrail = this.trailElements.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
        
        // 새 궤적 요소 생성
        const trail = document.createElement('div');
        trail.className = 'rocket-trail';
        
        // 로켓 위치에 궤적 배치
        const rocketRect = this.rocket.getBoundingClientRect();
        const trailSize = Math.random() * 5 + 5; // 5-10px 크기
        
        trail.style.width = `${trailSize}px`;
        trail.style.height = `${trailSize}px`;
        trail.style.left = `${rocketRect.left + rocketRect.width / 2}px`;
        trail.style.top = `${rocketRect.bottom - 20}px`; // 로켓 하단에서 약간 위
        
        // 문서에 궤적 추가
        document.body.appendChild(trail);
        this.trailElements.push(trail);
        
        // 일정 시간 후 궤적 제거
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
                const index = this.trailElements.indexOf(trail);
                if (index > -1) {
                    this.trailElements.splice(index, 1);
                }
            }
        }, 1500); // 페이드 아웃 애니메이션과 동일한 시간
    }
    
    // 현재 섹션에 따른 회전 각도 가져오기
    getCurrentRotation() {
        switch (this.currentSection) {
            case 'home': return 0;
            case 'about': return -15;
            case 'experience': return -30;
            case 'skills': return -45;
            case 'portfolio': return -60;
            case 'contact': return -90;
            default: return 0;
        }
    }
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 로켓 애니메이션 초기화
    const rocketAnimation = new RocketAnimation();
});
