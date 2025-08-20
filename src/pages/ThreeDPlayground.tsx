import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import {
  Physics,
  RigidBody,
  BallCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { Box, Typography, Paper } from "@mui/material";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import PlaygroundTerrain from "../components/threejs/PlaygroundTerrain";
import PhysicsConfigOverlay from "../components/threejs/PhysicsConfigOverlay";

// ===== TIPOS PARA O OVERLAY =====
interface PhysicsConfigState {
  mouse_follower_size: number;
  center_attraction_force: number;
  sphere_bounceness: number;
}

// ===== CONSTANTES DE FÍSICA =====
const PHYSICS_CONFIG = {
  CENTER_ATTRACTION_FORCE: 0.02,
  SPHERE_BOUNCENESS: 0.8,
  SPHERE_SPAWN_HEIGHT: 20,
  FLOOR_HEIGHT: 0,
  WALL_HEIGHT: 30,
  GRAVITY: 10,
  MOUSE_FOLLOWER_SIZE: 1.5,
  MOUSE_FOLLOWER_HEIGHT: 0,
  TOTAL_SPHERES: 300,
  SPHERE_MASS: 5.0, // Peso das bolas (padrão: 2.0)
  SPHERE_SIZE: 2,
} as const;

// ===== CONSTANTES DA CÂMERA =====
const CAMERA_CONSTRAINTS = {
  MAX_ZOOM: 80,
  MIN_ZOOM: 30,
  MAX_POLAR_ANGLE: Math.PI * 0.45, // ~153° - limita rotação para baixo
  MIN_POLAR_ANGLE: Math.PI * 0.00, // ~27° - limita rotação para cima
} as const;

const MouseFollower: React.FC<{
  size: number;
  height: number;
  showMesh: boolean;
}> = ({ size, height, showMesh }) => {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ mouse, camera }) => {
    if (ref.current) {
      // Cria um raio da câmera através do ponto do mouse
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Calcula onde o raio intersecta o plano Y = height
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -height);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Move a bola para a posição calculada
      ref.current.setNextKinematicTranslation(intersectionPoint);
    }
  });

  return (
    <RigidBody
      position={[0, height, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[size]} />
      {showMesh && (
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0.6} />
        </mesh>
      )}
    </RigidBody>
  );
};

const ParticleField = ({
  positionX,
  positionY,
  positionZ,
}: {
  positionX: number;
  positionY: number;
  positionZ: number;
}) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 500; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * positionX,
          (Math.random() - 0.5) * positionY + positionY / 2,
          (Math.random() - 0.5) * positionZ,
        ] as [number, number, number],
        size: Math.random() * 0.1 + 0.05,
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const Sphere: React.FC<{
  position: [number, number, number];
  color: string;
  size: number;
  bounceness: number;
  centerAttractionForce: number;
}> = ({ position, color, size, bounceness, centerAttractionForce }) => {
  const api = useRef<RapierRigidBody>(null);
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (api.current) {
      // Aplica atração sutil para o centro - muito leve para não interferir na gravidade Y
      const currentPos = api.current.translation();
      const center = new THREE.Vector3(0, currentPos.y, 0); // Mantém Y atual para não interferir na gravidade
      const direction = center
        .sub(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z))
        .normalize();
      const force = direction.multiplyScalar(centerAttractionForce); // Força configurável para o centro
      api.current.applyImpulse(force, true);
    }
  });

  return (
    <RigidBody
      linearDamping={2}
      angularDamping={0.5}
      friction={0.3}
      restitution={bounceness}
      position={position}
      ref={api}
      colliders={false}
      mass={PHYSICS_CONFIG.SPHERE_MASS}
    >
      <BallCollider args={[size * 0.5]} />
      <mesh ref={ref} scale={size} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </RigidBody>
  );
};

