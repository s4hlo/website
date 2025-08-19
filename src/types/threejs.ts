import * as THREE from 'three';

// Player types
export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  isOnGround: boolean;
  isMoving: boolean;
  isRunning: boolean;
  health: number;
  stamina: number;
}

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  mouseX: number;
  mouseY: number;
}

// World types
export interface WorldObject {
  id: string;
  type: 'building' | 'tree' | 'rock' | 'prop';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  castShadow: boolean;
  receiveShadow: boolean;
}

export interface TerrainChunk {
  id: string;
  position: THREE.Vector2;
  size: number;
  heightMap: Float32Array;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  lod: number;
}

// Performance types
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  memory: {
    geometries: number;
    textures: number;
    triangles: number;
  };
}

export interface QualitySettings {
  level: 'low' | 'medium' | 'high';
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  antialiasing: boolean;
  postProcessing: boolean;
  maxDrawDistance: number;
}

// Camera types
export interface CameraSettings {
  fov: number;
  near: number;
  far: number;
  sensitivity: number;
  maxPitch: number;
  minPitch: number;
  smoothness: number;
}

// Lighting types
export interface LightingSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  fogEnabled: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

// Physics types
export interface PhysicsSettings {
  gravity: number;
  friction: number;
  airResistance: number;
  collisionDetection: boolean;
  maxVelocity: number;
}

// Export all types
export type {
  THREE
}; 