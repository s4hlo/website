import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
  const { camera } = useThree();
  
  // Refs para as paredes
  const frontWallRef = useRef<THREE.Mesh>(null);
  const backWallRef = useRef<THREE.Mesh>(null);
  const leftWallRef = useRef<THREE.Mesh>(null);
  const rightWallRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!camera) return;

    const cameraPos = camera.position;
    
    // Posições das paredes
    const frontWallPos = [0, floorHeight + halfWallHeight, -halfFloorSize - wallThickness/2];
    const backWallPos = [0, floorHeight + halfWallHeight, halfFloorSize + wallThickness/2];
    const leftWallPos = [-halfFloorSize - wallThickness/2, floorHeight + halfWallHeight, 0];
    const rightWallPos = [halfFloorSize + wallThickness/2, floorHeight + halfWallHeight, 0];

    // Calcula distâncias 3D reais da câmera para cada parede
    const distances = [
      { 
        ref: frontWallRef, 
        distance: Math.sqrt(
          Math.pow(cameraPos.x - frontWallPos[0], 2) + 
          Math.pow(cameraPos.y - frontWallPos[1], 2) + 
          Math.pow(cameraPos.z - frontWallPos[2], 2)
        )
      },
      { 
        ref: backWallRef, 
        distance: Math.sqrt(
          Math.pow(cameraPos.x - backWallPos[0], 2) + 
          Math.pow(cameraPos.y - backWallPos[1], 2) + 
          Math.pow(cameraPos.z - backWallPos[2], 2)
        )
      },
      { 
        ref: leftWallRef, 
        distance: Math.sqrt(
          Math.pow(cameraPos.x - leftWallPos[0], 2) + 
          Math.pow(cameraPos.y - leftWallPos[1], 2) + 
          Math.pow(cameraPos.z - leftWallPos[2], 2)
        )
      },
      { 
        ref: rightWallRef, 
        distance: Math.sqrt(
          Math.pow(cameraPos.x - rightWallPos[0], 2) + 
          Math.pow(cameraPos.y - rightWallPos[1], 2) + 
          Math.pow(cameraPos.z - rightWallPos[2], 2)
        )
      }
    ];

    // Encontra a parede mais próxima
    const closestWall = distances.reduce((closest, current) => 
      current.distance < closest.distance ? current : closest
    );

    // Ajusta opacidade: parede mais próxima = 0, outras = 0.95
    distances.forEach(({ ref, distance }) => {
      if (ref.current) {
        const material = ref.current.material as THREE.MeshStandardMaterial;
        if (material) {
          material.opacity = distance === closestWall.distance ? 0.3 : 0.95;
        }
      }
    });
  });

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


      {/* Roof*/}
      <RigidBody type="fixed" position={[0, floorHeight + wallHeight, 0]} colliders="cuboid">
        <mesh receiveShadow>
          <boxGeometry args={[floorSize, 1, floorSize]} />
          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.00}
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
        <mesh ref={frontWallRef}>
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
        <mesh ref={backWallRef}>
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
        <mesh ref={leftWallRef}>
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
        <mesh ref={rightWallRef}>
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