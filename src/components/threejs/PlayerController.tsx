import React, { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerControllerProps {
  speed?: number;
  jumpHeight?: number;
}

// Interface para limites de movimento
interface MovementBoundary {
  points: [number, number][];
  height: number;
  isPointInside: (point: [number, number]) => boolean;
  getDistanceToBoundary: (point: [number, number]) => { distance: number; normal: [number, number] };
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
  const boundariesRef = useRef<MovementBoundary[]>([]);

  // Função para detectar colisão com limites de movimento e calcular movimento permitido
  const checkBoundaryCollisionAndSlide = (newPosition: THREE.Vector3, movementVector: THREE.Vector3): { 
    canMove: boolean; 
    adjustedPosition: THREE.Vector3;
    isColliding: boolean;
  } => {
    let isColliding = false;
    let adjustedPosition = newPosition.clone();
    
    // Verificar se a nova posição está dentro de algum limite
    for (const boundary of boundariesRef.current) {
      const point2D: [number, number] = [newPosition.x, newPosition.z];
      
      if (!boundary.isPointInside(point2D)) {
        isColliding = true;
        
        // Calcular a distância até o limite mais próximo
        const boundaryInfo = boundary.getDistanceToBoundary(point2D);
        const [normalX, normalZ] = boundaryInfo.normal;
        
        // Criar vetor normal 3D
        const boundaryNormal = new THREE.Vector3(normalX, 0, normalZ);
        
        // Verificar se está próximo de uma quina (distância muito pequena)
        const isNearCorner = boundaryInfo.distance < 0.3; // Reduzido para ser mais preciso
        
        // Verificação adicional: detectar se está próximo de múltiplos limites (indicando quina)
        let isNearMultipleBoundaries = false;
        if (boundariesRef.current.length > 1) {
          let nearbyBoundaryCount = 0;
          for (const otherBoundary of boundariesRef.current) {
            if (otherBoundary !== boundary) {
              const otherDistance = otherBoundary.getDistanceToBoundary(point2D).distance;
              if (otherDistance < 0.8) { // Reduzido para ser mais preciso
                nearbyBoundaryCount++;
              }
            }
          }
          isNearMultipleBoundaries = nearbyBoundaryCount > 0;
        }
        
        // Aplicar colisão mais restritiva APENAS se estiver muito próximo de uma quina real
        // Se estiver apenas próximo de uma borda, permitir sliding normal
        if (isNearCorner && isNearMultipleBoundaries) {
          // Nas quinas reais, aplicar colisão mais restritiva - não permitir sliding
          // Calcular posição segura dentro do boundary
          const safeDistance = 0.1; // Distância mínima da borda
          const safePosition = new THREE.Vector3(
            newPosition.x - normalX * safeDistance,
            newPosition.y,
            newPosition.z - normalZ * safeDistance
          );
          
          // Verificar se a posição segura está dentro do boundary
          if (boundary.isPointInside([safePosition.x, safePosition.z])) {
            adjustedPosition = safePosition;
          } else {
            // Se não conseguir encontrar posição segura, manter posição atual
            adjustedPosition = camera.position.clone();
          }
        } else {
          // Não está na quina real, aplicar sliding normal
          // Calcular movimento paralelo ao limite (perpendicular à normal)
          const parallelMovement = movementVector.clone().projectOnPlane(boundaryNormal);
          
          // Verificar se o movimento paralelo não está tentando sair por outra direção
          const testParallelPosition = camera.position.clone().add(parallelMovement.clone().multiplyScalar(0.8));
          const isParallelSafe = boundary.isPointInside([testParallelPosition.x, testParallelPosition.z]);
          
          if (isParallelSafe) {
            // Movimento paralelo é seguro, aplicar normalmente
            adjustedPosition = testParallelPosition;
          } else {
            // Movimento paralelo não é seguro (pode estar tentando sair por quina)
            // Aplicar movimento reduzido na direção original, mas com verificação de segurança
            const safeMovement = movementVector.clone().multiplyScalar(0.4); // Aumentado para movimento mais suave
            const testSafePosition = camera.position.clone().add(safeMovement);
            
            if (boundary.isPointInside([testSafePosition.x, testSafePosition.z])) {
              adjustedPosition = testSafePosition;
            } else {
              // Se ainda não for seguro, tentar movimento ainda mais reduzido
              const verySafeMovement = movementVector.clone().multiplyScalar(0.2);
              const testVerySafePosition = camera.position.clone().add(verySafeMovement);
              
              if (boundary.isPointInside([testVerySafePosition.x, testVerySafePosition.z])) {
                adjustedPosition = testVerySafePosition;
              } else {
                // Se tudo falhar, manter posição atual
                adjustedPosition = camera.position.clone();
              }
            }
          }
          
          // Verificação final de segurança
          if (!boundary.isPointInside([adjustedPosition.x, adjustedPosition.z])) {
            // Última tentativa: encontrar posição segura próxima
            const fallbackDistance = 0.15;
            const fallbackPosition = new THREE.Vector3(
              newPosition.x - normalX * fallbackDistance,
              newPosition.y,
              newPosition.z - normalZ * fallbackDistance
            );
            
            if (boundary.isPointInside([fallbackPosition.x, fallbackPosition.z])) {
              adjustedPosition = fallbackPosition;
            } else {
              // Se tudo falhar, manter posição atual
              adjustedPosition = camera.position.clone();
            }
          }
        }
        
        break; // Só processar o primeiro limite violado
      }
    }
    
    return {
      canMove: !isColliding,
      adjustedPosition: adjustedPosition,
      isColliding: isColliding
    };
  };

  // Função simples para verificar se está dentro dos limites (usada internamente)
  const checkBoundaryCollision = (position: THREE.Vector3): boolean => {
    const point2D: [number, number] = [position.x, position.z];
    
    for (const boundary of boundariesRef.current) {
      if (!boundary.isPointInside(point2D)) {
        return true; // Colisão = está fora do limite
      }
    }
    
    return false; // Sem colisão = está dentro dos limites
  };

  // Função para atualizar lista de limites de movimento
  const updateBoundaries = () => {
    const boundaries: MovementBoundary[] = [];
    
    // Procurar por todos os limites de movimento na cena
    scene.traverse((object) => {
      if (object.userData.isMovementBoundary && object.userData.boundaryData) {
        boundaries.push(object.userData.boundaryData);
      }
    });
    
    boundariesRef.current = boundaries;
  };

  // Atualizar limites quando a cena mudar
  useEffect(() => {
    updateBoundaries();
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
        const currentCollision = checkBoundaryCollision(camera.position);
        
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
              boundariesCount: boundariesRef.current.length,
              nearbyBoundaries: boundariesRef.current.filter(boundary => {
                const point2D: [number, number] = [camera.position.x, camera.position.z];
                const boundaryInfo = boundary.getDistanceToBoundary(point2D);
                return boundaryInfo.distance < 5; // Limites a menos de 5 unidades
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
      const newPosition = camera.position.clone().add(currentVelocity.clone().multiplyScalar(clampedDelta));
      
      // Verificar colisão e aplicar sliding se necessário
      const collisionResult = checkBoundaryCollisionAndSlide(newPosition, currentVelocity.clone().multiplyScalar(clampedDelta));
      
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