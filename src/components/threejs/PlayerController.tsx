import React, { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerControllerProps {
  speed?: number;
  jumpHeight?: number;
}

const PlayerController: React.FC<PlayerControllerProps> = ({ 
  speed = 5, 
  jumpHeight = 5 
}) => {
  const { camera } = useThree();
  const [isLocked, setIsLocked] = useState(false);
  const [isOnGround, setIsOnGround] = useState(true);
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [currentVelocity, setCurrentVelocity] = useState(new THREE.Vector3());
  const [targetVelocity, setTargetVelocity] = useState(new THREE.Vector3());
  const [lastHorizontalDirection, setLastHorizontalDirection] = useState(new THREE.Vector3(0, 0, -1));
  
  // Use refs for immediate access without React state delays
  const justJumpedRef = useRef(false);
  const jumpCooldownRef = useRef(0);
  const velocityRef = useRef(new THREE.Vector3());

  // Synchronize velocityRef with velocity state
  useEffect(() => {
    velocityRef.current.copy(velocity);
  }, [velocity]);

  // Handle pointer lock
  useEffect(() => {
    const handlePointerLockChange = () => {
      // Check if pointer is locked to the canvas element
      const canvas = document.querySelector('canvas');
      const isLockedToCanvas = document.pointerLockElement === canvas;
      setIsLocked(isLockedToCanvas);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(event.code));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.code);
        return newKeys;
      });
    };

    // Add event listeners to canvas instead of document
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);

    // Ensure canvas can receive keyboard events
    canvas.tabIndex = 0;
    canvas.focus();

    return () => {
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Initialize camera position and state
  useEffect(() => {
    if (camera && isLocked) {
      // Ensure camera starts at ground level
      if (camera.position.y < 2) {
        camera.position.y = 2;
      }
      setIsOnGround(true);
      justJumpedRef.current = false;
      jumpCooldownRef.current = 0;
      velocityRef.current.set(0, 0, 0);
    }
  }, [camera, isLocked]);

  // Emit player position updates for UI
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLocked) {
        // Emit custom event with player position
        const event = new CustomEvent('playerPositionUpdate', {
          detail: {
            position: {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z
            },
            moving: keys.size > 0 // Player is moving if any key is pressed
          }
        });
        window.dispatchEvent(event);
      }
    }, 100); // Update 10 times per second for smooth UI updates

    return () => clearInterval(interval);
  }, [isLocked, camera.position, keys]);

  // Movement and physics
  useFrame((_, delta) => {
    if (!isLocked) {
      return;
    }

    // Ensure delta time is reasonable to prevent large jumps
    const clampedDelta = Math.min(delta, 0.1); // Cap at 100ms to prevent huge jumps

    const moveVector = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Get camera directions - but only horizontal movement (ignore pitch)
    camera.getWorldDirection(forward);
    
    // Create horizontal forward vector (ignore Y component for movement)
    const horizontalForward = forward.clone();
    horizontalForward.y = 0; // Force Y to 0 for horizontal movement only
    
    // Handle edge case where camera is looking straight up/down
    if (horizontalForward.length() < 0.01) {
      // Camera is looking straight up or down, use last known direction or default
      horizontalForward.copy(lastHorizontalDirection);
    } else {
      // Update cached direction
      setLastHorizontalDirection(horizontalForward.clone());
    }
    
    horizontalForward.normalize();
    
    // Create right vector perpendicular to horizontal forward
    right.set(-horizontalForward.z, 0, horizontalForward.x);
    right.normalize();

    // WASD movement - now relative to camera direction (horizontal only)
    if (keys.has('KeyW')) {
      // Move forward in horizontal camera direction
      moveVector.add(horizontalForward.clone().multiplyScalar(1));
    }
    if (keys.has('KeyS')) {
      // Move backward opposite to horizontal camera direction
      moveVector.add(horizontalForward.clone().multiplyScalar(-1));
    }
    if (keys.has('KeyA')) {
      // Strafe left (perpendicular to horizontal forward direction)
      moveVector.add(right.clone().multiplyScalar(-1));
    }
    if (keys.has('KeyD')) {
      // Strafe right (perpendicular to horizontal forward direction)
      moveVector.add(right.clone().multiplyScalar(1));
    }

    // Ensure movement is always horizontal
    if (Math.abs(moveVector.y) > 0.01) {
      moveVector.y = 0;
      moveVector.normalize();
    }

    // Jump - separate from horizontal movement
    if (keys.has('Space') && isOnGround && !justJumpedRef.current && jumpCooldownRef.current <= 0) {
      // IMMEDIATELY set velocity to prevent ground detection from interfering
      velocityRef.current.y = jumpHeight;
      setVelocity(velocityRef.current.clone());
      
      setIsOnGround(false);
      justJumpedRef.current = true;
      jumpCooldownRef.current = 0.1; // 100ms cooldown
    }

    // Update jump cooldown
    if (jumpCooldownRef.current > 0) {
      jumpCooldownRef.current = Math.max(0, jumpCooldownRef.current - clampedDelta);
    }

    // Reset justJumped flag after a short delay
    if (justJumpedRef.current && jumpCooldownRef.current <= 0) {
      justJumpedRef.current = false;
    }

    // Apply gravity (with terminal velocity)
    if (!isOnGround) {
      const gravity = 9.8;
      const terminalVelocity = -20; // Prevent falling too fast
      
      velocityRef.current.y -= gravity * clampedDelta;
      
      // Apply terminal velocity
      if (velocityRef.current.y < terminalVelocity) {
        velocityRef.current.y = terminalVelocity;
      }
      
      setVelocity(velocityRef.current.clone()); // Update state
    }

    // Ground detection (improved) - don't interfere with jump
    const groundLevel = 2;
    if (camera.position.y <= groundLevel && !justJumpedRef.current) {
      camera.position.y = groundLevel;
      velocityRef.current.y = 0;
      setVelocity(velocityRef.current.clone());
      setIsOnGround(true);
    }

    // Additional ground detection for when falling - also don't interfere with jump
    if (velocityRef.current.y < 0 && camera.position.y <= groundLevel + 0.1 && !justJumpedRef.current) {
      camera.position.y = groundLevel;
      velocityRef.current.y = 0;
      setVelocity(velocityRef.current.clone());
      setIsOnGround(true);
    }

    // Apply horizontal movement - now properly relative to camera
    if (moveVector.length() > 0) {
      // Normalize and set target velocity (horizontal only)
      moveVector.normalize();
      setTargetVelocity(moveVector.clone().multiplyScalar(speed));
    } else {
      // No keys pressed, target velocity is zero
      setTargetVelocity(new THREE.Vector3());
    }

    // Smooth acceleration/deceleration for horizontal movement
    const acceleration = 15; // units per second squared
    const deceleration = 20; // units per second squared
    
    if (targetVelocity.length() > 0) {
      // Accelerate towards target velocity
      setCurrentVelocity(prev => {
        const newVelocity = prev.lerp(targetVelocity, acceleration * clampedDelta);
        return newVelocity;
      });
    } else {
      // Decelerate to zero
      setCurrentVelocity(prev => {
        const newVelocity = prev.lerp(new THREE.Vector3(), deceleration * clampedDelta);
        return newVelocity;
      });
    }

    // Apply horizontal movement with current velocity
    if (currentVelocity.length() > 0.01) { // Small threshold to prevent jitter
      camera.position.add(currentVelocity.clone().multiplyScalar(clampedDelta));
    }

    // Apply vertical velocity (jump/gravity) - SEPARATE from horizontal movement
    if (Math.abs(velocityRef.current.y) > 0.01) {
      camera.position.y += velocityRef.current.y * clampedDelta;
    }

    // Only allow ground detection after we've actually left the ground
    if (justJumpedRef.current && camera.position.y > groundLevel + 0.5) {
      justJumpedRef.current = false;
    }
  });

  return (
    <PointerLockControls
      onLock={() => setIsLocked(true)}
      onUnlock={() => setIsLocked(false)}
      selector="canvas"
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
    />
  );
};

export default PlayerController; 