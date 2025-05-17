/**
 * Cosmic Portfolio - 성능 모니터링 컴포넌트
 * 웹 사이트의 성능을 모니터링하고 자동 최적화 처리
 */

import { performanceConfig, isMobile, isLowPowerMode } from '../utils/config.js';
import * as ThreeUtils from '../3d/ThreeUtils.js';

class PerformanceMonitor {
  constructor(options = {}) {
    // 싱글톤 패턴 적용
    if (PerformanceMonitor.instance) {
      return PerformanceMonitor.instance;
    }
    
    PerformanceMonitor.instance = this;
    
    // 옵션 설정
    this.options = {
      checkInterval: options.checkInterval || 5000, // 5초마다 체크
      fpsThreshold: options.fpsThreshold || 30, // 30fps 이하면 최적화
      memoryThreshold: options.memoryThreshold || 150, // 150MB 초과하면 경고
      showStats: options.showStats || performanceConfig.debug.showStats,
      autoOptimize: options.autoOptimize !== false,
      ...options
    };
    
    // 상태 저장
    this.stats = {
      fps: 0,
      memory: 0,
      lastFrameTime: 0,
      frameCount: 0,
      memoryHistory: [],
      fpsHistory: [],
      lowPowerMode: isLowPowerMode() || isMobile(),
      optimizationLevel: 0 // 0: 없음, 1: 낮음, 2: 중간, 3: 높음
    };
    
    // 측정 타이머
    this.intervals = {
      monitor: null,
      fps: null
    };
    
    // UI 요소
    this.ui = {
      container: null,
      fpsCounter: null,
      memoryCounter: null
    };
    
    // 최적화 콜백 함수 목록
    this.optimizationCallbacks = new Set();
    
    // 초기화
    this.init();
  }
  
