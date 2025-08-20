import React, { useMemo } from "react";

interface ParticleFieldProps {
  positionX: number;
  positionY: number;
  positionZ: number;
  ajustY?: boolean;
  particleCount?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  positionX,
  positionY,
  positionZ,
  ajustY = false,
  particleCount = 1000,
}) => {
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
      });
    }
    return temp;
  }, [positionX, positionY, positionZ, ajustY, particleCount]);

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

export default ParticleField; 