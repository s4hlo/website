import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ThreePageContainer from '../components/threejs/ThreePageContainer';

const ThreeDMuseum: React.FC = () => {
  return (
    <ThreePageContainer>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
        shadows={true}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Museum Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        
        {/* Museum Walls */}
        <mesh position={[0, 5, -15]} castShadow receiveShadow>
          <boxGeometry args={[30, 10, 1]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        
        <mesh position={[-15, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 10, 30]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        
        <mesh position={[15, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 10, 30]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        
        {/* Display Pedestals */}
        <mesh position={[-8, 1, -8]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 2, 8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        <mesh position={[8, 1, -8]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 2, 8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        <mesh position={[0, 1, -8]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 2, 8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        {/* Museum Artifacts */}
        <mesh position={[-8, 3, -8]} castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        <mesh position={[8, 3, -8]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
        
        <mesh position={[0, 3, -8]} castShadow>
          <torusGeometry args={[0.6, 0.3, 8, 16]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 10, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 3, -8]}
          maxDistance={25}
          minDistance={5}
        />
      </Canvas>
    </ThreePageContainer>
  );
};

export default ThreeDMuseum;
