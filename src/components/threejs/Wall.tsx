import React from 'react';
import * as THREE from 'three';

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ 
  position, 
  size, 
  color = "#8B4513",
  rotation = [0, 0, 0]
}) => {
  return (
    <mesh 
      position={position} 
      rotation={rotation}
      userData={{ isWall: true }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Wall; 