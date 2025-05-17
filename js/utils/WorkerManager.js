/**
 * Cosmic Portfolio - 워커 매니저
 * 웹 워커 생성 및 통신을 관리하는 유틸리티 클래스
 */

class WorkerManager {
  constructor() {
    // 싱글톤 패턴 적용
    if (WorkerManager.instance) {
      return WorkerManager.instance;
    }
    
    WorkerManager.instance = this;
    
    // 워커 인스턴스 저장
    this.workers = new Map();
    
    // 메시지 핸들러 맵
    this.messageHandlers = new Map();
    
    // 콜백 ID 카운터
    this.callbackId = 0;
    
    // 요청-응답 콜백 맵
    this.pendingCallbacks = new Map();
    
    // 워커 지원 여부 확인
    this.isSupported = typeof Worker !== 'undefined';
  }
  
  /**
   * 워커 생성
   * @param {string} name - 워커 이름
   * @param {string} scriptPath - 워커 스크립트 경로
   * @param {Object} options - 워커 옵션
   * @returns {Worker|null} 워커 인스턴스 또는 null
   */
  createWorker(name, scriptPath, options = {}) {
    // 워커를 지원하지 않는 경우
    if (!this.isSupported) {
      console.warn('Web Worker를 지원하지 않습니다.');
      return null;
    }
    
    // 이미 생성된 워커가 있는 경우
    if (this.workers.has(name)) {
      return this.workers.get(name);
    }
    
    try {
      // 워커 생성
      const worker = new Worker(scriptPath, options);
      
      // 워커 메시지 리스너 설정
      worker.onmessage = (e) => this.handleWorkerMessage(name, e);
      worker.onerror = (e) => this.handleWorkerError(name, e);
      
      // 워커 저장
      this.workers.set(name, worker);
      this.messageHandlers.set(name, new Map());
      
      return worker;
    } catch (error) {
      console.error(`워커 생성 실패: ${name} (${scriptPath})`, error);
      return null;
    }
  }
  
  /**
   * 워커 가져오기
   * @param {string} name - 워커 이름
   * @returns {Worker|null} 워커 인스턴스 또는 null
   */
  getWorker(name) {
    return this.workers.get(name) || null;
  }
  
  /**
   * 워커 메시지 핸들러 등록
   * @param {string} workerName - 워커 이름
   * @param {string} messageType - 메시지 유형
   * @param {Function} handler - 메시지 핸들러 함수
   */
  registerMessageHandler(workerName, messageType, handler) {
    if (!this.messageHandlers.has(workerName)) {
      this.messageHandlers.set(workerName, new Map());
    }
    
    this.messageHandlers.get(workerName).set(messageType, handler);
  }
  
  /**
   * 워커 메시지 처리
   * @param {string} workerName - 워커 이름
   * @param {MessageEvent} event - 메시지 이벤트
   */
  handleWorkerMessage(workerName, event) {
    const { type, data } = event.data;
    
    // 콜백 응답인 경우
    if (type === 'callback' && data && data.callbackId) {
      const callback = this.pendingCallbacks.get(data.callbackId);
      if (callback) {
        callback(data.result);
        this.pendingCallbacks.delete(data.callbackId);
      }
      return;
    }
    
    // 일반 메시지 핸들러 호출
    const handlers = this.messageHandlers.get(workerName);
    if (handlers && handlers.has(type)) {
      const handler = handlers.get(type);
      handler(data);
    }
  }
  
  /**
   * 워커 오류 처리
   * @param {string} workerName - 워커 이름
   * @param {ErrorEvent} error - 오류 이벤트
   */
  handleWorkerError(workerName, error) {
    console.error(`워커 오류 (${workerName}):`, error);
  }
  
