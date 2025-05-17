/**
 * Cosmic Portfolio - 성능 테스트 유틸리티
 * 웹 사이트 성능 및 최적화를 테스트하기 위한 유틸리티 모듈
 */

import { isMobile, isLowPowerMode } from './config.js';

class PerformanceTest {
  constructor() {
    // 싱글톤 패턴
    if (PerformanceTest.instance) {
      return PerformanceTest.instance;
    }
    
    PerformanceTest.instance = this;
    
    // 성능 지표
    this.metrics = {
      pageLoad: null,
      fcp: null,
      lcp: null,
      cls: null,
      fid: null,
      ttfb: null,
      resourceLoading: {},
      memoryUsage: []
    };
    
    // 상태 플래그
    this.testing = false;
    this.startTime = 0;
    
    // 관찰자
    this.observer = null;
    
    // 초기화
    this.init();
  }
  
  /**
   * 초기화
   */
  init() {
    // Web Vitals API 지원 확인
    if ('performance' in window && 'getEntriesByType' in performance) {
      console.log('성능 테스트 유틸리티 초기화됨');
    } else {
      console.warn('성능 API가 지원되지 않습니다. 일부 지표를 측정할 수 없습니다.');
    }
  }
  
  /**
   * 성능 테스트 시작
   * @returns {PerformanceTest} 인스턴스
   */
  start() {
    if (this.testing) {
      console.warn('성능 테스트가 이미 실행 중입니다.');
      return this;
    }
    
    this.testing = true;
    this.startTime = performance.now();
    this.metrics = {
      pageLoad: null,
      fcp: null,
      lcp: null,
      cls: null,
      fid: null,
      ttfb: null,
      resourceLoading: {},
      memoryUsage: []
    };
    
    console.log('성능 테스트 시작');
    
    // 페이지 로드 이벤트 등록
    window.addEventListener('load', this.onPageLoad.bind(this), { once: true });
    
    // 성능 관찰자 등록
    this.registerObservers();
    
    // 메모리 사용량 기록 시작
    this.startMemoryLogging();
    
    return this;
  }
  
  /**
   * 페이지 로드 완료 처리
   */
  onPageLoad() {
    // 페이지 로드 시간 기록
    this.metrics.pageLoad = performance.now() - this.startTime;
    
    // 네비게이션 타이밍 수집
    this.collectNavigationTiming();
    
    // 리소스 타이밍 수집
    this.collectResourceTiming();
    
    console.log(`페이지 로드 완료: ${this.metrics.pageLoad.toFixed(2)}ms`);
  }
  
