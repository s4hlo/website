import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Physics, RigidBody, BallCollider, RapierRigidBody } from "@react-three/rapier";
import { Box, Typography, Paper } from "@mui/material";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// ===== CONSTANTES DE FÍSICA =====
const PHYSICS_CONFIG = {
  // Força de atração para o centro (0 = sem atração, 1 = atração forte)
  CENTER_ATTRACTION_FORCE: 0.02,
  
  // Bounceness das esferas (0 = sem quicar, 1 = quicar muito)
  SPHERE_BOUNCENESS: 0.8,
  
  // Altura fixa das esferas (Y)
  SPHERE_HEIGHT: 5,
  
  // Altura do chão
  FLOOR_HEIGHT: -5,
  
  // Altura do MouseFollower (1 unidade acima do chão)
  MOUSE_FOLLOWER_HEIGHT: -4,
} as const;

const MouseFollower: React.FC = () => {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ mouse, camera }) => {
    if (ref.current) {
      // Cria um raio da câmera através do ponto do mouse
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Calcula onde o raio intersecta o plano Y = MOUSE_FOLLOWER_HEIGHT (1 unidade acima do chão)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -PHYSICS_CONFIG.MOUSE_FOLLOWER_HEIGHT);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      // Move a bola para a posição calculada
      ref.current.setNextKinematicTranslation(intersectionPoint);
    }
  });

  const size = 0.5;

  return (
          <RigidBody
        position={[0, PHYSICS_CONFIG.MOUSE_FOLLOWER_HEIGHT, 0]}
        type="kinematicPosition"
        colliders={false}
        ref={ref}
      >
      <BallCollider args={[size]} />
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color="hotpink" transparent opacity={0.6} />
      </mesh>
    </RigidBody>
  );
};

