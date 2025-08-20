import * as THREE from "three";
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import { Box } from "@mui/material";
import ParticleField from "../components/threejs/ParticleField";

function ThreeDCubesScene() {
  const sphereCount = 125;

  // Gera posições para um cubo 5x5x5
  const cubePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const size = 5;
    const spacing = 1.1; // Espaçamento ajustado para esferas de raio 0.5

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const posX = (x - size / 2) * spacing;
          const posY = (y - size / 2) * spacing;
          const posZ = (z - size / 2) * spacing;
          positions.push([posX, posY, posZ]);
        }
      }
    }
    return positions;
  }, []);

  return (
    <Canvas
      flat
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 30], fov: 17.5, near: 10, far: 40 }}
    >
      <color attach="background" args={["#141622"]} />
      <Physics timeStep="vary" gravity={[0, 0, 0]}>
        <Pointer />
        <RotatingCube sphereCount={sphereCount} basePositions={cubePositions} />
        <ParticleField positionX={30} positionY={30} positionZ={30} particleCount={500} parallax={true} parallaxIntensity={0.5} />
      </Physics>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={100}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
          <Lightformer
            form="ring"
            color="#4060ff"
            intensity={80}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[10, 10, 0]}
            scale={10}
          />
        </group>
      </Environment>
    </Canvas>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ mouse, viewport }) =>
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    )
  );
  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
      {/* <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="hotpink" transparent opacity={0.6} />
      </mesh> */}
    </RigidBody>
  );
}

function Sphere({
  position,
  children,
  cubePosition,
}: {
  position?: [number, number, number];
  children?: React.ReactNode;
  cubePosition: [number, number, number];
}) {
  const api = useRef<RapierRigidBody>(null);
  const ref = useRef<THREE.Mesh>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => position || cubePosition, [position, cubePosition]);

  useFrame(() => {
    if (api.current) {
      const translation = api.current.translation();
      // Força de atração para a posição do cubo
      const cubeVec = new THREE.Vector3(
        cubePosition[0],
        cubePosition[1],
        cubePosition[2]
      );
      const toCube = vec.copy(cubeVec).sub(translation);
      const distanceToCube = toCube.length();

      // Se está longe do cubo, aplica força de atração
      if (distanceToCube > 0.1) {
        const attractionForce = toCube.normalize().multiplyScalar(0.25);
        api.current.applyImpulse(attractionForce, true);
      }
    }
  });

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos as [number, number, number]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[0.5]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial color="#4060ff" roughness={0.1} metalness={0.1} />
        {children}
      </mesh>
    </RigidBody>
  );
}

function RotatingCube({
  sphereCount,
  basePositions,
}: {
  sphereCount: number;
  basePositions: [number, number, number][];
}) {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);

  useFrame((_, delta) => {
    setRotationX((prev: number) => prev + delta * 0.3); // Rotação X mais lenta
    setRotationY((prev: number) => prev + delta * 0.5); // Rotação Y média
    setRotationZ((prev: number) => prev + delta * 0.7); // Rotação Z mais rápida
  });

  // Calcula posições rotacionadas do cubo em múltiplos eixos
  const rotatedPositions = useMemo(() => {
    return basePositions.map(([x, y, z]) => {
      // Rotação em X (eixo horizontal)
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      // Rotação em Y (eixo vertical)
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x2 = x * cosY - z1 * sinY;
      const z2 = x * sinY + z1 * cosY;

      // Rotação em Z (eixo de profundidade)
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return [x3, y3, z2] as [number, number, number];
    });
  }, [basePositions, rotationX, rotationY, rotationZ]);

  return (
    <>
      {Array.from({ length: sphereCount }, (_, i) => (
        <Sphere key={i} cubePosition={rotatedPositions[i]} />
      ))}
    </>
  );
}

export default function ThreeDCubes() {
  return (
    <Box
      sx={{
        height: "calc(100vh - var(--navbar-height))",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <ThreeDCubesScene />
    </Box>
  );
}
