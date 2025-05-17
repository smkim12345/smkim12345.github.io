/**
 * Cosmic Portfolio - 성능 워커
 * 메인 스레드에서 무거운 계산 작업을 분리하여 UI 블로킹 방지
 */

// 성능 측정 상태
let metrics = {
  fps: [],
  memory: [],
  resourceCount: 0,
  lastCalculation: Date.now()
};

// 이미지 캐시
const imageCache = new Map();

// 설정
const config = {
  fpsHistorySize: 60,  // 최근 60프레임만 보관
  memoryHistorySize: 60,
  imageCacheLimit: 50,  // 최대 50개 이미지만 캐시
  imageLifespan: 5 * 60 * 1000,  // 5분 캐시 유지
  cleanupInterval: 60 * 1000  // 1분마다 캐시 정리
};

// 주기적인 캐시 정리 타이머 설정
let cleanupTimerId = null;

/**
 * 워커 초기화
 */
function initWorker() {
  // 주기적인 캐시 정리 시작
  startCacheCleanupTimer();
  
  // 워커 초기화 완료 메시지
  self.postMessage({ type: 'initialized', data: { success: true } });
}

/**
 * 정기 캐시 정리 타이머 시작
 */
function startCacheCleanupTimer() {
  // 이전 타이머가 있으면 제거
  if (cleanupTimerId !== null) {
    clearInterval(cleanupTimerId);
  }
  
  // 새 타이머 설정
  cleanupTimerId = setInterval(() => {
    cleanupCache();
  }, config.cleanupInterval);
}

/**
 * 메시지 핸들러
 */
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'updateFps':
      updateFps(data.fps);
      break;
      
    case 'updateMemory':
      updateMemory(data.memory);
      break;
      
    case 'calculateStatistics':
      const stats = calculateStatistics();
      self.postMessage({ type: 'statistics', data: stats });
      break;
      
    case 'optimizeImage':
      optimizeImage(data.imageData, data.options)
        .then(optimizedData => {
          self.postMessage({
            type: 'optimizedImage',
            data: {
              id: data.id,
              optimizedData
            }
          });
        })
        .catch(error => {
          self.postMessage({
            type: 'error',
            data: {
              id: data.id,
              message: error.message
            }
          });
        });
      break;
      
    case 'cacheResource':
      cacheResource(data.key, data.resource);
      break;
      
    case 'getResource':
      const resource = getCachedResource(data.key);
      self.postMessage({
        type: 'cachedResource',
        data: {
          key: data.key,
          resource,
          found: !!resource
        }
      });
      break;
      
    case 'cleanupCache':
      cleanupCache();
      self.postMessage({
        type: 'cacheCleanupComplete',
        data: {
          resourceCount: metrics.resourceCount
        }
      });
      break;
      
    case 'terminate':
      // 워커 종료 전 정리 작업
      if (cleanupTimerId !== null) {
        clearInterval(cleanupTimerId);
      }
      break;
      
    default:
      console.warn(`Unknown message type: ${type}`);
  }
};

/**
 * FPS 업데이트
 * @param {number} fps - 프레임률
 */
function updateFps(fps) {
  metrics.fps.push({
    value: fps,
    timestamp: Date.now()
  });
  
  // 히스토리 크기 제한
  if (metrics.fps.length > config.fpsHistorySize) {
    metrics.fps.shift();
  }
}

/**
 * 메모리 사용량 업데이트
 * @param {number} memory - 메모리 사용량 (MB)
 */
function updateMemory(memory) {
  metrics.memory.push({
    value: memory,
    timestamp: Date.now()
  });
  
  // 히스토리 크기 제한
  if (metrics.memory.length > config.memoryHistorySize) {
    metrics.memory.shift();
  }
}

/**
 * 통계 계산
 * @returns {Object} 성능 통계
 */
function calculateStatistics() {
  // 현재 시간
  const now = Date.now();
  
  // 계산 간격이 너무 짧으면 이전 결과 재사용
  if (now - metrics.lastCalculation < 1000) {
    return metrics.lastStats || {};
  }
  
  // FPS 통계
  const fpsValues = metrics.fps.map(item => item.value);
  const fpsAvg = fpsValues.length > 0
    ? fpsValues.reduce((acc, val) => acc + val, 0) / fpsValues.length
    : 0;
  const fpsMin = fpsValues.length > 0
    ? Math.min(...fpsValues)
    : 0;
  const fpsMax = fpsValues.length > 0
    ? Math.max(...fpsValues)
    : 0;
    
  // 메모리 통계
  const memoryValues = metrics.memory.map(item => item.value);
  const memoryAvg = memoryValues.length > 0
    ? memoryValues.reduce((acc, val) => acc + val, 0) / memoryValues.length
    : 0;
  const memoryMin = memoryValues.length > 0
    ? Math.min(...memoryValues)
    : 0;
  const memoryMax = memoryValues.length > 0
    ? Math.max(...memoryValues)
    : 0;
  
  // 성능 점수 계산 (0-100)
  const fpsScore = calculateFpsScore(fpsAvg);
  const memoryScore = calculateMemoryScore(memoryAvg);
  const overallScore = (fpsScore + memoryScore) / 2;
  
  // 최적화 권장 레벨 계산 (0-3)
  const optimizationLevel = calculateOptimizationLevel(fpsScore, memoryScore);
  
  // 결과 저장
  metrics.lastCalculation = now;
  metrics.lastStats = {
    fps: {
      average: Math.round(fpsAvg),
      min: Math.round(fpsMin),
      max: Math.round(fpsMax),
      score: Math.round(fpsScore)
    },
    memory: {
      average: Math.round(memoryAvg),
      min: Math.round(memoryMin),
      max: Math.round(memoryMax),
      score: Math.round(memoryScore)
    },
    resourceCount: metrics.resourceCount,
    cacheSize: imageCache.size,
    overallScore: Math.round(overallScore),
    optimizationLevel
  };
  
  return metrics.lastStats;
}

