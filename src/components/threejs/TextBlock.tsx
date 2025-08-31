import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { colors } from '../../theme';

interface TextBlockProps {
  position: [number, number]; // Posição X e Z onde será spawnado (Y será fixo)
  direction: [number, number, number]; // Direção para onde aponta (normalizada)
  text: string; // Texto a ser exibido
}

const TextBlock: React.FC<TextBlockProps> = ({ position, direction, text }) => {
  // Posição fixa: X e Z do usuário, Y sempre 2 unidades acima do chão
  const finalPosition: [number, number, number] = [position[0], 2, position[1]];

  // Tamanho fixo do paralelepípedo
  const size: [number, number, number] = [4, 4, 1];

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
    <group position={finalPosition} rotation={rotation}>
      {/* Paralelepípedo base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={colors.threeD.world.walls.primary}
          roughness={0.7}
          metalness={0.1}
          opacity={1}
          transparent
        />
      </mesh>

      {/* Texto 3D */}
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.2}
        color={colors.text.primary}
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
