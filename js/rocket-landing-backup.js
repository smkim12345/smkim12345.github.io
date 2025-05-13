/**
 * Cosmic Portfolio - 濡쒖폆 李⑸쪠 ?좊땲硫붿씠?? * 留덉?留??뱀뀡?먯꽌 濡쒖폆???됱꽦 ?쒕㈃??李⑸쪠?섎뒗 ?④낵
 */

// 濡쒖폆 李⑸쪠 ?대옒??class RocketLanding {
    constructor() {
        // ?붿냼 李몄“
        this.rocket = document.getElementById('rocket-element');
        this.landingSpot = document.getElementById('rocket-landing-spot');
        this.landingMarker = document.querySelector('.landing-marker');
        this.contactSection = document.getElementById('contact');
        this.planetSurface = document.getElementById('planet-surface');
        
        // ?곹깭
        this.isLanded = false;
        this.isAnimating = false;
        this.lastScrollPosition = 0;
        this.originalRocketPosition = null;
        
        // 李⑸쪠 ?꾩튂
        this.landingX = 0;
        this.landingY = 0;
        
        // 濡쒖뺄 ?ㅽ넗由ъ??먯꽌 李⑸쪠 ?곹깭 蹂듭썝
        this.restoreLandingState();
        
        // 珥덇린??        if (this.rocket && this.landingSpot && this.planetSurface) {
            console.log("濡쒖폆 李⑸쪠 ?쒖뒪??珥덇린???깃났");
            this.init();
        } else {
            console.error('濡쒖폆 李⑸쪠 ?쒖뒪??珥덇린???ㅽ뙣: ?꾩슂???붿냼瑜?李얠쓣 ???놁뒿?덈떎.');
            console.log("濡쒖폆:", this.rocket);
            console.log("李⑸쪠吏??", this.landingSpot);
            console.log("?됱꽦?쒕㈃:", this.planetSurface);
        }
    }
    
    /**
     * 珥덇린??     */
    init() {
        // ?됱꽦 ?쒕㈃ 珥덇린??        this.initPlanetSurface();
        
        // 湲곌린 媛먯? (紐⑤컮??理쒖쟻?붿슜)
        this.isMobile = window.innerWidth <= 768;
        
        // ?ㅽ겕濡??대깽??由ъ뒪???ㅼ젙
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // ?붾㈃ ?ш린 蹂寃?媛먯?
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 留덉슦??異붿쟻 ?쒖꽦???щ? ?뺤씤
        this.mouseFollowEnabled = !this.isLanded; // 李⑸쪠 ?곹깭媛 ?꾨땺 ?뚮쭔 留덉슦??異붿쟻 ?쒖꽦??        
        // 泥댄겕 媛꾧꺽?쇰줈 留덉슦??異붿쟻 媛???щ? ?낅뜲?댄듃 (?ㅻⅨ ?ㅽ겕由쏀듃???異⑸룎 諛⑹?)
        setInterval(() => {
            if (window.improvedRocketAnimation) {
                window.improvedRocketAnimation.mouseFollowEnabled = this.mouseFollowEnabled && !this.isLanded;
            }
        }, 500);
        
        console.log('濡쒖폆 李⑸쪠 紐⑤뱢 珥덇린?붾맖 - 李⑸쪠 ?곹깭:', this.isLanded, '紐⑤컮??', this.isMobile);
    }
    
    /**
     * ?붾㈃ ?ш린 蹂寃?媛먯? 諛?泥섎━
     */
    handleResize() {
        // 紐⑤컮???곹깭 ?낅뜲?댄듃
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // 湲곌린 ?좏삎 蹂寃???UI 議곗젙
        if (wasMobile !== this.isMobile) {
            console.log(`湲곌린 ?좏삎 蹂寃? ${this.isMobile ? '紐⑤컮?? : '?곗뒪?ы넲'} 紐⑤뱶濡?李⑸쪠 ?쒖뒪??理쒖쟻??);
            
            // ?대? 李⑸쪠???곹깭?쇰㈃ ?꾩튂 ?ъ“??            if (this.isLanded && this.rocket) {
                this.adjustLandedRocketPosition();
            }
        }
    }
    
    /**
     * 李⑸쪠??濡쒖폆 ?꾩튂 議곗젙 (湲곌린 蹂寃???
     */
    adjustLandedRocketPosition() {
        if (!this.rocket || !this.isLanded) return;
        
        // ?곗＜蹂?罹먮┃???꾩튂 湲곗??쇰줈 ?ш퀎??        const astronautChar = document.getElementById('kakao-chat-link');
        
        if (astronautChar) {
            const astronautRect = astronautChar.getBoundingClientRect();
            
            // 紐⑤컮???곗뒪?ы넲???곕Ⅸ ?꾩튂 議곗젙
            let xOffset = this.isMobile ? -200 : -300;
            let yOffset = this.isMobile ? -200 : -250;
            
            // ?덈? ?꾩튂(px) 怨꾩궛
            this.landingX = astronautRect.right + xOffset + window.scrollX;
            this.landingY = astronautRect.bottom + yOffset + window.scrollY;
            
            // ?꾩튂 ?낅뜲?댄듃
            this.rocket.style.left = this.landingX + 'px';
            this.rocket.style.top = this.landingY + 'px';
            
            // 濡쒖뺄 ?ㅽ넗由ъ????곹깭 ???            this.saveLandingState();
        }
    }
    
    /**
     * ?ㅽ겕濡??대깽???몃뱾??     */
    handleScroll() {
        // ?꾩옱 ?ㅽ겕濡??꾩튂
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // ?ㅽ겕濡?諛⑺뼢 ?뺤씤
        const isScrollingDown = scrollPosition > this.lastScrollPosition;
        this.lastScrollPosition = scrollPosition;
        
        // ?섏씠吏 ?섎떒???꾨떖?덈뒗吏 ?뺤씤 (留덉?留??뱀뀡)
        const isNearBottom = (scrollPosition + windowHeight) >= (docHeight - 100);
        
        // 而⑦깮???뱀뀡 ?꾩튂
        const contactRect = this.contactSection.getBoundingClientRect();
        
        // 而⑦깮???뱀뀡???붾㈃??蹂댁씠?붿? ?뺤씤
        const isContactVisible = contactRect.top < windowHeight && contactRect.bottom > 0;
        
        // 濡쒖폆??李⑸쪠??議곌굔: 留덉?留??뱀뀡??蹂댁씠怨? ?꾩쭅 李⑸쪠?섏? ?딆븯????        if (isContactVisible && isNearBottom && !this.isLanded && !this.isAnimating) {
            this.landRocket();
        }
        
        // 濡쒖폆???대쪠??議곌굔: ?대? 李⑸쪠?덉?留??꾨줈 ?ㅽ겕濡ㅽ븯??留덉?留??뱀뀡??踰쀬뼱????        if (this.isLanded && !isScrollingDown && !isContactVisible && !this.isAnimating) {
            this.launchRocket();
        }
    }
    
    /**
     * 濡쒖뺄 ?ㅽ넗由ъ????곹깭 ???     */
    saveLandingState() {
        localStorage.setItem('rocketLanded', 'true');
        localStorage.setItem('landingX', this.landingX);
        localStorage.setItem('landingY', this.landingY);
        localStorage.setItem('landingPositionType', 'absolute');
    }
    
    /**
     * 濡쒖뺄 ?ㅽ넗由ъ??먯꽌 ?곹깭 蹂듭썝
     */
    restoreLandingState() {
        const isLanded = localStorage.getItem('rocketLanded') === 'true';
        
        if (isLanded) {
            this.isLanded = true;
            this.landingX = parseFloat(localStorage.getItem('landingX') || 100);
            this.landingY = parseFloat(localStorage.getItem('landingY') || 100);
            const positionType = localStorage.getItem('landingPositionType') || 'percent';
            
            // ?곹깭 蹂듭썝 - DOM??紐⑤몢 濡쒕뱶?????ㅽ뻾
            setTimeout(() => {
                // ?먮옒 濡쒖폆 ?꾩튂 諛??ㅽ???蹂듭썝
                if (this.rocket) {
                    this.rocket.style.opacity = 1;
                    
                    // ?꾩튂 ??낆뿉 ?곕씪 ?곸슜 諛⑹떇 遺꾨━
                    if (positionType === 'absolute') {
                        // ?덈? ?꾩튂濡??ㅼ젙
                        this.rocket.style.position = 'absolute';
                        this.rocket.style.left = this.landingX + 'px';
                        this.rocket.style.top = this.landingY + 'px';
                    } else {
                        // 湲곗〈 諛⑹떇 ?좎?(?댁쟾 踰꾩쟾怨쇱쓽 ?명솚??
                        this.rocket.style.left = this.landingX + '%';
                        this.rocket.style.top = this.landingY + '%';
                    }
                    
                    // 濡쒖폆 ?ㅼ???諛??뚯쟾 ?좎?
                    gsap.set(this.rocket, {
                        scale: 3,
                        rotation: 0
                    });
                    
                    // ?붿뿼 ?④낵 議곗젅
                    const flame = this.rocket.querySelector('.rocket-flame');
                    if (flame) {
                        gsap.set(flame, {
                            height: '20px',
                            opacity: 0.4
                        });
                        // 李⑸쪠 ?곹깭?먯꽌???붿뿼???④?
                        flame.style.display = 'none';
                    }
                }
                
                // 而⑦깮???뱀뀡??李⑸쪠 ?대옒??異붽?
                if (this.contactSection) {
                    this.contactSection.classList.add('rocket-has-landed');
                }
            }, 500);
        }
    }
    
    /**
     * 濡쒖폆 李⑸쪠 ?좊땲硫붿씠??- 紐⑤컮??理쒖쟻??踰꾩쟾
     */
    landRocket() {
        if (!this.rocket || this.isAnimating) return;
        
        // ?좊땲硫붿씠???곹깭 ?ㅼ젙
        this.isAnimating = true;
        
        // 留덉슦???곗튂 異붿쟻 鍮꾪솢?깊솕
        this.mouseFollowEnabled = false;
        if (window.improvedRocketAnimation) {
            this.originalRocketPosition = {
                left: parseFloat(this.rocket.style.left) || 50,
                top: parseFloat(this.rocket.style.top) || 50
            };
        }
        
        // 李⑸쪠 吏???꾩튂 怨꾩궛 - ?곗＜蹂?罹먮┃???꾩튂 湲곗??쇰줈 怨꾩궛
        const astronautChar = document.getElementById('kakao-chat-link');
        let landingX, landingY;
        
        if (astronautChar) {
            const astronautRect = astronautChar.getBoundingClientRect();
            
            // 紐⑤컮???곗뒪?ы넲???곕Ⅸ ?꾩튂 議곗젙
            let xOffset = this.isMobile ? -200 : -300;
            let yOffset = this.isMobile ? -100 : -120;
            
            // ?덈? ?꾩튂(px) 怨꾩궛
            landingX = astronautRect.right + xOffset + window.scrollX;
            landingY = astronautRect.bottom + yOffset + window.scrollY;
        } else {
            // ?곗＜蹂?罹먮┃?곕? 李얠쓣 ???녿뒗 寃쎌슦 湲곕낯 李⑸쪠 吏???ъ슜
            const landingRect = this.landingSpot.getBoundingClientRect();
            
            // 紐⑤컮???곗뒪?ы넲???곕Ⅸ ?꾩튂 議곗젙
            let xOffset = this.isMobile ? 150 : 200;
            let yOffset = this.isMobile ? 10 : 10;
            
            landingX = landingRect.left + landingRect.width / 2 + xOffset + window.scrollX;
            landingY = landingRect.top + landingRect.height / 2 + yOffset + window.scrollY;
        }
        
        // 李⑸쪠 ?꾩튂 ???(?덈? ?꾩튂)
        this.landingX = landingX;
        this.landingY = landingY;
        
        // ?좊땲硫붿씠?섏슜 ?곷? ?꾩튂 怨꾩궛 (gsap ?좊땲硫붿씠???명솚???좎?)
        const relLandingX = (landingX - window.scrollX) / window.innerWidth * 100;
        const relLandingY = (landingY - window.scrollY) / window.innerHeight * 100;
        
        // 李⑸쪠 留덉빱 ?쒖꽦??        this.landingMarker.classList.add('active');
        
        // 湲곌린 ?좏삎???곕Ⅸ ?좊땲硫붿씠??議곗젙
        const initialDuration = this.isMobile ? 0.8 : 1; // 紐⑤컮?쇱뿉??議곌툑 ??鍮좊Ⅴ寃?        const middleDuration = this.isMobile ? 0.6 : 0.8;
        const finalDuration = this.isMobile ? 0.8 : 1;
        const finalScale = this.isMobile ? 2.5 : 3; // 紐⑤컮?쇱뿉??議곌툑 ???묎쾶
        
        // 李⑸쪠 ?좊땲硫붿씠??(4?④퀎濡??몃텇??
        // 1. 濡쒖폆??李⑸쪠 吏???꾨줈 ?대룞
        gsap.to(this.rocket, {
            left: relLandingX + '%',
            top: (relLandingY - (this.isMobile ? 25 : 30)) + '%', // 紐⑤컮?쇱뿉??議곌툑 ??媛源앷쾶
            rotation: 0, // ?섏쭅 諛⑺뼢?쇰줈 ?뚯쟾
            duration: initialDuration,
            ease: 'power1.inOut',
            onComplete: () => {
                // 2. 濡쒖폆 泥쒖쿇???대젮?ㅺ린 ?쒖옉
                gsap.to(this.rocket, {
                    top: (relLandingY - (this.isMobile ? 12 : 15)) + '%', // 以묎컙 ?뺣룄源뚯? ?대젮??                    scale: this.isMobile ? 1.8 : 2, // ?ш린 ?뺣? (紐⑤컮?쇱뿉??議곌툑 ???묎쾶)
                    duration: middleDuration,
                    ease: 'power2.in',
                    onComplete: () => {
                        // 3. 理쒖쥌 李⑸쪠 ?꾩튂濡???泥쒖쿇???대젮??                        gsap.to(this.rocket, {
                            top: relLandingY + '%', // 理쒖쥌 李⑸쪠 ?꾩튂
                            scale: finalScale, // 理쒖쥌 ?ш린 (紐⑤컮?쇱뿉??議곌툑 ???묎쾶)
                            duration: finalDuration,
                            ease: 'power3.out',
                            onComplete: () => {
                                // ?됱꽦 ?쒕㈃ 異⑸룎 ?④낵
                                this.createLandingImpact();
                                
                                // 4. 李⑸쪠 ???붾뱾由?- ?붾뱾由??④낵 ?쒓굅
                                // 諛붾줈 理쒖쥌 ?꾩튂濡??ㅼ젙
                                // 李⑸쪠 ?꾩뿉??濡쒖폆??fixed?먯꽌 absolute濡?蹂寃쏀븯怨??덈? ?꾩튂濡??ㅼ젙
                                this.rocket.style.position = 'absolute';
                                this.rocket.style.left = this.landingX + 'px';
                                this.rocket.style.top = this.landingY + 'px';
                                
                                // 而⑦깮???뱀뀡??李⑸쪠 ?대옒??異붽?
                                if (this.contactSection) {
                                    this.contactSection.classList.add('rocket-has-landed');
                                }
                                
                                // ?곹깭 ?낅뜲?댄듃
                                this.isLanded = true;
                                this.isAnimating = false;
                                
                                // 濡쒖뺄 ?ㅽ넗由ъ????곹깭 ???                                this.saveLandingState();
                                
                                // 濡쒖폆 ?붿뿼 以꾩씠湲?                                const flame = this.rocket.querySelector('.rocket-flame');
                                if (flame) {
                                    gsap.to(flame, {
                                        height: this.isMobile ? '15px' : '20px', // 紐⑤컮?쇱뿉?????묎쾶
                                        opacity: 0.4,
                                        duration: 0.5,
                                        onComplete: () => {
                                            // 李⑸쪠 ?꾨즺 ???붿뿼 ?꾩쟾???④린湲?                                            flame.style.display = 'none';
                                        }
                                    });
                                }
                                
                                console.log('濡쒖폆 李⑸쪠 ?꾨즺 - ?덈? ?꾩튂:', this.landingX, this.landingY, '紐⑤컮??', this.isMobile);
                            }
                        });
                    }
                });
            }
        });
    }
    
    /**
     * 濡쒖폆 ?대쪠 ?좊땲硫붿씠??- 紐⑤컮??理쒖쟻??踰꾩쟾
     */
    launchRocket() {
        if (!this.rocket || this.isAnimating || !this.isLanded) return;
        
        // ?좊땲硫붿씠???곹깭 ?ㅼ젙
        this.isAnimating = true;
        
        // 濡쒖뺄 ?ㅽ넗由ъ??먯꽌 李⑸쪠 ?곹깭 ?쒓굅
        localStorage.removeItem('rocketLanded');
        localStorage.removeItem('landingX');
        localStorage.removeItem('landingY');
        localStorage.removeItem('landingPositionType');
        
        // 李⑸쪠 ?대옒???쒓굅
        if (this.contactSection) {
            this.contactSection.classList.remove('rocket-has-landed');
        }
        
        // ?꾩옱 ?덈? ?꾩튂瑜?媛?몄샂
        const rocketRect = this.rocket.getBoundingClientRect();
        
        // 怨좎젙 ?꾩튂?먯꽌 fixed ?ъ??섏쑝濡??섎룎由?        this.rocket.style.position = 'fixed';
        
        // ?꾩옱 ?덈? ?꾩튂瑜??좎??섍린 ?꾪빐 ?쎌? ?⑥쐞濡??ㅼ젙
        this.rocket.style.left = rocketRect.left + 'px';
        this.rocket.style.top = rocketRect.top + 'px';
        
        // ?쎄컙??吏????酉고룷???곷? ?꾩튂濡?蹂??(媛묒옉?ㅻ윭???꾩튂 蹂寃?諛⑹?)
        setTimeout(() => {
            // ?꾩옱 ?쎌? ?꾩튂瑜?酉고룷???곷? ?꾩튂濡?蹂??            const relativeX = (rocketRect.left / window.innerWidth) * 100;
            const relativeY = (rocketRect.top / window.innerHeight) * 100;
            
            // 酉고룷???곷? ?꾩튂濡??ㅼ젙
            this.rocket.style.left = relativeX + '%';
            this.rocket.style.top = relativeY + '%';
            
            // ?붿뿼 ?쒖꽦??            const flame = this.rocket.querySelector('.rocket-flame');
            if (flame) {
                // ?붿뿼 ?쒖떆 癒쇱? ?ㅼ젙
                flame.style.display = 'block';
                
                // 湲곌린 ?좏삎???곕Ⅸ ?ㅼ젙 議곗젙
                const flameHeight = this.isMobile ? '45px' : '60px'; // 紐⑤컮?쇱뿉???묎쾶
                
                // ?붿뿼 ?ш린? ?щ챸???ㅼ젙
                gsap.to(flame, {
                    height: flameHeight,
                    opacity: 1,
                    duration: 0.5
                });
            }
            
            // 李⑸쪠 留덉빱 鍮꾪솢?깊솕
            if (this.landingMarker) {
                this.landingMarker.classList.remove('active');
            }
            
            // ?대쪠 ?④낵
            this.createLaunchEffect();
            
            // 紐⑤컮??理쒖쟻???좊땲硫붿씠??吏???쒓컙
            const upwardDuration = this.isMobile ? 0.6 : 0.8;  // 紐⑤컮?쇱뿉??吏㏐쾶
            const returnDuration = this.isMobile ? 0.6 : 0.8;  // 紐⑤컮?쇱뿉??吏㏐쾶
            
            // 濡쒖폆 蹂댁씠湲?(?먮옒 ?ш린濡?蹂듦?)
            gsap.to(this.rocket, {
                opacity: 1,
                scale: this.isMobile ? 0.9 : 1, // 紐⑤컮?쇱뿉??議곌툑 ?묎쾶
                duration: 0.5
            });
            
            // ?대쪠 ?좊땲硫붿씠??(2?④퀎濡?媛꾩냼??
            // 1. ?꾨줈 ?잛븘?ㅻ쫫 (?붾뱾由??④낵 ?쒓굅)
            gsap.to(this.rocket, {
                top: '-=' + (this.isMobile ? '15%' : '20%'), // 紐⑤컮?쇱뿉????吏㏐쾶
                rotation: this.isMobile ? 20 : 30, // 紐⑤컮?쇱뿉???뚯쟾 媛먯냼
                duration: upwardDuration,
                ease: 'power2.out',
                onComplete: () => {
                    // 2. 留덉슦???꾩튂濡?蹂듦?
                    if (this.originalRocketPosition) {
                        gsap.to(this.rocket, {
                            left: this.originalRocketPosition.left + '%',
                            top: this.originalRocketPosition.top + '%',
                            rotation: 0,
                            duration: returnDuration,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                // ?대쪠 ?꾨즺
                                this.isLanded = false;
                                this.isAnimating = false;
                                
                                // 留덉슦??異붿쟻 ?ㅼ떆 ?쒖꽦??                                this.mouseFollowEnabled = true;
                            }
                        });
                    } else {
                        // ?먮옒 ?꾩튂 ?뺣낫媛 ?녿뒗 寃쎌슦 ?붾㈃ 以묒븰?쇰줈
                        gsap.to(this.rocket, {
                            left: '50%',
                            top: '50%',
                            rotation: 0,
                            duration: returnDuration,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                // ?대쪠 ?꾨즺
                                this.isLanded = false;
                                this.isAnimating = false;
                                
                                // 留덉슦??異붿쟻 ?ㅼ떆 ?쒖꽦??                                this.mouseFollowEnabled = true;
                            }
                        });
                    }
                }
            });
        }, 50); // ?쎄컙??吏?곗쑝濡?遺?쒕윭???꾪솚 蹂댁옣
    }
    
    /**
     * 李⑸쪠 吏??留덉빱 ?쒖꽦??     */
    activateLandingMarker() {
        if (this.landingMarker) {
            // GSAP濡?遺?쒕윭???④낵 ?곸슜
            gsap.to(this.landingMarker, {
                opacity: 0.4,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    /**
     * ?됱꽦 ?쒕㈃ ?④낵 珥덇린??     */
    initPlanetSurface() {
        // ?됱꽦 ?쒕㈃??GSAP ?좊땲硫붿씠???곸슜
        const craters = document.querySelectorAll('.crater');
        
        // ?щ젅?댄꽣 ?좊땲硫붿씠??        craters.forEach(crater => {
            gsap.to(crater, {
                backgroundColor: 'rgba(10, 28, 52, 0.7)',
                boxShadow: 'inset 0 3px 10px rgba(0, 0, 0, 0.7)',
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 3
            });
        });
        
        // ?됱꽦 湲濡쒖슦 ?④낵
        const planetGlow = document.querySelector('.planet-glow');
        if (planetGlow) {
            gsap.to(planetGlow, {
                opacity: 0.7,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    /**
     * 李⑸쪠 異⑷꺽 ?④낵 - 紐⑤컮??理쒖쟻??踰꾩쟾
     */
    createLandingImpact() {
        // 異⑷꺽???④낵 ?붿냼 ?앹꽦
        const impactWave = document.createElement('div');
        impactWave.className = 'impact-wave';
        this.landingSpot.appendChild(impactWave);
        
        // 紐⑤컮???섍꼍???곕Ⅸ ?ш린 諛??④낵 議곗젙
        const waveSize = this.isMobile ? '80px' : '100px'; // 紐⑤컮?쇱뿉???묎쾶
        const waveBorder = this.isMobile ? '1px' : '2px';  // 紐⑤컮?쇱뿉???뉕쾶
        
        // 異⑷꺽???ㅽ????ㅼ젙
        gsap.set(impactWave, {
            position: 'absolute',
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: waveBorder + ' solid rgba(76, 149, 219, 0.8)',
            opacity: 1,
            zIndex: 6
        });
        
        // 異⑷꺽???좊땲硫붿씠??        gsap.to(impactWave, {
            width: waveSize,
            height: waveSize,
            opacity: 0,
            duration: this.isMobile ? 0.8 : 1, // 紐⑤컮?쇱뿉??吏㏐쾶
            ease: 'power2.out',
            onComplete: () => {
                // ?좊땲硫붿씠???꾨즺 ???쒓굅
                if (impactWave.parentNode) {
                    impactWave.parentNode.removeChild(impactWave);
                }
            }
        });
        
        // 癒쇱? ?④낵 ?앹꽦 - 紐⑤컮?쇱뿉?쒕뒗 媛쒖닔 媛먯냼
        const particleCount = this.isMobile ? 6 : 10;
        for (let i = 0; i < particleCount; i++) {
            this.createDustParticle();
        }
    }
    
    /**
     * 癒쇱? ?낆옄 ?앹꽦 - 紐⑤컮??理쒖쟻??踰꾩쟾
     */
    createDustParticle() {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';
        this.landingSpot.appendChild(dust);
        
        // 紐⑤컮???섍꼍???곕Ⅸ ?ш린 諛??④낵 議곗젙
        const baseSize = this.isMobile ? 1.5 : 2;  // 紐⑤컮?쇱뿉???묎쾶
        const maxSize = this.isMobile ? 4 : 6;     // 紐⑤컮?쇱뿉???묎쾶
        
        // ?쒕뜡 ?꾩튂? ?ш린
        const size = Math.random() * baseSize + maxSize;
        const xOffset = (Math.random() - 0.5) * (this.isMobile ? 40 : 60); // 紐⑤컮?쇱뿉???묎쾶
        
        // 癒쇱? 湲곕낯 ?ㅽ???        gsap.set(dust, {
            position: 'absolute',
            left: 'calc(50% + ' + xOffset + 'px)',
            top: '50%',
            width: size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            backgroundColor: 'rgba(100, 140, 180, ' + (Math.random() * 0.5 + 0.2) + ')',
            opacity: 1,
            zIndex: 5
        });
        
        // 紐⑤컮?쇱뿉?쒕뒗 ??? ?믪씠, 吏㏃? 吏???쒓컙
        const moveY = this.isMobile ? (Math.random() * 30 + 8) : (Math.random() * 40 + 10);
        const moveX = (Math.random() - 0.5) * (this.isMobile ? 50 : 80);
        const animDuration = this.isMobile ? (Math.random() * 0.8 + 0.4) : (Math.random() * 1 + 0.5);
        
        // 癒쇱? ?좊땲硫붿씠??        gsap.to(dust, {
            y: '-=' + moveY,
            x: moveX,
            opacity: 0,
            duration: animDuration,
            ease: 'power2.out',
            onComplete: () => {
                // ?좊땲硫붿씠???꾨즺 ???쒓굅
                if (dust.parentNode) {
                    dust.parentNode.removeChild(dust);
                }
            }
        });
    }
    
    /**
     * ?대쪠 ?④낵 - 紐⑤컮??理쒖쟻??踰꾩쟾
     */
    createLaunchEffect() {
        // 癒쇱? ?낆옄 - 紐⑤컮?쇱뿉?쒕뒗 媛쒖닔 媛먯냼
        const particleCount = this.isMobile ? 12 : 20;
        for (let i = 0; i < particleCount; i++) {
            this.createDustParticle();
        }
        
        // 吏꾨룞 ?④낵 - 紐⑤컮?쇱뿉?쒕뒗 媛뺣룄 媛먯냼
        gsap.to(this.planetSurface, {
            x: this.isMobile ? 2 : 3,
            duration: 0.1,
            repeat: this.isMobile ? 3 : 5,
            yoyo: true,
            ease: 'none'
        });
    }
    
    /**
     * 留덉슦??異붿쟻 ?곹깭 ?뺤씤
     * @returns {boolean} 留덉슦??異붿쟻 ?쒖꽦???щ?
     */
    isMouseFollowEnabled() {
        return this.mouseFollowEnabled;
    }
}

// DOM??濡쒕뱶?????ㅽ뻾
document.addEventListener('DOMContentLoaded', () => {
    // 濡쒕뵫 ?붾㈃???쒓굅????濡쒖폆 李⑸쪠 ?쒖뒪??珥덇린??    setTimeout(() => {
        // ??媛앹껜 ?앹꽦怨?window???좊떦
        window.rocketLanding = new RocketLanding();
    }, 3000);
});