/**
 * FPS 점수 계산 (0-100)
 * @param {number} fps - 평균 FPS
 * @returns {number} 점수
 */
function calculateFpsScore(fps) {
  if (fps >= 60) return 100;
  if (fps <= 15) return 0;
  
  // 15-60 FPS 범위를 0-100 점수로 변환
  return (fps - 15) * (100 / 45);
}

/**
 * 메모리 점수 계산 (0-100)
 * @param {number} memory - 메모리 사용량 (MB)
 * @returns {number} 점수
 */
function calculateMemoryScore(memory) {
  if (memory <= 50) return 100;
  if (memory >= 300) return 0;
  
  // 50-300 MB 범위를 100-0 점수로 변환 (역비례)
  return 100 - ((memory - 50) * (100 / 250));
}

/**
 * 최적화 권장 레벨 계산 (0-3)
 * @param {number} fpsScore - FPS 점수
 * @param {number} memoryScore - 메모리 점수
 * @returns {number} 최적화 레벨
 */
function calculateOptimizationLevel(fpsScore, memoryScore) {
  const avgScore = (fpsScore + memoryScore) / 2;
  
  if (avgScore >= 70) return 0; // 최적화 필요 없음
  if (avgScore >= 50) return 1; // 낮은 수준 최적화
  if (avgScore >= 30) return 2; // 중간 수준 최적화
  return 3; // 높은 수준 최적화
}

/**
 * 이미지 최적화
 * @param {ArrayBuffer} imageData - 이미지 데이터
 * @param {Object} options - 최적화 옵션
 * @returns {Promise<ArrayBuffer>} 최적화된 이미지 데이터
 */
async function optimizeImage(imageData, options = {}) {
  try {
    // 임시 캔버스로 이미지 최적화 (해상도, 압축률 조정)
    const { quality = 0.85, maxWidth, maxHeight } = options;
    
    // 이미지 데이터를 블롭으로 변환
    const blob = new Blob([imageData], { type: options.mimeType || 'image/jpeg' });
    const imageBitmap = await createImageBitmap(blob);
    
    // 크기 계산
    let width = imageBitmap.width;
    let height = imageBitmap.height;
    
    // 최대 크기 제한 적용
    if (maxWidth && width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * ratio);
    }
    
    if (maxHeight && height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = Math.round(width * ratio);
    }
    
    // 오프스크린 캔버스 사용 시도
    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // 이미지 그리기
      ctx.drawImage(imageBitmap, 0, 0, width, height);
      
      // 결과 반환
      return await canvas.convertToBlob({ 
        type: options.mimeType || 'image/jpeg',
        quality 
      });
    } else {
      // 오프스크린 캔버스를 지원하지 않는 경우, 원본 반환
      return imageData;
    }
  } catch (error) {
    console.error('이미지 최적화 오류:', error);
    return imageData; // 오류 발생 시 원본 반환
  }
}

/**
 * 리소스 캐싱
 * @param {string} key - 리소스 키
 * @param {any} resource - 리소스 데이터
 */
function cacheResource(key, resource) {
  if (!key) return;
  
  // 이미지 캐시에 저장
  imageCache.set(key, {
    data: resource,
    timestamp: Date.now()
  });
  
  metrics.resourceCount = imageCache.size;
  
  // 캐시 크기 제한
  if (imageCache.size > config.imageCacheLimit) {
    // 가장 오래된 항목 5개 제거
    const itemsToRemove = Math.ceil(config.imageCacheLimit * 0.1); // 10% 제거
    for (let i = 0; i < itemsToRemove; i++) {
      const oldestKey = findOldestCacheKey();
      if (oldestKey) {
        imageCache.delete(oldestKey);
      }
    }
    
    metrics.resourceCount = imageCache.size;
  }
}

/**
 * 캐시된 리소스 가져오기
 * @param {string} key - 리소스 키
 * @returns {any} 리소스 데이터 또는 null
 */
function getCachedResource(key) {
  if (!key || !imageCache.has(key)) return null;
  
  const cached = imageCache.get(key);
  
  // 만료 검사
  if (Date.now() - cached.timestamp > config.imageLifespan) {
    imageCache.delete(key);
    metrics.resourceCount = imageCache.size;
    return null;
  }
  
  // 타임스탬프 갱신 (LRU 캐시 방식)
  cached.timestamp = Date.now();
  
  return cached.data;
}

/**
 * 가장 오래된 캐시 항목 키 찾기
 * @returns {string|null} 가장 오래된 항목 키
 */
function findOldestCacheKey() {
  let oldestKey = null;
  let oldestTime = Infinity;
  
  for (const [key, value] of imageCache.entries()) {
    if (value.timestamp < oldestTime) {
      oldestTime = value.timestamp;
      oldestKey = key;
    }
  }
  
  return oldestKey;
}

/**
 * 만료된 캐시 항목 정리
 */
function cleanupCache() {
  const now = Date.now();
  const initialSize = imageCache.size;
  
  // 만료된 항목 찾기
  for (const [key, value] of imageCache.entries()) {
    if (now - value.timestamp > config.imageLifespan) {
      imageCache.delete(key);
    }
  }
  
  metrics.resourceCount = imageCache.size;
  
  // 정리 결과 로깅 (실제로는 메인 스레드에 보고)
  const removedCount = initialSize - imageCache.size;
  if (removedCount > 0) {
    self.postMessage({
      type: 'cacheCleanupResult',
      data: {
        initialSize,
        currentSize: imageCache.size,
        removedCount
      }
    });
  }
}

// 워커 초기화
initWorker(); 