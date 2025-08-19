import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface ThreeWorldState {
  isLoaded: boolean;
  performance: {
    fps: number;
    memory: {
      geometries: number;
      textures: number;
      triangles: number;
    };
  };
  quality: 'low' | 'medium' | 'high';
}

export const useThreeWorld = () => {
  const [state, setState] = useState<ThreeWorldState>({
    isLoaded: false,
    performance: {
      fps: 0,
      memory: {
        geometries: 0,
        textures: 0,
        triangles: 0
      }
    },
    quality: 'medium'
  });

  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  // Performance monitoring
  const updatePerformance = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      setFrameCount(prev => prev + 1);
      
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          fps: Math.round(fps)
        }
      }));
    }
    
    setLastTime(currentTime);
  }, [lastTime]);

  // Memory monitoring
  const updateMemory = useCallback(() => {
    if (THREE.MemoryInfo) {
      const info = THREE.MemoryInfo;
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          memory: {
            geometries: info.geometries || 0,
            textures: info.textures || 0,
            triangles: info.triangles || 0
          }
        }
      }));
    }
  }, []);

  // Quality adjustment
  const setQuality = useCallback((quality: 'low' | 'medium' | 'high') => {
    setState(prev => ({ ...prev, quality }));
  }, []);

  // Auto-quality adjustment based on performance
  useEffect(() => {
    const interval = setInterval(() => {
      updatePerformance();
      updateMemory();
      
      // Auto-adjust quality based on FPS
      if (state.performance.fps < 30 && state.quality !== 'low') {
        setQuality('low');
      } else if (state.performance.fps > 55 && state.quality !== 'high') {
        setQuality('high');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.performance.fps, state.quality, updatePerformance, updateMemory, setQuality]);

  // Set loaded state
  const setLoaded = useCallback((loaded: boolean) => {
    setState(prev => ({ ...prev, isLoaded: loaded }));
  }, []);

  return {
    state,
    setQuality,
    setLoaded,
    updatePerformance,
    updateMemory
  };
}; 