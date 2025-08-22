import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { CapsuleCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export const Player: React.FC = () => {
  const ref = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    if (!ref.current) return;
    
    const { forward, backward, left, right, jump } = get();
    const velocity = ref.current.linvel();
    
    // Update camera
    const translation = ref.current.translation();
    state.camera.position.set(translation.x, translation.y, translation.z);
    
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    
    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
    
    // Simple jumping - just check if jump key is pressed
    if (jump) {
      ref.current.setLinvel({ x: 0, y: 7.5, z: 0 }, true);
    }
  });

  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
  );
};
