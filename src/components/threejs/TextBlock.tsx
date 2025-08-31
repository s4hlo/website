import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { colors } from '../../theme';

interface TextBlockProps {
  position: [number, number, number]; // Posição onde será spawnado
  direction: [number, number, number]; // Direção para onde aponta (normalizada)
  text: string; // Texto a ser exibido
  size?: [number, number, number]; // Tamanho do paralelepípedo [width, height, depth]
  color?: string; // Cor do paralelepípedo
  textColor?: string; // Cor do texto
  fontSize?: number; // Tamanho da fonte
}

const TextBlock: React.FC<TextBlockProps> = ({
  position,
  direction,
  text,
  size = [2, 1, 0.5], // Padrão: 2 de largura, 1 de altura, 0.5 de profundidade
  color = colors.threeD.world.walls.primary,
  textColor = colors.threeD.world.elements.player,
  fontSize = 0.2,
}) => {
  // Calcular rotação baseada na direção
  const rotation = useMemo(() => {
    const [dirX, dirY, dirZ] = direction;

    // Calcular rotação Y (horizontal) baseada na direção X e Z
    const yRotation = Math.atan2(dirX, dirZ);

    // Calcular rotação X (vertical) baseada na direção Y
    const xRotation = Math.asin(-dirY);

    return [xRotation, yRotation, 0] as [number, number, number];
  }, [direction]);

  return (
    <group position={position} rotation={rotation}>
      {/* Paralelepípedo base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.1}
          opacity={1}
          transparent
        />
      </mesh>

      {/* Texto 3D */}
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={fontSize}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.8}
        textAlign="center"
        outlineColor={colors.threeD.world.environment.ground}
      >
        {text}
      </Text>
    </group>
  );
};

export default TextBlock;
