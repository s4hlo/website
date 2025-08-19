import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Terrain: React.FC = () => {
  const groundRef = React.useRef<THREE.Mesh>(null);
  const treesRef = React.useRef<THREE.Group>(null);

  // Simple animation for trees
  useFrame((state) => {
    if (treesRef.current) {
      treesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      {/* Ground plane */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#90EE90"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Simple trees */}
      <group ref={treesRef}>
        {/* Tree 1 */}
        <mesh position={[-10, 0, -10]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-10, 2, -10]} castShadow>
          <coneGeometry args={[2, 4]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Tree 2 */}
        <mesh position={[10, 0, -15]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[10, 1.5, -15]} castShadow>
          <coneGeometry args={[1.5, 3]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Tree 3 */}
        <mesh position={[-5, 0, 15]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-5, 2.5, 15]} castShadow>
          <coneGeometry args={[2.5, 5]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>

      {/* Some rocks */}
      <mesh position={[5, 0, 5]} castShadow>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      <mesh position={[-8, 0, 8]} castShadow>
        <dodecahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
    </>
  );
};

export default Terrain; 