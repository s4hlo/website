import * as THREE from "three";
import { useRef, useMemo } from "react";
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
          // Ajusta para que a esfera central (índices 2,2,2) fique exatamente em (0,0,0)
          const posX = (x - 2) * spacing;
          const posY = (y - 2) * spacing;
          const posZ = (z - 2) * spacing;
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
      
      {/* Componente que controla a câmera */}
      <CameraController />
      
      <Physics timeStep="vary" gravity={[0, 0, 0]}>
        <Pointer />
        <StaticCube sphereCount={sphereCount} basePositions={cubePositions} />
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

function Pointer() {
  const ref = useRef<RapierRigidBody>(null);
  
  useFrame(({ mouse, camera }) => {
    if (ref.current) {
      // Cria um raio do mouse para o mundo 3D
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      
      // Define um plano a uma distância fixa da câmera
      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(new THREE.Vector3()),
        camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(30))
      );
      
      // Encontra a interseção do raio com o plano
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      
      // Aplica a posição 3D ao pointer
      ref.current.setNextKinematicTranslation(intersectionPoint);
    }
  });
  
  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="hotpink" transparent opacity={0.6} />
      </mesh>
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

function StaticCube({
  sphereCount,
  basePositions,
}: {
  sphereCount: number;
  basePositions: [number, number, number][];
}) {
  return (
    <>
      {Array.from({ length: sphereCount }, (_, i) => (
        <Sphere key={i} cubePosition={basePositions[i]} />
      ))}
    </>
  );
}

function CameraController() {
  useFrame(({ camera }) => {
    const time = Date.now() * 0.001;
    const radius = 30;
    const speed = 0.3;
    
    // Órbita em X e Y
    const x = Math.sin(time * speed) * radius;
    const y = Math.sin(time * speed * 0.7) * (radius * 0.3);
    const z = Math.cos(time * speed) * radius;
    
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
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
