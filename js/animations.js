/**
 * Cosmic Portfolio - GSAP 애니메이션
 * 김성민의 우주 테마 포트폴리오
 */

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // GSAP 플러그인 등록
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // 페이지 전체 애니메이션 초기화
    initAnimations();
});

// 모든 애니메이션 초기화
function initAnimations() {
    // 각 섹션 페이드인 애니메이션
    initSectionAnimations();
    
    // 소개 섹션 애니메이션
    initAboutAnimation();
    
    // 경력 및 자격증 섹션 애니메이션
    initExperienceAnimation();
    
    // 스킬 섹션 애니메이션
    initSkillsAnimation();
    
    // 포트폴리오 섹션 애니메이션
    initPortfolioAnimation();
    
    // 컨택트 섹션 애니메이션
    initContactAnimation();
    
    // 배경 파티클 애니메이션 초기화
    initParticleBackground();
}

// 섹션 페이드인 애니메이션
function initSectionAnimations() {
    // 모든 섹션 선택
    const sections = document.querySelectorAll('section:not(.hero-section)');
    
    sections.forEach(section => {
        // 섹션 타이틀 애니메이션
        const sectionHeader = section.querySelector('.section-header');
        
        if (sectionHeader) {
            gsap.from(sectionHeader, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }
        
        // 섹션 콘텐츠 페이드인
        const sectionContent = section.querySelector('.container > div:not(.section-header)');
        
        if (sectionContent) {
            gsap.from(sectionContent, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 60%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
    });
}

// 소개 섹션 애니메이션
function initAboutAnimation() {
    const aboutSection = document.querySelector('.about-section');
    
    if (!aboutSection) return;
    
    // 텍스트 단락 애니메이션
    const paragraphs = aboutSection.querySelectorAll('.about-text p');
    
    gsap.from(paragraphs, {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // 이미지 및 오비트 애니메이션
    const orbitElement = aboutSection.querySelector('.orbit');
    const avatarElement = aboutSection.querySelector('.planet-avatar');
    
    if (orbitElement && avatarElement) {
        // 오비트 회전 애니메이션
        gsap.to(orbitElement, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none'
        });
        
        // 아바타 펄스 애니메이션
        gsap.to(avatarElement, {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        // 초기 등장 애니메이션
        gsap.from(avatarElement, {
            scrollTrigger: {
                trigger: '.about-image',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            opacity: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
        });
    }
    
    // 떠다니는 별 애니메이션
    const stars = aboutSection.querySelectorAll('.floating-star');
    
    stars.forEach((star, index) => {
        // 초기 등장 애니메이션
        gsap.from(star, {
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
        });
        
        // 무한 떠다니는 애니메이션
        gsap.to(star, {
            y: `random(-20, 20)`,
            x: `random(-20, 20)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });
    
    // 유성 애니메이션
    const meteor = aboutSection.querySelector('.meteor');
    
    if (meteor) {
        gsap.to(meteor, {
            x: -2000,
            y: 1000,
            duration: 6,
            repeat: -1,
            repeatDelay: 4,
            delay: 2,
            ease: 'power1.in',
            onStart: () => meteor.style.opacity = 1,
            onRepeat: () => {
                gsap.set(meteor, {
                    x: 100,
                    y: -100,
                    opacity: 0
                });
                setTimeout(() => {
                    meteor.style.opacity = 1;
                }, 100);
            }
        });
    }
}

// 경력 및 자격증 섹션 애니메이션
function initExperienceAnimation() {
    const experienceSection = document.querySelector('.experience-section');
    
    if (!experienceSection) return;
    
    // 타임라인 애니메이션
    const timelineContainers = experienceSection.querySelectorAll('.timeline-container');
    
    timelineContainers.forEach((container, index) => {
        gsap.from(container, {
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: container.classList.contains('left') ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
    
    // 자격증 애니메이션
    const certificates = experienceSection.querySelectorAll('.certificate-item');
    
    gsap.from(certificates, {
        scrollTrigger: {
            trigger: '.certificates',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
}

// 스킬 섹션 애니메이션
function initSkillsAnimation() {
    const skillsSection = document.querySelector('.skills-section');
    
    if (!skillsSection) return;
    
    // 스킬 카테고리 애니메이션
    const skillCategories = skillsSection.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // 스킬 행성 애니메이션
    const planets = skillsSection.querySelectorAll('.skills-planets .planet');
    
    planets.forEach((planet, index) => {
        // 초기 등장 애니메이션
        gsap.from(planet, {
            scrollTrigger: {
                trigger: skillsSection,
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: 0.5 + (index * 0.2),
            ease: 'elastic.out(1, 0.3)'
        });
        
        // 무한 떠다니는 애니메이션
        gsap.to(planet, {
            y: `random(-15, 15)`,
            x: `random(-15, 15)`,
            rotation: `random(-10, 10)`,
            duration: `random(4, 8)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });
}

// 포트폴리오 섹션 애니메이션
function initPortfolioAnimation() {
    const portfolioSection = document.querySelector('.portfolio-section');
    
    if (!portfolioSection) return;
    
    // 필터 버튼 애니메이션 제거 - 문제 해결을 위해
    const filterBtns = portfolioSection.querySelectorAll('.filter-btn');
    
    // 모든 버튼이 항상 보이도록 설정
    gsap.set(filterBtns, {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        display: 'inline-block'
    });
    
    // 포트폴리오 아이템 애니메이션
    const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
    
    gsap.from(portfolioItems, {
        scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // 포트폴리오 아이템 호버 효과
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const content = item.querySelector('.overlay-content');
        
        if (overlay && content) {
            item.addEventListener('mouseenter', () => {
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.1
                });
                
                gsap.to(content, {
                    y: 0,
                    opacity: 1,
                    duration: 0.1,
                    delay: 0.03
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.1
                });
                
                gsap.to(content, {
                    y: 20,
                    opacity: 0,
                    duration: 0.1
                });
            });
        }
    });
}

// 컨택트 섹션 애니메이션
function initContactAnimation() {
    const contactSection = document.querySelector('.contact-section');
    
    if (!contactSection) return;
    
    // 컨택트 카드 애니메이션
    const contactCards = contactSection.querySelectorAll('.contact-card');
    
    gsap.from(contactCards, {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // 메시지 박스 애니메이션
    const cosmicMessage = contactSection.querySelector('.cosmic-message');
    
    if (cosmicMessage) {
        gsap.from(cosmicMessage, {
            scrollTrigger: {
                trigger: cosmicMessage,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'power3.out'
        });
        
        // 별 깜빡임 애니메이션
        const stars = cosmicMessage.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            gsap.to(star, {
                scale: 1.5,
                opacity: 0.3,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.3
            });
        });
    }
    
    // 폼 애니메이션
    const formElements = contactSection.querySelectorAll('.form-group, .contact-form button');
    
    gsap.from(formElements, {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // 우주인 애니메이션
    const astronaut = contactSection.querySelector('.astronaut');
    
    if (astronaut) {
        // 초기 등장 애니메이션
        gsap.from(astronaut, {
            scrollTrigger: {
                trigger: contactSection,
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            x: -100,
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        });
        
        // 부유 애니메이션
        gsap.to(astronaut, {
            y: -30,
            x: 20,
            rotation: 10,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1
        });
    }
    
    // 행성 부유 애니메이션
    const planet = contactSection.querySelector('.planet-6');
    
    if (planet) {
        gsap.to(planet, {
            y: -20,
            x: -10,
            rotation: -5,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// 배경 파티클 초기화
function initParticleBackground() {
    // 캔버스 선택
    const canvas = document.getElementById('space-background');
    
    if (!canvas) return;
    
    // 캔버스 크기 설정
    resizeCanvas();
    
    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', resizeCanvas);
    
    // 캔버스 크기 조정 함수
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 파티클 설정 업데이트
        if (typeof createParticles === 'function') {
            createParticles();
        }
    }
}
