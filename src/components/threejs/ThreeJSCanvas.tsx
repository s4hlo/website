import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ThreeJSCanvasProps {
  className?: string;
}

const ThreeJSCanvas: React.FC<ThreeJSCanvasProps> = ({ className }) => {
  return (
    <div className={className} style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ background: '#1a1a1a' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Test cube to verify rendering */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeJSCanvas; 