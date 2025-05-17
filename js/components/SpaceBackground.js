/**
 * Cosmic Portfolio - 우주 배경 컴포넌트
 * Three.js를 사용한 최적화된 우주 배경
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { resourceManager, optimizeRendererForDevice } from '../3d/ThreeUtils.js';
import { isMobile, isLowPowerMode, getThreeJsSettings } from '../utils/config.js';

class SpaceBackground {
  constructor(canvasId, options = {}) {
    // 캔버스 요소 가져오기
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`SpaceBackground: 캔버스 요소를 찾을 수 없음 (${canvasId})`);
      return;
    }
    
    // 옵션 설정
    this.options = {
      starsCount: options.starsCount || (isMobile() ? 500 : 1500),
      starsSize: options.starsSize || { min: 0.1, max: isMobile() ? 1.5 : 3 },
      starsColor: options.starsColor || 0xFFFFFF,
      nebulaeCount: options.nebulaeCount || (isMobile() ? 3 : 5),
      interactive: options.interactive !== false,
      rotationSpeed: options.rotationSpeed || 0.0001,
      fov: options.fov || 60,
      ...options
    };
    
    // Three.js 객체들
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = null;
    this.nebulae = null;
    this.animationFrame = null;
    
    // 상호작용 관련 상태
    this.isActive = true;
    this.isVisible = true;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    
    // 성능 최적화 관련
    this.lowPowerMode = isLowPowerMode();
    this.lastFrameTime = 0;
    this.frameInterval = this.lowPowerMode ? 40 : 16;  // 저전력 모드: 25fps, 일반: 60fps
    
    // 이벤트 리스너
    this.eventListeners = [];
    
    // 초기화
    this.init();
  }
  
  /**
   * 초기화
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createStars();
    this.createNebulae();
    
    // 이벤트 리스너 추가
    if (this.options.interactive) {
      this.addEventListeners();
    }
    
    // 애니메이션 시작
    this.animate();
    
    // 가시성 변경 감지
    this.addVisibilityListener();
    
    // 크기 조정 이벤트
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  /**
   * 씬 생성
   */
  createScene() {
    this.scene = new THREE.Scene();
  }
  
  /**
   * 카메라 생성
   */
  createCamera() {
    const settings = getThreeJsSettings();
    const { width, height } = this.canvas.getBoundingClientRect();
    
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      width / height,
      0.1,
      1000
    );
    
    this.camera.position.z = 50;
  }
  
  /**
   * 렌더러 생성
   */
  createRenderer() {
    // Three.js 렌더러 설정 가져오기
    const settings = getThreeJsSettings();
    
    // WebGL 렌더러 생성
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: settings.renderer.antialias,
      alpha: true,
      precision: settings.renderer.precision
    });
    
    // 렌더러 사이즈 설정
    const { width, height } = this.canvas.getBoundingClientRect();
    this.renderer.setSize(width, height);
    
    // 기기에 맞게 최적화
    optimizeRendererForDevice(this.renderer);
    
    // 기타 설정
    this.renderer.setPixelRatio(window.devicePixelRatio * 
      (this.lowPowerMode ? 0.75 : 1)); // 저전력 모드에서는 픽셀 비율 조정
  }
  
  /**
   * 별 생성
   */
  createStars() {
    // 기존에 별이 있다면 제거
    if (this.stars) {
      this.scene.remove(this.stars);
      this.stars.geometry.dispose();
      this.stars.material.dispose();
    }
    
    // 기하학 정보 생성
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = this.options.starsCount;
    
    // 위치 배열 생성
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    const colors = new Float32Array(starsCount * 3);
    
    const color = new THREE.Color(this.options.starsColor);
    
    // 별 생성
    for (let i = 0; i < starsCount; i++) {
      // 구 내부에 무작위 분포
      const radius = Math.random() * 50 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // 극좌표를 데카르트 좌표로 변환
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // 별 크기 설정
      const size = Math.random() * 
        (this.options.starsSize.max - this.options.starsSize.min) + 
        this.options.starsSize.min;
      sizes[i] = size;
      
      // 별 색상 (약간의 변화)
      const hue = Math.random() * 0.1; // 약간의 색상 변화
      const starColor = new THREE.Color().setHSL(hue, 0.2, 0.8 + Math.random() * 0.2);
      
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
    }
    
    // 버퍼 속성 설정
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 셰이더 재질 생성
    const starsMaterial = new THREE.PointsMaterial({
      size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    // 자원 관리자에 캐싱
    this.starsGeometry = resourceManager.cacheGeometry('stars', starsGeometry);
    this.starsMaterial = resourceManager.cacheMaterial('stars', starsMaterial);
    
    // 포인트 객체 생성
    this.stars = new THREE.Points(this.starsGeometry, this.starsMaterial);
    this.scene.add(this.stars);
  }
  
  /**
   * 성운 생성
   */
  createNebulae() {
    // 기존 성운 제거
    if (this.nebulae) {
      this.nebulae.forEach(nebula => {
        this.scene.remove(nebula);
        nebula.geometry.dispose();
        nebula.material.dispose();
      });
    }
    
    this.nebulae = [];
    
    // 저전력 모드에서는 생략
    if (this.lowPowerMode && isMobile()) {
      return;
    }
    
    for (let i = 0; i < this.options.nebulaeCount; i++) {
      // 성운용 평면 지오메트리
      const size = Math.random() * 30 + 20;
      const nebulaGeometry = new THREE.PlaneGeometry(size, size);
      
      // 색상 설정 (우주 색상)
      const hue = Math.random() * 0.2 + 0.6; // 파란색-보라색 계열
      const saturation = Math.random() * 0.3 + 0.7;
      const lightness = Math.random() * 0.3 + 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      
      // 성운 재질
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.05 + 0.05,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      
      // 자원 관리자에 캐싱
      const geometryKey = `nebula_${i}`;
      const materialKey = `nebulaMaterial_${i}`;
      
      const geometry = resourceManager.cacheGeometry(geometryKey, nebulaGeometry);
      const material = resourceManager.cacheMaterial(materialKey, nebulaMaterial);
      
      // 메쉬 생성
      const nebula = new THREE.Mesh(geometry, material);
      
      // 무작위 위치 및 회전
      nebula.position.set(
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        Math.random() * 80 - 70
      );
      
      nebula.rotation.x = Math.random() * Math.PI * 2;
      nebula.rotation.y = Math.random() * Math.PI * 2;
      nebula.rotation.z = Math.random() * Math.PI * 2;
      
      this.scene.add(nebula);
      this.nebulae.push(nebula);
    }
  }
  
  /**
   * 이벤트 리스너 추가
   */
  addEventListeners() {
    // 마우스 이벤트
    const mouseMoveHandler = this.handleMouseMove.bind(this);
    document.addEventListener('mousemove', mouseMoveHandler);
    this.eventListeners.push({ type: 'mousemove', handler: mouseMoveHandler });
    
    // 터치 이벤트
    const touchMoveHandler = this.handleTouchMove.bind(this);
    document.addEventListener('touchmove', touchMoveHandler, { passive: true });
    this.eventListeners.push({ type: 'touchmove', handler: touchMoveHandler });
  }
  
  /**
   * 가시성 리스너 추가
   */
  addVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isVisible = false;
        this.pauseAnimation();
      } else {
        this.isVisible = true;
        this.resumeAnimation();
      }
    });
  }
  
  /**
   * 마우스 이동 핸들러
   * @param {MouseEvent} event - 마우스 이벤트
   */
  handleMouseMove(event) {
    const { clientX, clientY } = event;
    
    // 화면 중앙 기준 좌표
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    this.mouseX = (clientX - windowHalfX) / windowHalfX;
    this.mouseY = (clientY - windowHalfY) / windowHalfY;
    
    // 회전 목표값 업데이트
    this.targetRotationY = this.mouseX * 0.1;
    this.targetRotationX = this.mouseY * 0.1;
  }
  
  /**
   * 터치 이동 핸들러
   * @param {TouchEvent} event - 터치 이벤트
   */
  handleTouchMove(event) {
    if (event.touches.length > 0) {
      const { clientX, clientY } = event.touches[0];
      
      // 마우스 이벤트와 동일하게 처리
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      
      this.mouseX = (clientX - windowHalfX) / windowHalfX;
      this.mouseY = (clientY - windowHalfY) / windowHalfY;
      
      // 회전 목표값 업데이트 (모바일에서는 더 적은 효과)
      this.targetRotationY = this.mouseX * 0.05;
      this.targetRotationX = this.mouseY * 0.05;
    }
  }
  
  /**
   * 크기 조정 핸들러
   */
  handleResize() {
    if (!this.camera || !this.renderer || !this.canvas) return;
    
    // 크기 가져오기
    const { width, height } = this.canvas.getBoundingClientRect();
    
    // 카메라 업데이트
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    // 렌더러 업데이트
    this.renderer.setSize(width, height);
  }
  
  /**
   * 애니메이션 루프
   * @param {number} timestamp - 타임스탬프
   */
  animate(timestamp = 0) {
    // 다음 프레임 예약
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    
    // 페이지가 보이지 않을 때는 렌더링 건너뛰기
    if (!this.isVisible || !this.isActive) return;
    
    // 프레임 제한 (성능 최적화)
    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed < this.frameInterval) return;
    
    this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
    
    // 별 자동 회전
    if (this.stars) {
      this.stars.rotation.y += this.options.rotationSpeed;
      
      // 마우스/터치 인터랙션
      if (this.options.interactive) {
        // 부드러운 회전 전환
        this.stars.rotation.x += (this.targetRotationX - this.stars.rotation.x) * 0.01;
        this.stars.rotation.y += (this.targetRotationY - this.stars.rotation.y) * 0.01;
      }
    }
    
    // 성운 회전
    if (this.nebulae) {
      this.nebulae.forEach(nebula => {
        nebula.rotation.x += 0.0003;
        nebula.rotation.y += 0.0002;
      });
    }
    
    // 렌더링
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * 애니메이션 일시정지
   */
  pauseAnimation() {
    this.isActive = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  /**
   * 애니메이션 재개
   */
  resumeAnimation() {
    if (!this.isActive) {
      this.isActive = true;
      this.lastFrameTime = 0;
      this.animate();
    }
  }
  
  /**
   * 리소스 해제
   */
  dispose() {
    // 애니메이션 중지
    this.pauseAnimation();
    
    // 이벤트 리스너 제거
    this.eventListeners.forEach(({ type, handler }) => {
      document.removeEventListener(type, handler);
    });
    
    // Three.js 리소스 해제
    if (this.scene) {
      // 별 제거
      if (this.stars) {
        this.scene.remove(this.stars);
        this.stars.geometry.dispose();
        this.stars.material.dispose();
      }
      
      // 성운 제거
      if (this.nebulae) {
        this.nebulae.forEach(nebula => {
          this.scene.remove(nebula);
          nebula.geometry.dispose();
          nebula.material.dispose();
        });
      }
    }
    
    // 렌더러 처리
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export default SpaceBackground; 