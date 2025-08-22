import React, { useCallback, useRef, useState } from 'react';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { create } from 'zustand';
import type { ThreeEvent } from '@react-three/fiber';

interface CubeStore {
  cubes: [number, number, number][];
  addCube: (x: number, y: number, z: number) => void;
}

const useCubeStore = create<CubeStore>((set) => ({
  cubes: [],
  addCube: (x, y, z) => set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}));

export const Cubes: React.FC = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return (
    <>
      {cubes.map((coords, index) => (
        <Cube key={index} position={coords} />
      ))}
    </>
  );
};

interface CubeProps {
  position: [number, number, number];
  [key: string]: unknown;
}

export const Cube: React.FC<CubeProps> = (props) => {
  const ref = useRef<RapierRigidBody>(null);
  const [hover, set] = useState<number | null>(null);
  const addCube = useCubeStore((state) => state.addCube);

  const onMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.faceIndex !== null && e.faceIndex !== undefined) {
      set(Math.floor(e.faceIndex / 2));
    }
  }, []);

  const onOut = useCallback(() => set(null), []);

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!ref.current || e.faceIndex === null || e.faceIndex === undefined) return;
    
    const { x, y, z } = ref.current.translation();
    const dir: [number, number, number][] = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];
    
    const faceIndex = Math.floor(e.faceIndex / 2);
    if (faceIndex >= 0 && faceIndex < dir.length) {
      const [newX, newY, newZ] = dir[faceIndex];
      addCube(newX, newY, newZ);
    }
  }, [addCube]);

  return (
    <RigidBody {...props} type="fixed" colliders="cuboid" ref={ref}>
      <mesh
        receiveShadow
        castShadow
        onPointerMove={onMove}
        onPointerOut={onOut}
        onClick={onClick}
      >
        {[...Array(6)].map((_, index) => (
          <meshStandardMaterial
            attach={`material-${index}`}
            key={index}
            color={hover === index ? 'hotpink' : 'white'}
          />
        ))}
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
};
