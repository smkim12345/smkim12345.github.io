/**
 * Cosmic Portfolio - 데이터 매니저
 * 전역 데이터 캐싱 및 관리 시스템
 */

// 싱글톤 클래스로 구현
class DataManager {
  constructor() {
    // 싱글톤 패턴 적용
    if (DataManager.instance) {
      return DataManager.instance;
    }
    
    DataManager.instance = this;
    
    // 캐시 저장소
    this.cache = new Map();
    
    // 현재 진행 중인 로딩 작업 추적
    this.loadingPromises = new Map();
    
    // 설정
    this.config = {
      // 캐시 만료 시간 (30분)
      cacheExpiration: 30 * 60 * 1000,
      // 디버그 모드
      debug: false
    };
    
    this.log('데이터 매니저 초기화 완료');
  }
  
  /**
   * 데이터 가져오기 (캐시 우선)
   * @param {string} key - 데이터 키
   * @param {Function} loader - 데이터 로딩 함수 (Promise 반환)
   * @param {Object} options - 옵션 객체
   * @returns {Promise<any>} 데이터 Promise
   */
  async getData(key, loader, options = {}) {
    const { forceRefresh = false, expiration = this.config.cacheExpiration } = options;
    
    // 디버그 로그
    this.log(`getData 호출: ${key}, 강제 새로고침: ${forceRefresh}`);
    
    // 강제 새로고침이 아니고 캐시에 유효한 데이터가 있으면 반환
    if (!forceRefresh && this.hasValidCache(key, expiration)) {
      this.log(`캐시에서 데이터 반환: ${key}`);
      return this.cache.get(key).data;
    }
    
    // 이미 로딩 중인 경우 해당 Promise 반환 (중복 요청 방지)
    if (this.isLoading(key)) {
      this.log(`이미 로딩 중인 요청 재사용: ${key}`);
      return this.getLoadingPromise(key);
    }
    
    // 새 로딩 Promise 생성
    try {
      this.log(`새 데이터 로딩 시작: ${key}`);
      const loadingPromise = loader();
      this.loadingPromises.set(key, loadingPromise);
      
      // 데이터 로딩 기다림
      const data = await loadingPromise;
      
      // 캐시에 저장
      this.saveToCache(key, data);
      
      // 로딩 Promise 목록에서 제거
      this.loadingPromises.delete(key);
      
      return data;
    } catch (error) {
      this.log(`데이터 로딩 오류: ${key}`, error, true);
      
      // 로딩 Promise 목록에서 제거
      this.loadingPromises.delete(key);
      
      // 에러 전파
      throw error;
    }
  }
  
  /**
   * 캐시에 데이터 저장
   * @param {string} key - 데이터 키
   * @param {any} data - 저장할 데이터
   */
  saveToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.log(`캐시에 데이터 저장: ${key}`);
  }
  
  /**
   * 캐시에 유효한 데이터가 있는지 확인
   * @param {string} key - 데이터 키
   * @param {number} expiration - 캐시 만료 시간 (밀리초)
   * @returns {boolean} 유효 여부
   */
  hasValidCache(key, expiration) {
    // 캐시에 데이터 없음
    if (!this.cache.has(key)) {
      return false;
    }
    
    // 만료 시간 체크
    const cachedData = this.cache.get(key);
    const now = Date.now();
    const isExpired = (now - cachedData.timestamp) > expiration;
    
    return !isExpired;
  }
  
  /**
   * 현재 로딩 중인지 확인
   * @param {string} key - 데이터 키
   * @returns {boolean} 로딩 중 여부
   */
  isLoading(key) {
    return this.loadingPromises.has(key);
  }
  
  /**
   * 로딩 중인 Promise 가져오기
   * @param {string} key - 데이터 키
   * @returns {Promise<any>|null} 로딩 Promise 또는 null
   */
  getLoadingPromise(key) {
    return this.loadingPromises.get(key) || null;
  }
  
  /**
   * 특정 키의 캐시 삭제
   * @param {string} key - 삭제할 데이터 키
   */
  invalidateCache(key) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.log(`캐시 삭제: ${key}`);
    }
  }
  
  /**
   * 모든 캐시 초기화
   */
  clearAllCache() {
    this.cache.clear();
    this.log('모든 캐시 초기화');
  }
  
  /**
   * 만료된 캐시 항목 정리
   */
  cleanExpiredCache() {
    const now = Date.now();
    
    // 만료된 항목 찾기
    const expiredKeys = [];
    this.cache.forEach((value, key) => {
      if ((now - value.timestamp) > this.config.cacheExpiration) {
        expiredKeys.push(key);
      }
    });
    
    // 만료된 항목 삭제
    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });
    
    if (expiredKeys.length > 0) {
      this.log(`만료된 캐시 ${expiredKeys.length}개 정리됨`);
    }
  }
  
  /**
   * 디버그 로그
   * @param {string} message - 로그 메시지
   * @param {any} [data] - 추가 데이터
   * @param {boolean} [isError=false] - 에러 로그 여부
   */
  log(message, data, isError = false) {
    if (!this.config.debug) return;
    
    const logMethod = isError ? console.error : console.log;
    const prefix = '[DataManager]';
    
    if (data) {
      logMethod(`${prefix} ${message}`, data);
    } else {
      logMethod(`${prefix} ${message}`);
    }
  }
  
  /**
   * 디버그 모드 설정
   * @param {boolean} enabled - 활성화 여부
   */
  setDebug(enabled) {
    this.config.debug = enabled;
    this.log(`디버그 모드: ${enabled ? '활성화' : '비활성화'}`);
  }
}

// 글로벌 인스턴스 생성
const dataManager = new DataManager();

// 기본 내보내기
export default dataManager; 