const ParticleField: React.FC = () => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
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
}> = ({ position, color, size }) => {
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
      const force = direction.multiplyScalar(PHYSICS_CONFIG.CENTER_ATTRACTION_FORCE); // Força configurável para o centro
      api.current.applyImpulse(force, true);
    }
  });

      return (
      <RigidBody
        linearDamping={2}
        angularDamping={0.5}
        friction={0.3}
        restitution={PHYSICS_CONFIG.SPHERE_BOUNCENESS}
        position={position}
        ref={api}
        colliders={false}
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

const PhysicsSpheres: React.FC = () => {
  const spheres = useMemo(
    () => [
      { position: [-3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#3b82f6" },
      { position: [3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#ec4899" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, -3] as [number, number, number], color: "#f59e0b" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, 3] as [number, number, number], color: "#8b5cf6" },
      { position: [-2, PHYSICS_CONFIG.SPHERE_HEIGHT, -2] as [number, number, number], color: "#10b981" },
      { position: [2, PHYSICS_CONFIG.SPHERE_HEIGHT, 2] as [number, number, number], color: "#ef4444" },
      { position: [-1, PHYSICS_CONFIG.SPHERE_HEIGHT, 1] as [number, number, number], color: "#06b6d4" },
      { position: [1, PHYSICS_CONFIG.SPHERE_HEIGHT, -1] as [number, number, number], color: "#f97316" },
      { position: [-3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#3b82f6" },
      { position: [3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#ec4899" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, -3] as [number, number, number], color: "#f59e0b" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, 3] as [number, number, number], color: "#8b5cf6" },
      { position: [-2, PHYSICS_CONFIG.SPHERE_HEIGHT, -2] as [number, number, number], color: "#10b981" },
      { position: [2, PHYSICS_CONFIG.SPHERE_HEIGHT, 2] as [number, number, number], color: "#ef4444" },
      { position: [-1, PHYSICS_CONFIG.SPHERE_HEIGHT, 1] as [number, number, number], color: "#06b6d4" },
      { position: [1, PHYSICS_CONFIG.SPHERE_HEIGHT, -1] as [number, number, number], color: "#f97316" },
      { position: [-3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#3b82f6" },
      { position: [3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#ec4899" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, -3] as [number, number, number], color: "#f59e0b" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, 3] as [number, number, number], color: "#8b5cf6" },
      { position: [-2, PHYSICS_CONFIG.SPHERE_HEIGHT, -2] as [number, number, number], color: "#10b981" },
      { position: [2, PHYSICS_CONFIG.SPHERE_HEIGHT, 2] as [number, number, number], color: "#ef4444" },
      { position: [-1, PHYSICS_CONFIG.SPHERE_HEIGHT, 1] as [number, number, number], color: "#06b6d4" },
      { position: [1, PHYSICS_CONFIG.SPHERE_HEIGHT, -1] as [number, number, number], color: "#f97316" },
      { position: [-3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#3b82f6" },
      { position: [3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#ec4899" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, -3] as [number, number, number], color: "#f59e0b" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, 3] as [number, number, number], color: "#8b5cf6" },
      { position: [-2, PHYSICS_CONFIG.SPHERE_HEIGHT, -2] as [number, number, number], color: "#10b981" },
      { position: [2, PHYSICS_CONFIG.SPHERE_HEIGHT, 2] as [number, number, number], color: "#ef4444" },
      { position: [-1, PHYSICS_CONFIG.SPHERE_HEIGHT, 1] as [number, number, number], color: "#06b6d4" },
      { position: [1, PHYSICS_CONFIG.SPHERE_HEIGHT, -1] as [number, number, number], color: "#f97316" },
      { position: [-3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#3b82f6" },
      { position: [3, PHYSICS_CONFIG.SPHERE_HEIGHT, 0] as [number, number, number], color: "#ec4899" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, -3] as [number, number, number], color: "#f59e0b" },
      { position: [0, PHYSICS_CONFIG.SPHERE_HEIGHT, 3] as [number, number, number], color: "#8b5cf6" },
      { position: [-2, PHYSICS_CONFIG.SPHERE_HEIGHT, -2] as [number, number, number], color: "#10b981" },
      { position: [2, PHYSICS_CONFIG.SPHERE_HEIGHT, 2] as [number, number, number], color: "#ef4444" },
      { position: [-1, PHYSICS_CONFIG.SPHERE_HEIGHT, 1] as [number, number, number], color: "#06b6d4" },
      { position: [1, PHYSICS_CONFIG.SPHERE_HEIGHT, -1] as [number, number, number], color: "#f97316" },

    ],
    []
  );

  return (
    <group>
      {spheres.map((sphere, index) => (
        <Sphere
          key={index}
          position={sphere.position}
          color={sphere.color}
          size={1}
        />
      ))}
    </group>
  );
};

const ThreeDPlayground: React.FC = () => {
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

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

  // Função para alternar o modo da câmera
  const toggleCameraMode = () => {
    const newMode = !translationEnabled;
    setTranslationEnabled(newMode);

    // Se está bloqueando, força a câmera a olhar para o centro
    if (!newMode && orbitControlsRef.current) {
      // Mantém a posição da câmera, mas faz ela olhar para o centro
      orbitControlsRef.current.target.set(0, 0, 0);
      // Não reseta a posição da câmera, apenas o target
      orbitControlsRef.current.update();
    }
  };

  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* 3D Canvas */}
      <Canvas
        shadows={true}
        camera={{ position: [0, 10, 15], fov: 50 }}
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
        <Physics gravity={[0, -9.81, 0]} debug={false}>
          <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />

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
          <PhysicsSpheres />

          {/* Bola invisível que segue o mouse */}
          <MouseFollower />

          {/* Chão elegante */}
          <RigidBody type="fixed" position={[0, -5, 0]} colliders="cuboid">
            <mesh receiveShadow>
              <boxGeometry args={[40, 1, 40]} />
              <meshStandardMaterial
                color="#0f172a"
                transparent
                opacity={0.95}
                metalness={0.3}
                roughness={0.6}
              />
            </mesh>
          </RigidBody>

          {/* Floating particles for atmosphere */}
          <ParticleField />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={translationEnabled}
            enableZoom={translationEnabled}
            enableRotate={true}
            autoRotate={false}
            target={[0, 0, 0]}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={1}
            zoomSpeed={1}
            panSpeed={1}
          />
        </Physics>
      </Canvas>

      {/* Camera Controls Toggle */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Paper
          sx={{
            p: 2,
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#f8fafc" }}>
              📷 Camera Controls
            </Typography>
            <Box
              component="button"
              onClick={toggleCameraMode}
              sx={{
                px: 2,
                py: 1,
                bgcolor: translationEnabled
                  ? "rgba(34, 197, 94, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                color: translationEnabled ? "#22c55e" : "#ef4444",
                border: `1px solid ${
                  translationEnabled
                    ? "rgba(34, 197, 94, 0.4)"
                    : "rgba(239, 68, 68, 0.4)"
                }`,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: translationEnabled
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(239, 68, 68, 0.3)",
                },
              }}
            >
              {translationEnabled ? "🔄 Free" : "🎯 Locked"}
            </Box>
          </Box>
        </Paper>
      </Box>

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
