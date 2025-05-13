/**
 * Cosmic Portfolio - 레트로 버튼 효과
 * 김성민의 우주 테마 포트폴리오
 */

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 레트로 버튼 효과 초기화
    initRetroButtons();
});

// 레트로 버튼 효과 초기화 함수
function initRetroButtons() {
    const retroButtons = document.querySelectorAll('.retro-btn');
    
    // 각 버튼에 효과 적용
    retroButtons.forEach(button => {
        // 클릭 효과음 추가
        button.addEventListener('click', () => {
            playClickSound();
        });
        
        // 호버 효과
        button.addEventListener('mouseenter', () => {
            addGlowEffect(button);
        });
        
        button.addEventListener('mouseleave', () => {
            removeGlowEffect(button);
        });
    });
    
    // GSAP이 로드되어 있으면 추가 애니메이션 적용
    if (typeof gsap !== 'undefined') {
        applyGsapAnimations(retroButtons);
    }
}

// 클릭 효과음 재생
function playClickSound() {
    // AudioContext가 지원되는 경우에만 실행
    if (window.AudioContext || window.webkitAudioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        // 오실레이터 생성
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // 오실레이터 설정
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.1);
        
        // 볼륨 설정
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        // 연결 및 재생
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
}

// 버튼에 글로우 효과 추가
function addGlowEffect(button) {
    const variant = getButtonVariant(button);
    let glowColor;
    
    // 버튼 종류에 따라 글로우 색상 설정
    switch (variant) {
        case 'cosmic':
            glowColor = 'rgba(110, 68, 255, 0.5)';
            break;
        case 'nebula':
            glowColor = 'rgba(255, 68, 161, 0.5)';
            break;
        case 'galaxy':
            glowColor = 'rgba(10, 189, 227, 0.5)';
            break;
        case 'red':
            glowColor = 'rgba(231, 76, 60, 0.5)';
            break;
        case 'blue':
            glowColor = 'rgba(52, 152, 219, 0.5)';
            break;
        case 'green':
            glowColor = 'rgba(46, 204, 113, 0.5)';
            break;
        case 'default':
            glowColor = 'rgba(255, 123, 37, 0.5)';
            break;
        default:
            glowColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    button.style.boxShadow = `0 0 10px ${glowColor}`;
}

// 글로우 효과 제거
function removeGlowEffect(button) {
    button.style.boxShadow = '1px 1px 1px rgba(255, 255, 255, 0.6)';
}

// 버튼 종류 확인
function getButtonVariant(button) {
    const classList = button.classList;
    const variants = ['default', 'dark-gray', 'white', 'light-gray', 'gray', 'red', 'blue', 'green', 'cosmic', 'nebula', 'galaxy'];
    
    for (const variant of variants) {
        if (classList.contains(variant)) {
            return variant;
        }
    }
    
    return 'default';
}

// GSAP 애니메이션 적용
function applyGsapAnimations(buttons) {
    // 버튼 등장 애니메이션
    gsap.from(buttons, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.retro-btn-group',
            start: 'top 80%'
        }
    });
    
    // 버튼 내부 텍스트 애니메이션
    const buttonTexts = document.querySelectorAll('.retro-btn-inner');
    
    gsap.from(buttonTexts, {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.3,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.retro-btn-group',
            start: 'top 80%'
        }
    });
} 