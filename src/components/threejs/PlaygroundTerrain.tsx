import React from "react";
import { RigidBody } from "@react-three/rapier";

interface PlaygroundTerrainProps {
  floorHeight?: number;
  floorSize?: number;
  wallThickness?: number;
  wallHeight?: number;
}

const PlaygroundTerrain: React.FC<PlaygroundTerrainProps> = ({
  floorHeight = -5,
  floorSize = 40,
  wallThickness = 1,
  wallHeight = 30,
}) => {
  const halfFloorSize = floorSize / 2;
  const halfWallHeight = wallHeight / 2;

  return (
    <group>
      {/* Chão elegante */}
      <RigidBody type="fixed" position={[0, floorHeight, 0]} colliders="cuboid">
        <mesh receiveShadow>
          <boxGeometry args={[floorSize, 1, floorSize]} />
          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.95}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Parede frontal (Z negativo) */}
      <RigidBody 
        type="fixed" 
        position={[0, floorHeight + halfWallHeight, -halfFloorSize - wallThickness/2]} 
        colliders="cuboid"
      >
        <mesh visible={true}>
          <boxGeometry args={[floorSize + wallThickness * 2, wallHeight, wallThickness]} />

          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.95}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Parede traseira (Z positivo) */}
      <RigidBody 
        type="fixed" 
        position={[0, floorHeight + halfWallHeight, halfFloorSize + wallThickness/2]} 
        colliders="cuboid"
      >
        <mesh visible={true}>
          <boxGeometry args={[floorSize + wallThickness * 2, wallHeight, wallThickness]} />

          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.95}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Parede esquerda (X negativo) */}
      <RigidBody 
        type="fixed" 
        position={[-halfFloorSize - wallThickness/2, floorHeight + halfWallHeight, 0]} 
        colliders="cuboid"
      >
        <mesh visible={true}>
          <boxGeometry args={[wallThickness, wallHeight, floorSize]} />

          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.95}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Parede direita (X positivo) */}
      <RigidBody 
        type="fixed" 
        position={[halfFloorSize + wallThickness/2, floorHeight + halfWallHeight, 0]} 
        colliders="cuboid"
      >
        <mesh visible={true}>
          <boxGeometry args={[wallThickness, wallHeight, floorSize]} />

          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.95}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default PlaygroundTerrain; 