  /**
   * 성능 관찰자 등록
   */
  registerObservers() {
    // PerformanceObserver 지원 확인
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP) 관찰
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcpEntry = entries[entries.length - 1];
          this.metrics.fcp = fcpEntry.startTime;
          console.log(`FCP: ${this.metrics.fcp.toFixed(2)}ms`);
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        console.warn('FCP 관찰 오류:', e);
      }
      
      // Largest Contentful Paint (LCP) 관찰
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lcpEntry = entries[entries.length - 1];
          this.metrics.lcp = lcpEntry.startTime;
          console.log(`LCP: ${this.metrics.lcp.toFixed(2)}ms`);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP 관찰 오류:', e);
      }
      
      // Cumulative Layout Shift (CLS) 관찰
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // CLS는 누적값
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS 관찰 오류:', e);
      }
      
      // First Input Delay (FID) 관찰
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.metrics.fid = entry.processingStart - entry.startTime;
            console.log(`FID: ${this.metrics.fid.toFixed(2)}ms`);
            break;
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID 관찰 오류:', e);
      }
    }
  }
  
  /**
   * 네비게이션 타이밍 수집
   */
  collectNavigationTiming() {
    if (!performance || !performance.getEntriesByType) return;
    
    const navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry) {
      this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      
      console.log(`TTFB: ${this.metrics.ttfb.toFixed(2)}ms`);
      console.log(`DNS 조회: ${(navEntry.domainLookupEnd - navEntry.domainLookupStart).toFixed(2)}ms`);
      console.log(`연결 설정: ${(navEntry.connectEnd - navEntry.connectStart).toFixed(2)}ms`);
      console.log(`응답 시간: ${(navEntry.responseEnd - navEntry.responseStart).toFixed(2)}ms`);
      console.log(`DOM 처리: ${(navEntry.domComplete - navEntry.domInteractive).toFixed(2)}ms`);
    }
  }
  
  /**
   * 리소스 타이밍 수집
   */
  collectResourceTiming() {
    if (!performance || !performance.getEntriesByType) return;
    
    const resourceEntries = performance.getEntriesByType('resource');
    const categories = {
      script: [],
      css: [],
      image: [],
      font: [],
      other: []
    };
    
    resourceEntries.forEach(entry => {
      const url = entry.name;
      const type = entry.initiatorType;
      const duration = entry.duration;
      const size = entry.transferSize || 0;
      
      let category = 'other';
      if (type === 'script') category = 'script';
      else if (type === 'css' || type === 'link' && url.includes('.css')) category = 'css';
      else if (type === 'img' || url.match(/\.(jpe?g|png|gif|webp|avif|svg)$/i)) category = 'image';
      else if (url.match(/\.(woff2?|ttf|otf|eot)$/i)) category = 'font';
      
      categories[category].push({
        url: url.split('/').pop(), // 파일명만 추출
        duration,
        size
      });
    });
    
    // 리소스 종류별 평균 로딩 시간 및 총 크기 계산
    for (const [category, items] of Object.entries(categories)) {
      if (items.length > 0) {
        const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
        const totalSize = items.reduce((sum, item) => sum + item.size, 0);
        const avgDuration = totalDuration / items.length;
        
        this.metrics.resourceLoading[category] = {
          count: items.length,
          totalSize: (totalSize / 1024).toFixed(2) + ' KB',
          avgDuration: avgDuration.toFixed(2) + ' ms',
          items
        };
        
        console.log(`${category} 리소스: ${items.length}개, 평균 ${avgDuration.toFixed(2)}ms, 총 ${(totalSize / 1024).toFixed(2)}KB`);
      }
    }
  }
  
  /**
   * 메모리 사용량 로깅 시작
   */
  startMemoryLogging() {
    if (!performance || !performance.memory) {
      console.warn('메모리 API가 지원되지 않습니다.');
      return;
    }
    
    // 초기 메모리 사용량 기록
    this.logMemoryUsage();
    
    // 주기적으로 메모리 사용량 기록 (5초마다)
    const intervalId = setInterval(() => {
      if (!this.testing) {
        clearInterval(intervalId);
        return;
      }
      
      this.logMemoryUsage();
    }, 5000);
  }
  
  /**
   * 현재 메모리 사용량 기록
   */
  logMemoryUsage() {
    if (!performance || !performance.memory) return;
    
    const memory = performance.memory;
    const usage = {
      totalJSHeapSize: (memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + ' MB',
      usedJSHeapSize: (memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + ' MB',
      timestamp: new Date().toISOString()
    };
    
    this.metrics.memoryUsage.push(usage);
  }
  
  /**
   * 성능 테스트 종료
   * @returns {Object} 성능 지표
   */
  end() {
    if (!this.testing) {
      console.warn('성능 테스트가 실행 중이지 않습니다.');
      return this.metrics;
    }
    
    this.testing = false;
    
    // 마지막 메모리 사용량 기록
    this.logMemoryUsage();
    
    // 환경 정보 추가
    this.metrics.environment = {
      userAgent: navigator.userAgent,
      mobile: isMobile(),
      lowPowerMode: isLowPowerMode(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : null
    };
    
    console.log('성능 테스트 종료. 결과:', this.metrics);
    
    return this.metrics;
  }
  
  /**
   * 결과 보고서 생성
   * @returns {string} HTML 포맷의 보고서
   */
  generateReport() {
    const metrics = this.metrics;
    
    let report = `
      <div class="performance-report">
        <h2>성능 테스트 보고서</h2>
        
        <h3>핵심 웹 지표</h3>
        <table>
          <tr>
            <th>지표</th>
            <th>값</th>
            <th>평가</th>
          </tr>
          <tr>
            <td>FCP (First Contentful Paint)</td>
            <td>${metrics.fcp ? metrics.fcp.toFixed(2) + 'ms' : 'N/A'}</td>
            <td>${this.getRating('fcp', metrics.fcp)}</td>
          </tr>
          <tr>
            <td>LCP (Largest Contentful Paint)</td>
            <td>${metrics.lcp ? metrics.lcp.toFixed(2) + 'ms' : 'N/A'}</td>
            <td>${this.getRating('lcp', metrics.lcp)}</td>
          </tr>
          <tr>
            <td>FID (First Input Delay)</td>
            <td>${metrics.fid ? metrics.fid.toFixed(2) + 'ms' : 'N/A'}</td>
            <td>${this.getRating('fid', metrics.fid)}</td>
          </tr>
          <tr>
            <td>CLS (Cumulative Layout Shift)</td>
            <td>${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</td>
            <td>${this.getRating('cls', metrics.cls)}</td>
          </tr>
          <tr>
            <td>TTFB (Time to First Byte)</td>
            <td>${metrics.ttfb ? metrics.ttfb.toFixed(2) + 'ms' : 'N/A'}</td>
            <td>${this.getRating('ttfb', metrics.ttfb)}</td>
          </tr>
          <tr>
            <td>페이지 로드 시간</td>
            <td>${metrics.pageLoad ? metrics.pageLoad.toFixed(2) + 'ms' : 'N/A'}</td>
            <td>${this.getRating('pageLoad', metrics.pageLoad)}</td>
          </tr>
        </table>
        
        <h3>리소스 로딩</h3>
        <table>
          <tr>
            <th>리소스 유형</th>
            <th>개수</th>
            <th>총 크기</th>
            <th>평균 로딩 시간</th>
          </tr>
    `;
    
    for (const [category, data] of Object.entries(metrics.resourceLoading)) {
      report += `
        <tr>
          <td>${category}</td>
          <td>${data.count}</td>
          <td>${data.totalSize}</td>
          <td>${data.avgDuration}</td>
        </tr>
      `;
    }
    
    report += `
        </table>
        
        <h3>환경 정보</h3>
        <table>
          <tr>
            <td>모바일 기기</td>
            <td>${metrics.environment?.mobile ? '예' : '아니오'}</td>
          </tr>
          <tr>
            <td>저전력 모드</td>
            <td>${metrics.environment?.lowPowerMode ? '예' : '아니오'}</td>
          </tr>
          <tr>
            <td>화면 크기</td>
            <td>${metrics.environment?.viewport.width}x${metrics.environment?.viewport.height}</td>
          </tr>
    `;
    
    if (metrics.environment?.connection) {
      report += `
        <tr>
          <td>네트워크 유형</td>
          <td>${metrics.environment.connection.effectiveType}</td>
        </tr>
        <tr>
          <td>대역폭</td>
          <td>${metrics.environment.connection.downlink} Mbps</td>
        </tr>
      `;
    }
    
    report += `
        </table>
      </div>
    `;
    
    return report;
  }
  
  /**
   * 성능 지표 평가
   * @param {string} metric - 지표 이름
   * @param {number} value - 지표 값
   * @returns {string} 평가 결과
   */
  getRating(metric, value) {
    if (!value) return 'N/A';
    
    // 각 지표별 등급 기준
    const ratings = {
      fcp: { good: 1000, needs_improvement: 3000 },
      lcp: { good: 2500, needs_improvement: 4000 },
      fid: { good: 100, needs_improvement: 300 },
      cls: { good: 0.1, needs_improvement: 0.25 },
      ttfb: { good: 600, needs_improvement: 1000 },
      pageLoad: { good: 3000, needs_improvement: 6000 }
    };
    
    const threshold = ratings[metric];
    if (!threshold) return 'N/A';
    
    if (metric === 'cls') {
      // CLS는 작을수록 좋음
      if (value <= threshold.good) return '좋음';
      if (value <= threshold.needs_improvement) return '개선 필요';
      return '나쁨';
    } else {
      // 나머지는 밀리초 단위로 작을수록 좋음
      if (value <= threshold.good) return '좋음';
      if (value <= threshold.needs_improvement) return '개선 필요';
      return '나쁨';
    }
  }
}

// 글로벌 인스턴스 생성
const performanceTest = new PerformanceTest();

// 기본 내보내기
export default performanceTest; 