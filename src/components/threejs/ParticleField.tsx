import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  positionX: number;
  positionY: number;
  positionZ: number;
  ajustY?: boolean;
  particleCount?: number;
  parallax?: boolean;
  parallaxIntensity?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  positionX,
  positionY,
  positionZ,
  ajustY = false,
  particleCount = 1000,
  parallax = false,
  parallaxIntensity = 0.5,
}) => {
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const particlesRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const themeColors = [
      "#3b82f6", // blue-500
      "#06b6d4", // cyan-500
      "#10b981", // emerald-500
      "#8b5cf6", // violet-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
      "#84cc16", // lime-500
      "#f97316", // orange-500
      "#ec4899", // pink-500
    ];

    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * positionX,
          (Math.random() - 0.5) * positionY + (ajustY ? positionY / 2 : 0),
          (Math.random() - 0.5) * positionZ,
        ] as [number, number, number],
        size: Math.random() * 0.1 + 0.05,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        originalPosition: [
          (Math.random() - 0.5) * positionX,
          (Math.random() - 0.5) * positionY + (ajustY ? positionY / 2 : 0),
          (Math.random() - 0.5) * positionZ,
        ] as [number, number, number],
      });
    }
    return temp;
  }, [positionX, positionY, positionZ, ajustY, particleCount]);

  // Efeito de parallax baseado no movimento do mouse
  useFrame(({ mouse }) => {
    if (!parallax || !particlesRef.current) return;

    // Atualiza a posição do mouse
    mouseRef.current.copy(mouse);

    // Aplica movimento de parallax a cada partícula
    particles.forEach((particle, index) => {
      if (particlesRef.current?.children[index]) {
        const mesh = particlesRef.current.children[index] as THREE.Mesh;
        const originalPos = particle.originalPosition;
        
        // Calcula o offset baseado na posição do mouse e intensidade
        const offsetX = mouseRef.current.x * parallaxIntensity * 2;
        const offsetY = mouseRef.current.y * parallaxIntensity * 2;
        
        // Aplica o offset mantendo a posição original
        mesh.position.x = originalPos[0] + offsetX;
        mesh.position.y = originalPos[1] + offsetY;
        mesh.position.z = originalPos[2];
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export default ParticleField; 