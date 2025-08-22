import React from 'react';
import { useThree } from '@react-three/fiber';
import { Sky, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Environment: React.FC = () => {
  const { scene } = useThree();

  // Set scene background
  React.useEffect(() => {
    scene.fog = new THREE.Fog('#87CEEB', 50, 200);
  }, [scene]);

  return (
    <>
      {/* Sky with sun */}
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light (sun) */}
      <directionalLight
        position={[50, 50, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Some decorative clouds */}
      <Cloud
        opacity={0.5}
        speed={0.4}
        segments={20}
        position={[-20, 15, -10]}
      />
      <Cloud
        opacity={0.3}
        speed={0.3}
        segments={15}
        position={[15, 20, -15]}
      />
    </>
  );
};

export default Environment; 