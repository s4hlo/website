import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import {
  Physics,
  RigidBody,
  BallCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import { Box, Typography, Paper } from '@mui/material';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import PlaygroundTerrain from '../components/threejs/PlaygroundTerrain';
import PhysicsConfigOverlay from '../components/threejs/PhysicsConfigOverlay';
import ThreePageContainer from '../components/threejs/ThreePageContainer';
import ParticleField from '../components/threejs/ParticleField';
import { colors } from '../theme';

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
  MOUSE_FOLLOWER_MAX_SPEED: 60,
  MOUSE_FOLLOWER_HEIGHT: 0,
  TOTAL_SPHERES: 300,
  SPHERE_MASS: 1.0,
  SPHERE_SIZE: 2,
} as const;

// ===== CONSTANTES DA CÂMERA =====
const CAMERA_CONSTRAINTS = {
  MAX_ZOOM: 80,
  MIN_ZOOM: 30,
  MAX_POLAR_ANGLE: Math.PI * 0.45, // ~153° - limita rotação para baixo
  MIN_POLAR_ANGLE: Math.PI * 0.0, // ~27° - limita rotação para cima
} as const;

const MouseFollower: React.FC<{
  size: number;
  height: number;
  showMesh: boolean;
  maxSpeed?: number;
}> = ({ size, height, showMesh, maxSpeed }) => {
  const ref = useRef<RapierRigidBody>(null);
  const currentPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(0, height, 0),
  );
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3(0, height, 0));

  useFrame(({ mouse, camera }, delta) => {
    if (ref.current) {
      // Cria um raio da câmera através do ponto do mouse
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Calcula onde o raio intersecta o plano Y = height
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -height);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Se maxSpeed não for definido, volta ao comportamento original (instantâneo)
      if (maxSpeed === undefined) {
        ref.current.setNextKinematicTranslation(intersectionPoint);
        return;
      }

      // Atualiza a posição alvo
      targetPosition.current.copy(intersectionPoint);
      targetPosition.current.y = height; // Mantém a altura fixa

      // Calcula a direção para o alvo
      const direction = targetPosition.current
        .clone()
        .sub(currentPosition.current);
      const distance = direction.length();

      // Se há distância para percorrer
      if (distance > 0.001) {
        // Calcula a velocidade máxima para este frame
        const maxDistanceThisFrame = maxSpeed * delta;

        // Se a distância é maior que o máximo permitido, limita o movimento
        if (distance > maxDistanceThisFrame) {
          direction.normalize().multiplyScalar(maxDistanceThisFrame);
        }

        // Atualiza a posição atual
        currentPosition.current.add(direction);

        // Move a bola para a nova posição
        ref.current.setNextKinematicTranslation(currentPosition.current);
      }
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
          <meshStandardMaterial color="white" transparent opacity={0.6} />
        </mesh>
      )}
    </RigidBody>
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
          metalness={0.1}
          roughness={0.8}
          emissive={color}
          emissiveIntensity={0.05}
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
    const ballsColors = Object.values(colors.playground.balls);

    const temp = [];
    for (let i = 0; i < totalSpheres; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 6, // X entre -3 e 3
          PHYSICS_CONFIG.SPHERE_SPAWN_HEIGHT,
          (Math.random() - 0.5) * 6, // Z entre -3 e 3
        ] as [number, number, number],
        color: ballsColors[Math.floor(Math.random() * ballsColors.length)],
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
        console.log('Mouse position:', x, y); // Debug
      }, 16);
    };
  }, []);

  return (
    <ThreePageContainer>
      {/* 3D Canvas */}
      <Canvas
        shadows={true}
        camera={{ position: [0, 35, 70], fov: 60 }}
        style={{
          background:
            'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', // sahlo
        }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
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
            color={colors.playground.elements.dark_blue}
          />

          {/* Fill light */}
          <directionalLight
            position={[0, -10, 0]}
            intensity={0.4}
            color={colors.playground.ui.bright_orange}
          />

          {/* Point lights for dramatic effect */}
          <pointLight
            position={[5, 5, 5]}
            intensity={0.8}
            color={colors.playground.elements.light_cyan}
            distance={25}
            decay={2}
          />

          <pointLight
            position={[-5, 3, -3]}
            intensity={0.6}
            color={colors.playground.balls[400]}
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
            maxSpeed={PHYSICS_CONFIG.MOUSE_FOLLOWER_MAX_SPEED}
          />

          {/* Terreno do playground (chão + paredes invisíveis) */}
          <PlaygroundTerrain
            floorHeight={PHYSICS_CONFIG.FLOOR_HEIGHT}
            wallHeight={PHYSICS_CONFIG.WALL_HEIGHT}
          />

          {/* Floating particles for atmosphere */}
          <ParticleField positionX={200} positionY={200} positionZ={200} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            target={[0, 10, 0]}
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
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Paper>
          <Typography
            variant="caption"
            sx={{ color: colors.playground.elements.dark_gray }}
          >
            🎾 Invisible ball follows mouse • 🖱️ Left click to rotate • 🔍
            Scroll to zoom
          </Typography>
        </Paper>
      </Box>
    </ThreePageContainer>
  );
};

export default ThreeDPlayground;