  /**
   * 초기화
   */
  init() {
    // FPS 측정 시작
    this.startFpsMeasurement();
    
    // 성능 모니터링 시작
    this.startMonitoring();
    
    // 디버그 모드면 통계 UI 표시
    if (this.options.showStats) {
      this.createStatsUI();
    }
    
    // 자동 최적화 함수 등록
    if (this.options.autoOptimize) {
      this.registerOptimizations();
    }
    
    // 가시성 변경 감지
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseMonitoring();
      } else {
        this.resumeMonitoring();
      }
    });
    
    // 초기 성능 확인 및 권장 설정 적용
    this.checkPerformanceCapabilities();
  }
  
  /**
   * FPS 측정 시작
   */
  startFpsMeasurement() {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    // 프레임 카운터 함수
    const countFrames = (timestamp) => {
      // 프레임 카운트 증가
      frameCount++;
      
      // 1초 간격으로 FPS 계산
      if (timestamp - lastFrameTime >= 1000) {
        this.stats.fps = Math.round(frameCount * 1000 / (timestamp - lastFrameTime));
        this.stats.fpsHistory.push(this.stats.fps);
        
        // 히스토리 최대 60개 유지
        if (this.stats.fpsHistory.length > 60) {
          this.stats.fpsHistory.shift();
        }
        
        // 상태 UI 업데이트
        this.updateStatsUI();
        
        // 리셋
        lastFrameTime = timestamp;
        frameCount = 0;
      }
      
      // 다음 프레임 요청
      this.intervals.fps = requestAnimationFrame(countFrames);
    };
    
    // 측정 시작
    this.intervals.fps = requestAnimationFrame(countFrames);
  }
  
  /**
   * 메모리 사용량 측정
   * @returns {number} 메모리 사용량 (MB)
   */
  measureMemory() {
    // 브라우저가 performance.memory를 지원하는 경우
    if (window.performance && performance.memory) {
      this.stats.memory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
      this.stats.memoryHistory.push(this.stats.memory);
      
      // 히스토리 최대 60개 유지
      if (this.stats.memoryHistory.length > 60) {
        this.stats.memoryHistory.shift();
      }
      
      return this.stats.memory;
    }
    
    // Three.js 메모리 사용량 추정 시도
    const threeUsage = ThreeUtils.estimateMemoryUsage();
    if (threeUsage && threeUsage.estimatedMB) {
      this.stats.memory = parseFloat(threeUsage.estimatedMB);
      this.stats.memoryHistory.push(this.stats.memory);
      
      // 히스토리 최대 60개 유지
      if (this.stats.memoryHistory.length > 60) {
        this.stats.memoryHistory.shift();
      }
      
      return this.stats.memory;
    }
    
    return 0;
  }
  
  /**
   * 성능 모니터링 시작
   */
  startMonitoring() {
    // 모니터링 인터벌 설정
    this.intervals.monitor = setInterval(() => {
      // 메모리 측정
      const memoryUsage = this.measureMemory();
      
      // FPS가 임계값 이하거나 메모리가 임계값 이상이면 최적화 실행
      const avgFps = this.getAverageFps();
      const isLowFps = avgFps > 0 && avgFps < this.options.fpsThreshold;
      const isHighMemory = memoryUsage > this.options.memoryThreshold;
      
      // 디버그 UI 업데이트
      this.updateStatsUI();
      
      // 자동 최적화 활성화된 경우
      if (this.options.autoOptimize && (isLowFps || isHighMemory)) {
        // 최적화 레벨 결정
        let requiredLevel = 0;
        
        if (isLowFps && isHighMemory) {
          requiredLevel = 3; // 높은 최적화
        } else if (isLowFps || (isHighMemory && memoryUsage > this.options.memoryThreshold * 1.5)) {
          requiredLevel = 2; // 중간 최적화
        } else {
          requiredLevel = 1; // 낮은 최적화
        }
        
        // 현재 레벨보다 더 높은 최적화가 필요한 경우에만 적용
        if (requiredLevel > this.stats.optimizationLevel) {
          this.applyOptimizations(requiredLevel);
        }
      }
    }, this.options.checkInterval);
  }
  
  /**
   * 모니터링 일시 중지
   */
  pauseMonitoring() {
    // 측정 인터벌 중지
    clearInterval(this.intervals.monitor);
    cancelAnimationFrame(this.intervals.fps);
    
    this.intervals.monitor = null;
    this.intervals.fps = null;
  }
  
  /**
   * 모니터링 재개
   */
  resumeMonitoring() {
    if (!this.intervals.monitor) {
      this.startMonitoring();
    }
    
    if (!this.intervals.fps) {
      this.startFpsMeasurement();
    }
  }
  
  /**
   * 통계 UI 생성
   */
  createStatsUI() {
    // 이미 생성되어 있으면 종료
    if (this.ui.container) return;
    
    // 컨테이너 생성
    const container = document.createElement('div');
    container.className = 'performance-stats';
    container.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      padding: 8px;
      border-top-left-radius: 4px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;
    
    // FPS 카운터
    const fpsCounter = document.createElement('div');
    fpsCounter.className = 'fps-counter';
    fpsCounter.innerHTML = 'FPS: --';
    
    // 메모리 카운터
    const memoryCounter = document.createElement('div');
    memoryCounter.className = 'memory-counter';
    memoryCounter.innerHTML = 'Memory: -- MB';
    
    // 최적화 레벨 표시
    const optimizationLevel = document.createElement('div');
    optimizationLevel.className = 'optimization-level';
    optimizationLevel.innerHTML = 'Optimization: None';
    
    // 요소 추가
    container.appendChild(fpsCounter);
    container.appendChild(memoryCounter);
    container.appendChild(optimizationLevel);
    
    // 문서에 추가
    document.body.appendChild(container);
    
    // UI 요소 참조 저장
    this.ui.container = container;
    this.ui.fpsCounter = fpsCounter;
    this.ui.memoryCounter = memoryCounter;
    this.ui.optimizationLevel = optimizationLevel;
  }
  
  /**
   * 통계 UI 업데이트
   */
  updateStatsUI() {
    if (!this.options.showStats || !this.ui.container) return;
    
    // FPS 색상 결정
    let fpsColor = '#4CAF50'; // 양호 (녹색)
    if (this.stats.fps < 30) {
      fpsColor = '#FF9800'; // 경고 (주황색)
    }
    if (this.stats.fps < 20) {
      fpsColor = '#F44336'; // 나쁨 (빨간색)
    }
    
    // 메모리 색상 결정
    let memoryColor = '#4CAF50'; // 양호 (녹색)
    if (this.stats.memory > this.options.memoryThreshold * 0.7) {
      memoryColor = '#FF9800'; // 경고 (주황색)
    }
    if (this.stats.memory > this.options.memoryThreshold) {
      memoryColor = '#F44336'; // 나쁨 (빨간색)
    }
    
    // 최적화 레벨 텍스트
    const optimizationText = [
      'None',
      'Low',
      'Medium',
      'High'
    ][this.stats.optimizationLevel];
    
    // UI 업데이트
    this.ui.fpsCounter.innerHTML = `FPS: <span style="color:${fpsColor}">${this.stats.fps}</span>`;
    this.ui.memoryCounter.innerHTML = `Memory: <span style="color:${memoryColor}">${this.stats.memory}</span> MB`;
    this.ui.optimizationLevel.innerHTML = `Optimization: ${optimizationText}`;
  }
  
  /**
   * 최적화 함수 등록
   */
  registerOptimizations() {
    // 기본 최적화 함수 등록
    this.registerOptimizationCallback((level) => {
      // 낮은 수준 최적화
      if (level >= 1) {
        // Three.js 애니메이션 프레임 레이트 제한
        if (window.threeAnimationController) {
          window.threeAnimationController.setFPSLimit(30);
        }
        
        // 문서의 모든 비디오 일시 중지
        document.querySelectorAll('video').forEach(video => {
          if (!video.paused) video.pause();
        });
      }
      
      // 중간 수준 최적화
      if (level >= 2) {
        // 특수 효과 줄이기 (파티클, 애니메이션 등)
        document.body.classList.add('reduced-motion');
        
        // GSAP 애니메이션 간소화
        if (window.gsap) {
          gsap.globalTimeline.timeScale(0.8);
        }
        
        // 백그라운드 이미지 간소화
        document.querySelectorAll('.floating-elements, .meteor').forEach(el => {
          el.style.display = 'none';
        });
      }
      
      // 높은 수준 최적화
      if (level >= 3) {
        // Three.js 배경 비활성화
        const spaceCanvas = document.getElementById('space-background');
        if (spaceCanvas) spaceCanvas.style.display = 'none';
        
        // 애니메이션 일시 중지
        if (window.gsap) {
          gsap.globalTimeline.pause();
        }
        
        // 로켓 애니메이션 중지
        if (window.rocketInstance && typeof window.rocketInstance.pauseAnimation === 'function') {
          window.rocketInstance.pauseAnimation();
        }
        
        // 사용자에게 알림
        console.warn('높은 최적화 모드가 활성화되었습니다. 성능 문제로 일부 시각 효과가 비활성화되었습니다.');
      }
      
      // 최적화 레벨 업데이트
      this.stats.optimizationLevel = level;
      
      // UI 업데이트
      this.updateStatsUI();
    });
  }
  
  /**
   * 최적화 콜백 함수 등록
   * @param {Function} callback - 최적화 수준을 인자로 받는 콜백 함수
   * @returns {PerformanceMonitor} - 체이닝을 위한 인스턴스 반환
   */
  registerOptimizationCallback(callback) {
    if (typeof callback === 'function') {
      this.optimizationCallbacks.add(callback);
    }
    return this;
  }
  
  /**
   * 최적화 적용
   * @param {number} level - 최적화 수준 (1: 낮음, 2: 중간, 3: 높음)
   */
  applyOptimizations(level) {
    console.log(`성능 최적화 적용 - 레벨 ${level}`);
    
    // 등록된 모든 최적화 콜백 실행
    this.optimizationCallbacks.forEach(callback => {
      try {
        callback(level);
      } catch (e) {
        console.error('최적화 콜백 실행 중 오류:', e);
      }
    });
  }
  
  /**
   * 평균 FPS 계산
   * @param {number} sampleCount - 평균 계산에 사용할 샘플 수
   * @returns {number} - 평균 FPS
   */
  getAverageFps(sampleCount = 10) {
    if (this.stats.fpsHistory.length === 0) return 0;
    
    const samples = this.stats.fpsHistory.slice(-Math.min(sampleCount, this.stats.fpsHistory.length));
    return samples.reduce((sum, fps) => sum + fps, 0) / samples.length;
  }
  
  /**
   * 평균 메모리 사용량 계산
   * @param {number} sampleCount - 평균 계산에 사용할 샘플 수
   * @returns {number} - 평균 메모리 사용량 (MB)
   */
  getAverageMemory(sampleCount = 10) {
    if (this.stats.memoryHistory.length === 0) return 0;
    
    const samples = this.stats.memoryHistory.slice(-Math.min(sampleCount, this.stats.memoryHistory.length));
    return samples.reduce((sum, memory) => sum + memory, 0) / samples.length;
  }
  
  /**
   * 기기 성능 평가 및 권장 설정 적용
   */
  checkPerformanceCapabilities() {
    // 모바일 기기 확인
    const isMobileDevice = isMobile();
    this.stats.isMobile = isMobileDevice;
    
    // 하드웨어 가속 확인
    const hasHardwareAcceleration = this.checkHardwareAcceleration();
    
    // WebGL 지원 확인
    const hasWebGLSupport = this.checkWebGLSupport();
    
    // 배터리 상태 확인 (지원되는 경우)
    this.checkBatteryStatus().then(batteryInfo => {
      // 저전력 모드 결정
      this.stats.lowPowerMode = 
        isMobileDevice || 
        !hasWebGLSupport || 
        (batteryInfo && batteryInfo.level < 0.2 && !batteryInfo.charging) ||
        isLowPowerMode();
      
      // 저전력 모드이면 자동으로 최소한의 최적화 적용
      if (this.stats.lowPowerMode && this.options.autoOptimize) {
        this.applyOptimizations(1);
      }
    });
  }
  
  /**
   * 하드웨어 가속 지원 확인
   * @returns {boolean} - 하드웨어 가속 지원 여부
   */
  checkHardwareAcceleration() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;
    
    // 확장 기능 확인
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      // 소프트웨어 렌더러 확인
      return !/(SwiftShader|Software|Intel)/i.test(renderer);
    }
    
    return true;
  }
  
  /**
   * WebGL 지원 확인
   * @returns {boolean} - WebGL 지원 여부
   */
  checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    let gl;
    
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      return false;
    }
    
    return gl !== null;
  }
  
  /**
   * 배터리 상태 확인
   * @returns {Promise<Object>} - 배터리 정보 객체
   */
  async checkBatteryStatus() {
    // Battery API 지원 확인
    if (!navigator.getBattery) {
      return null;
    }
    
    try {
      const battery = await navigator.getBattery();
      return {
        level: battery.level, // 0~1 사이 값
        charging: battery.charging
      };
    } catch (e) {
      console.error('배터리 상태 확인 중 오류:', e);
      return null;
    }
  }
  
  /**
   * 리소스 해제
   */
  dispose() {
    // 측정 인터벌 중지
    this.pauseMonitoring();
    
    // UI 요소 제거
    if (this.ui.container && this.ui.container.parentNode) {
      this.ui.container.parentNode.removeChild(this.ui.container);
    }
    
    // 상태 초기화
    this.optimizationCallbacks.clear();
    this.stats.fpsHistory = [];
    this.stats.memoryHistory = [];
  }
}

// 글로벌 인스턴스 생성
const performanceMonitor = new PerformanceMonitor();

// 기본 내보내기
export default performanceMonitor; 