  /**
   * 워커에 메시지 전송
   * @param {string} workerName - 워커 이름
   * @param {string} messageType - 메시지 유형
   * @param {any} data - 메시지 데이터
   */
  postMessage(workerName, messageType, data = {}) {
    const worker = this.getWorker(workerName);
    if (!worker) {
      console.error(`워커를 찾을 수 없음: ${workerName}`);
      return;
    }
    
    worker.postMessage({
      type: messageType,
      data
    });
  }
  
  /**
   * 워커에 메시지 전송 후 응답 대기 (Promise)
   * @param {string} workerName - 워커 이름
   * @param {string} messageType - 메시지 유형
   * @param {any} data - 메시지 데이터
   * @param {string} responseType - 응답 메시지 유형
   * @returns {Promise<any>} 응답 Promise
   */
  postMessageAndWait(workerName, messageType, data = {}, responseType) {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker(workerName);
      if (!worker) {
        reject(new Error(`워커를 찾을 수 없음: ${workerName}`));
        return;
      }
      
      // 한 번만 사용되는 임시 핸들러 등록
      const tempHandler = (responseData) => {
        resolve(responseData);
        
        // 핸들러 제거
        const handlers = this.messageHandlers.get(workerName);
        if (handlers) {
          handlers.delete(responseType);
        }
      };
      
      // 응답 핸들러 등록
      this.registerMessageHandler(workerName, responseType, tempHandler);
      
      // 메시지 전송
      this.postMessage(workerName, messageType, data);
    });
  }
  
  /**
   * 워커 종료
   * @param {string} name - 워커 이름
   */
  terminateWorker(name) {
    const worker = this.getWorker(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
      this.messageHandlers.delete(name);
    }
  }
  
  /**
   * 모든 워커 종료
   */
  terminateAll() {
    for (const [name, worker] of this.workers.entries()) {
      worker.terminate();
    }
    
    this.workers.clear();
    this.messageHandlers.clear();
    this.pendingCallbacks.clear();
  }
  
  /**
   * 성능 워커 초기화
   * @returns {Worker|null} 성능 워커 인스턴스
   */
  initPerformanceWorker() {
    return this.createWorker('performance', 'js/workers/PerformanceWorker.js');
  }
  
  /**
   * 이미지 최적화 요청
   * @param {string} imageId - 이미지 ID
   * @param {ArrayBuffer} imageData - 이미지 데이터
   * @param {Object} options - 최적화 옵션
   * @returns {Promise<Object>} 최적화 결과
   */
  optimizeImage(imageId, imageData, options = {}) {
    // 성능 워커 가져오기
    const worker = this.getWorker('performance') || this.initPerformanceWorker();
    if (!worker) {
      return Promise.reject(new Error('성능 워커를 초기화할 수 없습니다.'));
    }
    
    return this.postMessageAndWait(
      'performance',
      'optimizeImage',
      { id: imageId, imageData, options },
      'optimizedImage'
    );
  }
  
  /**
   * 성능 통계 계산 요청
   * @returns {Promise<Object>} 성능 통계
   */
  calculateStatistics() {
    // 성능 워커 가져오기
    const worker = this.getWorker('performance') || this.initPerformanceWorker();
    if (!worker) {
      return Promise.reject(new Error('성능 워커를 초기화할 수 없습니다.'));
    }
    
    return this.postMessageAndWait(
      'performance',
      'calculateStatistics',
      {},
      'statistics'
    );
  }
  
  /**
   * FPS 업데이트
   * @param {number} fps - 프레임률
   */
  updateFps(fps) {
    const worker = this.getWorker('performance');
    if (worker) {
      this.postMessage('performance', 'updateFps', { fps });
    }
  }
  
  /**
   * 메모리 사용량 업데이트
   * @param {number} memory - 메모리 사용량 (MB)
   */
  updateMemory(memory) {
    const worker = this.getWorker('performance');
    if (worker) {
      this.postMessage('performance', 'updateMemory', { memory });
    }
  }
}

// 글로벌 인스턴스 생성
const workerManager = new WorkerManager();

// 기본 내보내기
export default workerManager; 