const PhysicsSpheres: React.FC<{
  totalSpheres: number;
  bounceness: number;
  centerAttractionForce: number;
}> = ({ totalSpheres, bounceness, centerAttractionForce }) => {
  const spheres = useMemo(() => {
    const colors = [
      "#3b82f6",
      "#ec4899",
      "#f59e0b",
      "#8b5cf6",
      "#10b981",
      "#ef4444",
      "#06b6d4",
      "#f97316",
    ];

    const temp = [];
    for (let i = 0; i < totalSpheres; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 6, // X entre -3 e 3
          PHYSICS_CONFIG.SPHERE_SPAWN_HEIGHT,
          (Math.random() - 0.5) * 6, // Z entre -3 e 3
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return temp;
  }, [totalSpheres]);

  return (
    <group>
      {spheres.map((sphere, index) => (
        <Sphere
          key={index}
          position={sphere.position}
          color={sphere.color}
          size={PHYSICS_CONFIG.SPHERE_SIZE}
          bounceness={bounceness}
          centerAttractionForce={centerAttractionForce}
        />
      ))}
    </group>
  );
};

const ThreeDPlayground: React.FC = () => {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  // Estado para as configurações de física
  const [physicsConfig, setPhysicsConfig] = useState<PhysicsConfigState>({
    mouse_follower_size: PHYSICS_CONFIG.MOUSE_FOLLOWER_SIZE,
    center_attraction_force: PHYSICS_CONFIG.CENTER_ATTRACTION_FORCE,
    sphere_bounceness: PHYSICS_CONFIG.SPHERE_BOUNCENESS,
  });

  // Estado local para as mudanças (sem aplicar ainda)
  const [localConfig, setLocalConfig] =
    useState<PhysicsConfigState>(physicsConfig);

  // Função para aplicar mudanças individuais
  const handleApplyConfig = (key: keyof PhysicsConfigState, value: number) => {
    const newConfig = { ...physicsConfig, [key]: value };
    setPhysicsConfig(newConfig);
    setLocalConfig(newConfig);
  };

  // Throttle do mouse move para melhorar performance
  const handleMouseMove = useMemo(() => {
    let timeoutId: number;

    return (event: React.MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        console.log("Mouse position:", x, y); // Debug
      }, 16);
    };
  }, []);



  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* 3D Canvas */}
      <Canvas
        shadows={true}
        camera={{ position: [0, 35, 70], fov: 60 }}
        style={{
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
        onMouseMove={handleMouseMove}
      >
        <Physics gravity={[0, -PHYSICS_CONFIG.GRAVITY, 0]} debug={false}>
          {/* Depth of Field effect */}
          <EffectComposer>
            <DepthOfField
              focusDistance={0}
              focalLength={0.2}
              bokehScale={2}
              height={480}
            />
          </EffectComposer>

          {/* Main directional light */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Rim lighting for depth */}
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.6}
            color="#4f46e5"
          />

          {/* Fill light */}
          <directionalLight
            position={[0, -10, 0]}
            intensity={0.4}
            color="#f59e0b"
          />

          {/* Point lights for dramatic effect */}
          <pointLight
            position={[5, 5, 5]}
            intensity={0.8}
            color="#22d3ee"
            distance={25}
            decay={2}
          />

          <pointLight
            position={[-5, 3, -3]}
            intensity={0.6}
            color="#8b5cf6"
            distance={20}
            decay={1.5}
          />

          {/* Esferas com física */}
          <PhysicsSpheres
            key={PHYSICS_CONFIG.TOTAL_SPHERES}
            totalSpheres={PHYSICS_CONFIG.TOTAL_SPHERES}
            bounceness={physicsConfig.sphere_bounceness}
            centerAttractionForce={physicsConfig.center_attraction_force}
          />

          {/* Bola invisível que segue o mouse */}
          <MouseFollower
            size={physicsConfig.mouse_follower_size}
            height={PHYSICS_CONFIG.MOUSE_FOLLOWER_HEIGHT}
            showMesh
          />

          {/* Terreno do playground (chão + paredes invisíveis) */}
          <PlaygroundTerrain
            floorHeight={PHYSICS_CONFIG.FLOOR_HEIGHT}
            wallHeight={PHYSICS_CONFIG.WALL_HEIGHT}
          />

          {/* Floating particles for atmosphere */}
          <ParticleField
            positionX={40}
            positionY={PHYSICS_CONFIG.WALL_HEIGHT}
            positionZ={40}
          />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            target={[0, 0, 0]}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={1}
            zoomSpeed={1}
            panSpeed={1}
            maxDistance={CAMERA_CONSTRAINTS.MAX_ZOOM}
            minDistance={CAMERA_CONSTRAINTS.MIN_ZOOM}
            maxPolarAngle={CAMERA_CONSTRAINTS.MAX_POLAR_ANGLE}
            minPolarAngle={CAMERA_CONSTRAINTS.MIN_POLAR_ANGLE}
          />
        </Physics>
      </Canvas>

      {/* Physics Configuration Overlay */}
      <PhysicsConfigOverlay
        config={localConfig}
        onConfigChange={setLocalConfig}
        onApply={handleApplyConfig}
      />

      {/* Instructions */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Paper
          sx={{
            p: 2,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            🎾 Invisible ball follows mouse • 🖱️ Move mouse for parallax • 🔍
            Scroll to zoom • 🌍 Physics enabled
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ThreeDPlayground;
