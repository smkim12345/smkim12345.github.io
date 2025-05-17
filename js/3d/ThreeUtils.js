/**
 * Cosmic Portfolio - Three.js 유틸리티
 * Three.js 관련 최적화 및 유틸리티 함수 모음
 */

/**
 * Three.js 리소스 관리자
 */
class ThreeResourceManager {
  constructor() {
    // 리소스 캐시
    this.textures = new Map();
    this.geometries = new Map();
    this.materials = new Map();
    
    // 통계
    this.stats = {
      cachedTextures: 0,
      cachedGeometries: 0,
      cachedMaterials: 0,
      textureReuses: 0,
      geometryReuses: 0,
      materialReuses: 0
    };
  }
  
  /**
   * 텍스처 로드 또는 재사용
   * @param {THREE.TextureLoader} loader - 텍스처 로더
   * @param {string} url - 텍스처 URL
   * @param {Object} [options] - 텍스처 옵션
   * @returns {Promise<THREE.Texture>} - 텍스처 Promise
   */
  loadTexture(loader, url, options = {}) {
    // 캐시에 있으면 재사용
    if (this.textures.has(url)) {
      this.stats.textureReuses++;
      const cachedTexture = this.textures.get(url);
      
      // 옵션 적용
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          cachedTexture[key] = value;
        });
        
