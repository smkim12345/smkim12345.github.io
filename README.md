# 🌌 Cosmic Portfolio - 김성민의 우주 테마 웹 포트폴리오

![Portfolio Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Version](https://img.shields.io/badge/Version-3.0-blue.svg)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript%20%7C%20GSAP-green.svg)
![Performance](https://img.shields.io/badge/Performance-Optimized-orange.svg)

## 👨‍💻 프로젝트 소개

분석적 사고와 창의적 디자인 역량을 겸비한 **문제 해결사** 김성민의 웹디자인 & 퍼블리셔 포트폴리오입니다.

> **"우주의 무한한 가능성처럼, 창의적인 디자인으로 무한한 사용자 경험을 만들어갑니다."**

기계공학 배경과 디자인 감각을 결합하여 독특하고 효과적인 디지털 경험을 창출하는 것을 목표로 합니다.

## ✨ 주요 특징

### 🌟 **우주 테마 인터랙티브 배경**
- **반짝이는 별자리**: 60개(데스크톱)/40개(모바일) 다양한 크기의 별
- **떠다니는 입자**: 우주 먼지를 모사한 15개(데스크톱)/8개(모바일) 입자
- **성능 최적화**: GPU 가속, 저전력 모드 지원, 반응형 요소 개수 조정                
- **업데이트**: 성운 효과와 유성 효과 제거하여 배경 단순화

### 🚀 **인터랙티브 로켓 시스템**
- **마우스 추적**: 사용자 커서를 따라다니는 3D 로켓
- **스마트 착륙**: Contact 섹션에서 자동 착륙/이륙
- **상태 지속**: 로컬 스토리지로 착륙 상태 유지
- **모바일 터치 지원**: 스와이프, 더블 탭 제스처 지원
- **화염 효과**: 실시간 로켓 화염 애니메이션

### 🎨 **고급 애니메이션 시스템**
- **GSAP 기반**: ScrollTrigger, TextPlugin 활용
- **섹션별 전환**: 자연스러운 섹션 간 애니메이션
- **스킬 게이지**: Intersection Observer 기반 스킬 바 채우기 애니메이션
- **네비게이션 동기화**: 스크롤에 따른 메뉴 자동 활성화

### 📱 **완벽한 반응형 디자인**
- **모바일 우선**: 모든 기기에 최적화된 경험
- **디바이스별 최적화**: 성능과 UX를 고려한 기능 조정
- **모바일 프리뷰**: 아이폰 목업을 활용한 모바일 뷰어 기능

## 🛠️ 기술 스택

### **Frontend Technologies**
- **HTML5**: 시멘틱 마크업, 웹 표준 준수
- **CSS3**: Grid, Flexbox, 최신 CSS 변수 활용
- **JavaScript ES6+**: 모던 자바스크립트, 모듈 시스템

### **Animation & Effects**
- **GSAP (GreenSock)**: Timeline, ScrollTrigger, TextPlugin
- **CSS Animations**: 미세한 호버 효과 및 전환

### **Performance & Optimization**
- **Lazy Loading**: 이미지 지연 로딩
- **GPU Acceleration**: `will-change`, `transform` 활용
- **Throttled Events**: 스크롤, 리사이즈 이벤트 최적화
- **Modular Architecture**: 독립적인 모듈 시스템

## 📁 프로젝트 구조

```
cosmic-portfolio/
├── 📁 docs/                      # 문서
│   ├── project_plan.md           # 프로젝트 계획서
│   └── README.md                 # 프로젝트 가이드
├── 📁 css/                       # 스타일시트
│   ├── main.css                  # 메인 스타일
│   ├── animations.css            # 애니메이션 효과
│   ├── cosmic-background.css     # 우주 배경 효과
│   ├── improved-rocket.css       # 로켓 애니메이션
│   ├── profile-section.css       # 프로필 섹션
│   ├── portfolio-modal.css       # 포트폴리오 모달
│   ├── skill-animation.css       # 스킬 애니메이션
│   ├── responsive.css            # 반응형 디자인
│   ├── compact-timeline.css      # 타임라인 디자인
│   ├── contact-space.css         # 연락처 섹션
│   ├── device-gallery.css        # 디바이스 갤러리
│   ├── mobile-viewer.css         # 모바일 미리보기
│   ├── planet-surface.css        # 행성 표면 효과
│   └── certificates.css          # 자격증 디자인
├── 📁 js/                        # JavaScript
│   ├── main-optimized.js         # 메인 기능 (모듈)
│   ├── cosmic-background-enhanced.js  # 우주 배경 효과 (성운 제거)
│   ├── gsap-rocket-improved.js   # 로켓 애니메이션
│   ├── rocket-event-handler.js   # 로켓 이벤트 처리기
│   ├── portfolio-filter.js       # 포트폴리오 필터링
│   ├── portfolio-modal.js        # 포트폴리오 상세 모달
│   ├── skill-animation.js        # 스킬 게이지 애니메이션
│   ├── navigation-manager.js     # 네비게이션 관리
│   ├── compact-timeline.js       # 타임라인 기능
│   ├── contact-space.js          # 연락처 섹션 기능
│   ├── device-gallery.js         # 디바이스 갤러리 기능
│   ├── 3d/                       # 3D 관련 컴포넌트
│   ├── animations/               # 애니메이션 모듈
│   ├── components/               # UI 컴포넌트
│   ├── data/                     # 데이터 관리
│   ├── modules/                  # 기능 모듈
│   ├── utils/                    # 유틸리티 함수
│   └── workers/                  # 웹 워커
├── 📁 images/                    # 이미지 자산
│   ├── 3d rocket_bg.png          # 로켓 이미지
│   ├── 프로필사진/               # 프로필 이미지
│   │   ├── 메인사진.png          # 메인 프로필 이미지
│   │   └── 정장.jpg              # 정장 프로필 이미지
│   ├── 트로피카나/               # 프로젝트별 이미지
│   ├── 제네시스/
│   ├── 갤럭시버즈/
│   ├── 리스크아이/
│   ├── 인스타그램/
│   ├── 맥도날드/
│   ├── 투썸/
│   ├── 갸스비/
│   └── 푸터/
└── index.html                    # 메인 HTML 파일
```

## 📱 페이지 구성

### 🏠 **홈 섹션**
- 인상적인 인트로 애니메이션
- 타이포그래피 애니메이션 효과
- CTA 버튼 (포트폴리오 보기, 자기소개서, 연락하기)
- 우측에 프로필 사진 표시

### 👤 **통합 프로필 섹션**
- **소개**: 개인 소개 및 철학
- **연혁**: 컴팩트 가로 스크롤 타임라인
- **자격증**: 아이콘과 함께하는 배지 디스플레이
- **스킬**: 애니메이션 게이지 바 시각화

### 🎨 **포트폴리오 섹션**
- 카테고리별 필터링 (웹디자인, 앱디자인, 패키지, 광고, 로고)
- 모달 팝업을 통한 상세 정보 제공
- 사용 도구 및 프로젝트 링크 연동

### 📬 **연락하기 섹션**
- 우주 테마 캐릭터 (우주복 아바타)
- 카카오톡 연동 (인터랙티브)
- 로켓 착륙 시스템 연동

## 🚀 주요 구현 기능

### 1. **우주 배경 효과 시스템**
```javascript
// 디버그 명령어
window.debugCosmicBackground.status()      // 상태 확인
window.debugCosmicBackground.pause()       // 일시정지
window.debugCosmicBackground.resume()      // 재개
window.debugCosmicBackground.restart()     // 재시작
```

### 2. **로켓 애니메이션 시스템**
```javascript
// 로켓 제어
window.rocketInstance.pauseAnimation()     // 일시정지
window.rocketInstance.resumeAnimation()    // 재개
window.rocketInstance.setOffsetDistance(100)  // 오프셋 거리 설정
window.rocketInstance.setFixedRotation(45)    // 로켓 회전 설정
```

### 3. **포트폴리오 현황** 
- **트로피카나 스파클링** (패키지 디자인) ✅
- **제네시스 웹 리디자인** ✅ + 실제 링크 연동
- **갤럭시 버즈3 프로** (상세페이지) ✅
- **리스크아이 로고** (브랜딩) ✅
- **인스타그램 광고 배너** (디지털 마케팅) ✅
- **맥도날드** (브랜딩) ✅
- **투썸** (웹 디자인) ✅
- **갸스비** (패키지 디자인) ✅

### 4. **성능 최적화**
- **모바일 최적화**: 요소 개수 자동 조정 (별, 입자 감소)
- **애니메이션 관리**: 페이지 비가시성 시 자동 일시정지
- **메모리 관리**: 자동 리소스 정리 시스템
- **반응형 조정**: 화면 크기별 최적화된 경험
- **배경 효과 간소화**: 성운 및 유성 효과 제거로 성능 개선

## 🎯 설계 원칙

### **사용자 경험 중심**
- 직관적인 내비게이션
- 부드러운 애니메이션 전환
- 모든 기기에서 일관된 경험

### **성능 최적화**
- 60fps 애니메이션 유지
- 메모리 누수 방지
- 배터리 절약 모드 지원

### **접근성 고려**
- 저전력 모드 지원
- 키보드 네비게이션
- 시멘틱 HTML 구조

## 🔧 개발 환경 설정

### **요구사항**
- 모던 브라우저 (Chrome, Firefox, Safari, Edge)
- GSAP CDN 연결
- Font Awesome 아이콘 라이브러리

### **로컬 실행**
```bash
# 저장소 클론
git clone [repository-url]

# 프로젝트 디렉토리로 이동
cd cosmic-portfolio

# Live Server로 실행 (VSCode Extension 권장)
# 또는 Python 간단 서버
python -m http.server 8000
```

## 📊 브라우저 지원

| Browser | Desktop | Mobile |
|---------|---------|---------|
| Chrome  | ✅ 90+  | ✅ 90+  |
| Firefox | ✅ 85+  | ✅ 85+  |
| Safari  | ✅ 14+  | ✅ 14+  |
| Edge    | ✅ 90+  | ✅ 90+  |

## 🔮 향후 계획

### **단기 계획**
- [ ] WebP 포맷 이미지 최적화
- [ ] ARIA 속성 추가 (접근성 개선)
- [ ] PWA 기능 추가

### **장기 계획**
- [ ] React/Vue 리팩토링 고려
- [ ] WebGL 기반 3D 효과 검토
- [ ] 다국어 지원 (영어)

## 👥 기여자

**주요 개발자**: 김성민  
**역할**: 디자인, 프론트엔드 개발, 애니메이션 구현

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었으며, 모든 권리는 김성민에게 있습니다.

## 📞 연락처

- **이메일**: hg951214@naver.com
- **전화**: 010-6677-4015
- **GitHub**: [GitHub Profile]
- **LinkedIn**: [LinkedIn Profile]

---

<div align="center">

*"우주의 신비로움을 웹에 담다"* 🌌  
**Cosmic Portfolio** - 김성민

[![Portfolio Preview](https://img.shields.io/badge/🚀-Live%20Demo-blue)](https://your-portfolio-url.com)

</div>

---

## 🛠️ 기술적 구현 세부사항

### **GSAP 애니메이션 최적화**
- Timeline 기반 중앙 집중 관리
- ScrollTrigger를 활용한 뷰포트 기반 애니메이션
- 하드웨어 가속을 위한 transform 사용

### **모듈러 아키텍처**
- 각 기능별 독립적인 모듈 설계
- 이벤트 리스너 중복 방지 시스템
- 디버깅 도구 내장

### **반응형 디자인 전략**
```css
/* 모바일 우선 접근 */
@media (max-width: 768px) {
    /* 성능 최적화 규칙 */
    .cosmic-background { /* 효과 감소 */ }
    
    /* 프로필 이미지 조정 */
    .profile-section-photo {
        width: 350px;
        right: 50%;
        transform: translate(50%, -50%);
    }
}
```

### **배경 효과 최적화**
```javascript
// cosmic-background-enhanced.js
class EnhancedCosmicBackground {
    constructor() {
        // 성능을 위해 모바일에서 요소 개수 감소
        this.config = {
            starCount: this.isMobile ? 40 : 60,
            floatingParticles: this.isMobile ? 8 : 15
        };
    }
    
    // 성운과 유성 효과는 제거되었습니다
}
```

이 포트폴리오는 기술적 완성도와 창의적 디자인을 모두 추구하는 웹 개발자의 종합적인 역량을 보여줍니다.
