import React, { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerControllerProps {
  speed?: number;
  jumpHeight?: number;
}

// Interface para paredes
interface Wall {
  position: THREE.Vector3;
  size: THREE.Vector3;
  rotation: THREE.Euler;
}

const PlayerController: React.FC<PlayerControllerProps> = ({ 
  speed = 5, 
  jumpHeight = 5 
}) => {
  const { camera, scene } = useThree();
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
  const wallsRef = useRef<Wall[]>([]);

  // Função para detectar colisão com paredes e calcular movimento permitido
  const checkWallCollisionAndSlide = (newPosition: THREE.Vector3, movementVector: THREE.Vector3): { 
    canMove: boolean; 
    adjustedPosition: THREE.Vector3;
    isColliding: boolean;
  } => {
    const playerRadius = 0.5; // Raio do player para colisão
    const playerHeight = 2; // Altura do player
    let isColliding = false;
    let adjustedPosition = newPosition.clone();
    
    for (const wall of wallsRef.current) {
      // Converter posição da parede para coordenadas locais do player
      const localWallPos = newPosition.clone().sub(wall.position);
      
      // Aplicar rotação inversa da parede
      const inverseRotation = new THREE.Euler(
        -wall.rotation.x,
        -wall.rotation.y,
        -wall.rotation.z
      );
      localWallPos.applyEuler(inverseRotation);
      
      // Verificar colisão com caixa da parede
      const halfSize = wall.size.clone().multiplyScalar(0.5);
      
      // Verificar se o player está dentro da caixa da parede
      if (Math.abs(localWallPos.x) < halfSize.x + playerRadius &&
          Math.abs(localWallPos.y) < halfSize.y + playerHeight &&
          Math.abs(localWallPos.z) < halfSize.z + playerRadius) {
        
        isColliding = true;
        
        // Calcular direção da parede (normal da face)
        const wallNormal = new THREE.Vector3();
        if (Math.abs(localWallPos.x) < halfSize.x + playerRadius) {
          // Colisão com face X da parede
          wallNormal.set(localWallPos.x > 0 ? 1 : -1, 0, 0);
        } else if (Math.abs(localWallPos.z) < halfSize.z + playerRadius) {
          // Colisão com face Z da parede
          wallNormal.set(0, 0, localWallPos.z > 0 ? 1 : -1);
        } else {
          // Colisão com face Y da parede (topo/base)
          wallNormal.set(0, localWallPos.y > 0 ? 1 : -1, 0);
        }
        
        // Aplicar rotação da parede de volta para coordenadas mundiais
        wallNormal.applyEuler(wall.rotation);
        
        // Calcular movimento paralelo à parede (perpendicular à normal)
        const parallelMovement = movementVector.clone().projectOnPlane(wallNormal);
        
        // Calcular nova posição permitida - permitir mais movimento paralelo
        const allowedMovement = parallelMovement.clone().multiplyScalar(0.8); // Movimento mais suave
        adjustedPosition = camera.position.clone().add(allowedMovement);
        
        // Verificar se a nova posição ainda colide
        const stillColliding = checkSimpleCollision(adjustedPosition);
        if (stillColliding) {
          // Se ainda colide, tentar movimento reduzido progressivamente
          for (let factor = 0.6; factor > 0.1; factor -= 0.1) {
            const testPosition = camera.position.clone().add(parallelMovement.clone().multiplyScalar(factor));
            if (!checkSimpleCollision(testPosition)) {
              adjustedPosition = testPosition;
              break;
            }
          }
        }
        
        break; // Só processar a primeira colisão
      }
    }
    
    return {
      canMove: !isColliding,
      adjustedPosition: adjustedPosition,
      isColliding: isColliding
    };
  };

  // Função simples para verificar colisão (usada internamente)
  const checkSimpleCollision = (position: THREE.Vector3): boolean => {
    const playerRadius = 0.5;
    const playerHeight = 2;
    
    for (const wall of wallsRef.current) {
      const localWallPos = position.clone().sub(wall.position);
      const inverseRotation = new THREE.Euler(
        -wall.rotation.x,
        -wall.rotation.y,
        -wall.rotation.z
      );
      localWallPos.applyEuler(inverseRotation);
      
      const halfSize = wall.size.clone().multiplyScalar(0.5);
      
      if (Math.abs(localWallPos.x) < halfSize.x + playerRadius &&
          Math.abs(localWallPos.y) < halfSize.y + playerHeight &&
          Math.abs(localWallPos.z) < halfSize.z + playerRadius) {
        return true;
      }
    }
    
    return false;
  };

  // Função para atualizar lista de paredes
  const updateWalls = () => {
    const walls: Wall[] = [];
    
    // Procurar por todas as paredes na cena
    scene.traverse((object) => {
      if (object.userData.isWall && object instanceof THREE.Mesh) {
        const geometry = object.geometry as THREE.BoxGeometry;
        const size = new THREE.Vector3();
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          geometry.boundingBox.getSize(size);
        }
        
        walls.push({
          position: object.position.clone(),
          size: size,
          rotation: object.rotation.clone()
        });
      }
    });
    
    wallsRef.current = walls;
  };

  // Atualizar paredes quando a cena mudar
  useEffect(() => {
    updateWalls();
  }, [scene]);

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
        // Verificar colisão atual
        const currentCollision = checkSimpleCollision(camera.position);
        
        // Emit custom event with player position and collision status
        const event = new CustomEvent('playerPositionUpdate', {
          detail: {
            position: {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z
            },
            moving: keys.size > 0, // Player is moving if any key is pressed
            collision: {
              isColliding: currentCollision,
              wallsCount: wallsRef.current.length,
              nearbyWalls: wallsRef.current.filter(wall => {
                const distance = camera.position.distanceTo(wall.position);
                return distance < 5; // Paredes a menos de 5 unidades
              }).length,
              isSliding: currentCollision && keys.size > 0 // Sliding quando colidindo e movendo
            }
          }
        });
        window.dispatchEvent(event);
      }
    }, 100); // Update 10 times per second for smooth UI updates

    return () => clearInterval(interval);
  }, [isLocked, camera.position, keys]);

  // Movement and physics
  useFrame((state, delta) => {
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
      const newPosition = camera.position.clone().add(currentVelocity.clone().multiplyScalar(clampedDelta));
      
      // Verificar colisão e aplicar sliding se necessário
      const collisionResult = checkWallCollisionAndSlide(newPosition, currentVelocity.clone().multiplyScalar(clampedDelta));
      
      if (collisionResult.canMove) {
        // Sem colisão, mover normalmente
        camera.position.copy(newPosition);
      } else if (collisionResult.isColliding) {
        // Colisão detectada, aplicar movimento ajustado (sliding)
        camera.position.copy(collisionResult.adjustedPosition);
      }
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