        // 옵션 변경으로 업데이트 필요
        cachedTexture.needsUpdate = true;
      }
      
      return Promise.resolve(cachedTexture);
    }
    
    // 새로 로드
    return new Promise((resolve, reject) => {
      try {
        loader.load(
          url,
          texture => {
            // 옵션 적용
            if (options) {
              Object.entries(options).forEach(([key, value]) => {
                texture[key] = value;
              });
            }
            
            // 캐시에 저장
            this.textures.set(url, texture);
            this.stats.cachedTextures++;
            
            resolve(texture);
          },
          undefined,
          error => reject(error)
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * 기하학(Geometry) 저장 또는 재사용
   * @param {string} key - 기하학 캐시 키
   * @param {THREE.BufferGeometry} geometry - 기하학 객체
   * @returns {THREE.BufferGeometry} - 기하학 객체
   */
  cacheGeometry(key, geometry) {
    // 이미 캐시에 있으면 재사용
    if (this.geometries.has(key)) {
      // 기존 것 제거 전 참조 반환
      const cachedGeometry = this.geometries.get(key);
      this.stats.geometryReuses++;
      
      // 기존 것이 있으면 새 것은 제거 (메모리 관리)
      if (geometry !== cachedGeometry) {
        geometry.dispose();
      }
      
      return cachedGeometry;
    }
    
    // 새로 저장
    this.geometries.set(key, geometry);
    this.stats.cachedGeometries++;
    
    return geometry;
  }
  
  /**
   * 재질(Material) 저장 또는 재사용
   * @param {string} key - 재질 캐시 키
   * @param {THREE.Material} material - 재질 객체
   * @returns {THREE.Material} - 재질 객체
   */
  cacheMaterial(key, material) {
    // 이미 캐시에 있으면 재사용
    if (this.materials.has(key)) {
      const cachedMaterial = this.materials.get(key);
      this.stats.materialReuses++;
      
      // 기존 것이 있으면 새 것은 제거 (메모리 관리)
      if (material !== cachedMaterial) {
        material.dispose();
      }
      
      return cachedMaterial;
    }
    
    // 새로 저장
    this.materials.set(key, material);
    this.stats.cachedMaterials++;
    
    return material;
  }
  
  /**
   * 특정 리소스 제거
   * @param {string} type - 리소스 타입 (texture/geometry/material)
   * @param {string} key - 리소스 키
   */
  dispose(type, key) {
    switch (type) {
      case 'texture':
        if (this.textures.has(key)) {
          const texture = this.textures.get(key);
          texture.dispose();
          this.textures.delete(key);
          this.stats.cachedTextures--;
        }
        break;
        
      case 'geometry':
        if (this.geometries.has(key)) {
          const geometry = this.geometries.get(key);
          geometry.dispose();
          this.geometries.delete(key);
          this.stats.cachedGeometries--;
        }
        break;
        
      case 'material':
        if (this.materials.has(key)) {
          const material = this.materials.get(key);
          material.dispose();
          this.materials.delete(key);
          this.stats.cachedMaterials--;
        }
        break;
        
      default:
        console.warn(`알 수 없는 리소스 타입: ${type}`);
    }
  }
  
  /**
   * 모든 리소스 제거
   */
  disposeAll() {
    // 텍스처 정리
    this.textures.forEach(texture => texture.dispose());
    this.textures.clear();
    
    // 기하학 정리
    this.geometries.forEach(geometry => geometry.dispose());
    this.geometries.clear();
    
    // 재질 정리
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
    
    // 통계 초기화
    this.stats = {
      cachedTextures: 0,
      cachedGeometries: 0,
      cachedMaterials: 0,
      textureReuses: 0,
      geometryReuses: 0,
      materialReuses: 0
    };
    
    console.log('모든 Three.js 리소스가 정리되었습니다.');
  }
  
  /**
   * 리소스 통계 정보 반환
   * @returns {Object} - 통계 정보
   */
  getStats() {
    return { ...this.stats };
  }
}

// 리소스 매니저 인스턴스
export const resourceManager = new ThreeResourceManager();

/**
 * Three.js 씬 객체 메모리 정리
 * @param {THREE.Scene} scene - 정리할 씬
 * @param {boolean} [disposeTextures=true] - 텍스처 정리 여부
 */
export function disposeScene(scene, disposeTextures = true) {
  if (!scene) return;
  
  // 모든 객체 순회
  scene.traverse(object => {
    // 메시인 경우
    if (object.isMesh) {
      // 기하학 정리
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      // 재질 정리
      if (object.material) {
        // 배열인 경우 처리
        if (Array.isArray(object.material)) {
          object.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(object.material);
        }
      }
    }
  });
  
  // 씬에서 모든 자식 제거
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  /**
   * 재질 정리 함수
   * @param {THREE.Material} material - 정리할 재질
   */
  function disposeMaterial(material) {
    if (!material) return;
    
    // 텍스처 정리
    if (disposeTextures) {
      Object.keys(material).forEach(prop => {
        const value = material[prop];
        if (value && typeof value === 'object' && 'isTexture' in value) {
          value.dispose();
        }
      });
    }
    
    // 재질 정리
    material.dispose();
  }
}

/**
 * 성능 최적화된 애니메이션 루프
 * @param {Function} renderCallback - 렌더링 콜백 함수
 * @returns {Object} - 애니메이션 컨트롤러
 */
export function createAnimationLoop(renderCallback) {
  let animationFrameId = null;
  let isRunning = false;
  let lastFrameTime = 0;
  let frameCount = 0;
  let fpsLimit = 60; // 기본 FPS 제한
  const targetFrameTime = 1000 / fpsLimit;
  
  // 모바일 감지
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    // 모바일에서는 FPS 제한
    fpsLimit = 30;
  }
  
  // 애니메이션 루프
  function animate(currentTime) {
    animationFrameId = requestAnimationFrame(animate);
    
    const deltaTime = currentTime - lastFrameTime;
    
    // FPS 제한 적용
    if (deltaTime >= targetFrameTime) {
      lastFrameTime = currentTime - (deltaTime % targetFrameTime);
      frameCount++;
      
      // 렌더링 콜백 호출
      renderCallback(deltaTime / 1000, frameCount);
    }
  }
  
  // 컨트롤러 객체
  const controller = {
    // 애니메이션 시작
    start() {
      if (!isRunning) {
        isRunning = true;
        lastFrameTime = performance.now();
        frameCount = 0;
        animationFrameId = requestAnimationFrame(animate);
      }
      return controller;
    },
    
    // 애니메이션 정지
    stop() {
      if (isRunning && animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isRunning = false;
      }
      return controller;
    },
    
    // FPS 제한 설정
    setFPSLimit(fps) {
      fpsLimit = Math.max(1, Math.min(fps, 120)); // 1-120 범위로 제한
      return controller;
    },
    
    // 현재 실행 중인지 확인
    isActive() {
      return isRunning;
    }
  };
  
  return controller;
}

/**
 * 비동기 Three.js 리소스 로드 헬퍼
 * @param {THREE.LoadingManager} manager - 로딩 매니저
 * @param {Function} loader - 로더 함수
 * @param {string|string[]} urls - 로드할 URL 또는 URL 배열
 * @returns {Promise<any>} - 로드된 리소스
 */
export function loadAsync(manager, loader, urls) {
  return new Promise((resolve, reject) => {
    // 로더 설정
    const loaderInstance = typeof loader === 'function' ? new loader(manager) : loader;
    
    // 배열 처리
    if (Array.isArray(urls)) {
      const promises = urls.map(url => {
        return new Promise((innerResolve, innerReject) => {
          loaderInstance.load(url, innerResolve, undefined, innerReject);
        });
      });
      
      Promise.all(promises).then(resolve).catch(reject);
    } else {
      // 단일 URL 처리
      loaderInstance.load(urls, resolve, undefined, reject);
    }
  });
}

/**
 * 낮은 사양 기기 감지 및 렌더러 설정 최적화
 * @param {THREE.WebGLRenderer} renderer - Three.js 렌더러
 * @returns {boolean} - 낮은 사양 여부
 */
export function optimizeRendererForDevice(renderer) {
  if (!renderer) return false;
  
  // 기기 성능 감지 시도
  let isLowPower = false;
  
  // 모바일 기기 감지
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 화면 크기
  const screenSize = window.innerWidth * window.innerHeight;
  
  // 렌더러 기능 체크
  const gl = renderer.getContext();
  
  // 힌트: 간접적으로 성능 추측
  if (isMobile || screenSize < 500000 || !gl.getExtension('OES_texture_float')) {
    isLowPower = true;
  }
  
  // 저사양 기기 설정 적용
  if (isLowPower) {
    // 픽셀 비율 낮추기
    renderer.setPixelRatio(Math.min(1, window.devicePixelRatio));
    
    // 그림자 비활성화
    renderer.shadowMap.enabled = false;
    
    // 안티앨리어싱 비활성화
    renderer.antialias = false;
    
    // 정밀도 낮추기
    renderer.precision = 'lowp';
    
    console.log('낮은 사양 기기가 감지되어 Three.js 렌더러 설정이 최적화되었습니다.');
  } else {
    // 일반 기기 설정
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    renderer.shadowMap.enabled = true;
    
    console.log('일반 사양 기기용 Three.js 렌더러 설정이 적용되었습니다.');
  }
  
  return isLowPower;
}

/**
 * 씬 메모리 사용량 추정
 * @param {THREE.Scene} scene - 측정할 씬
 * @returns {Object} - 메모리 사용량 정보
 */
export function estimateMemoryUsage(scene) {
  if (!scene) return null;
  
  const stats = {
    geometries: 0,
    vertices: 0,
    triangles: 0,
    materials: 0,
    textures: 0,
    totalObjects: 0,
    estimatedBytes: 0
  };
  
  const textures = new Set();
  const materials = new Set();
  
  // 모든 객체 순회
  scene.traverse(object => {
    stats.totalObjects++;
    
    // 메시인 경우
    if (object.isMesh && object.geometry) {
      stats.geometries++;
      
      // 정점 및 삼각형 계산
      if (object.geometry.attributes.position) {
        stats.vertices += object.geometry.attributes.position.count;
        stats.triangles += object.geometry.index 
          ? object.geometry.index.count / 3 
          : object.geometry.attributes.position.count / 3;
      }
      
      // 재질 추적
      if (object.material) {
        // 배열 처리
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            if (mat && !materials.has(mat)) {
              materials.add(mat);
              countTexturesInMaterial(mat);
            }
          });
        } else if (!materials.has(object.material)) {
          materials.add(object.material);
          countTexturesInMaterial(object.material);
        }
      }
    }
  });
  
  // 재질에서 텍스처 추적
  function countTexturesInMaterial(material) {
    Object.keys(material).forEach(prop => {
      const value = material[prop];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        if (!textures.has(value)) {
          textures.add(value);
          stats.textures++;
          
          // 텍스처 메모리 추정
          if (value.image && value.image.width && value.image.height) {
            const numComponents = 4; // RGBA
            const bytesPerTexel = 1 * numComponents; // 1바이트/채널 * 채널 수
            stats.estimatedBytes += value.image.width * value.image.height * bytesPerTexel;
          }
        }
      }
    });
  }
  
  // 크기 설정
  stats.materials = materials.size;
  
  // 기하학 데이터 추정
  const bytesPerVertex = 12; // 3 * 4 (x,y,z * float)
  const bytesPerTriangle = 12; // 3 * 4 (index * float)
  stats.estimatedBytes += stats.vertices * bytesPerVertex + stats.triangles * bytesPerTriangle;
  
  // 메가바이트 변환
  stats.estimatedMB = (stats.estimatedBytes / (1024 * 1024)).toFixed(2);
  
  return stats;
}

// 기본 내보내기
export default {
  resourceManager,
  disposeScene,
  createAnimationLoop,
  loadAsync,
  optimizeRendererForDevice,
  estimateMemoryUsage
}; 