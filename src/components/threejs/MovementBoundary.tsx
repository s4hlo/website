import React from 'react';
import * as THREE from 'three';

interface MovementBoundaryProps {
  points: [number, number][]; // Array de pontos [x, z] que formam o polígono
  height?: number; // Altura do limite (para colisão)
  color?: string; // Cor para debug visual
  showDebug?: boolean; // Mostrar visualização do polígono
}

const MovementBoundary: React.FC<MovementBoundaryProps> = ({ 
  points, 
  height = 2,
  color = "#FF0000",
  showDebug = false
}) => {

  
  // Função para verificar se um ponto está dentro do polígono
  const isPointInsidePolygon = (point: [number, number]): boolean => {
    if (points.length < 3) return false;
    
    let inside = false;
    const [x, z] = point;
    
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, zi] = points[i];
      const [xj, zj] = points[j];
      
      if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  };

  // Função para calcular a distância até o limite mais próximo
  const getDistanceToBoundary = (point: [number, number]): { distance: number; normal: [number, number] } => {
    if (points.length < 2) return { distance: 0, normal: [0, 0] };
    
    let minDistance = Infinity;
    let closestNormal: [number, number] = [0, 0];
    
    for (let i = 0; i < points.length; i++) {
      const [x1, z1] = points[i];
      const [x2, z2] = points[(i + 1) % points.length];
      
      // Calcular distância até a linha segmento
      const A = point[0] - x1;
      const B = point[1] - z1;
      const C = x2 - x1;
      const D = z2 - z1;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;
      
      let xx, zz;
      if (param < 0) {
        xx = x1;
        zz = z1;
      } else if (param > 1) {
        xx = x2;
        zz = z2;
      } else {
        xx = x1 + param * C;
        zz = z1 + param * D;
      }
      
      const dx = point[0] - xx;
      const dz = point[1] - zz;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < minDistance) {
        minDistance = distance;
        // Calcular normal da linha (perpendicular ao segmento)
        const lineLength = Math.sqrt(C * C + D * D);
        if (lineLength > 0) {
          closestNormal = [-D / lineLength, C / lineLength];
        }
      }
    }
    
    return { distance: minDistance, normal: closestNormal };
  };

  // Criar geometria do polígono para debug visual
  const createPolygonGeometry = () => {
    if (points.length < 3) return null;
    
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // Criar triângulos a partir do polígono (triangulação simples)
    for (let i = 1; i < points.length - 1; i++) {
      // Primeiro triângulo: ponto 0, i, i+1
      positions.push(
        points[0][0], 0, points[0][1],     // Ponto 0
        points[i][0], 0, points[i][1],     // Ponto i
        points[i + 1][0], 0, points[i + 1][1] // Ponto i+1
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    
    return geometry;
  };

  // Criar objeto 3D invisível para colisão
  const collisionObject = React.useMemo(() => {
    const group = new THREE.Group();
    group.userData = {
      isMovementBoundary: true,
      boundaryData: {
        points: points,
        height: height,
        isPointInside: isPointInsidePolygon,
        getDistanceToBoundary: getDistanceToBoundary
      }
    };
    return group;
  }, [points, height, isPointInsidePolygon, getDistanceToBoundary]);

  return (
    <group>
      {/* Objeto invisível para colisão */}
      <primitive object={collisionObject} />
      
      {/* Debug visual do polígono */}
      {showDebug && createPolygonGeometry() && (
        <mesh>
          <primitive object={createPolygonGeometry()!} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Linhas de debug do perímetro */}
      {showDebug && points.length > 1 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(points.flatMap(([x, z], i) => [
                  x, 0, z,
                  points[(i + 1) % points.length][0], 0, points[(i + 1) % points.length][1]
                ])),
                3
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} />
        </lineSegments>
      )}
    </group>
  );
};

export default MovementBoundary; 