import React, { useCallback, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { earclip } from 'earclip';
import { colors } from '../../theme';
import ClipperLib from 'clipper-lib';

interface MovementBoundaryProps {
  points: [number, number][]; // Array de pontos [x, z] que formam o polígono
  height?: number; // Altura do limite (para colisão)
  color?: string; // Cor para debug visual
  showDebug?: boolean; // Mostrar visualização do polígono
  wallHeight?: number; // Altura das paredes
  wallColor?: string; // Cor das paredes
  showWalls?: boolean; // Mostrar paredes
}

const WALL_OFFSET = 0.8;

const MovementBoundary: React.FC<MovementBoundaryProps> = ({
  points,
  height = 2,
  color = colors.playground.physics.boundary,
  showDebug = false,
  wallHeight = 3,
  wallColor = colors.playground.elements.bright_green,
  showWalls = true,
}) => {
  // Função para validar se os pontos formam um polígono simples válido
  const validatePolygon = useCallback(
    (
      polygonPoints: [number, number][],
    ): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (polygonPoints.length < 3) {
        errors.push('Polígono deve ter pelo menos 3 pontos');
        return { isValid: false, errors };
      }

      // Verificar se há pontos duplicados consecutivos
      for (let i = 0; i < polygonPoints.length; i++) {
        const current = polygonPoints[i];
        const next = polygonPoints[(i + 1) % polygonPoints.length];

        if (current[0] === next[0] && current[1] === next[1]) {
          errors.push(
            `Pontos duplicados consecutivos na posição ${i}: [${current[0]}, ${current[1]}]`,
          );
        }
      }

      // Verificar se há linhas que se cruzam (algoritmo de detecção de interseção)
      for (let i = 0; i < polygonPoints.length; i++) {
        const [x1, z1] = polygonPoints[i];
        const [x2, z2] = polygonPoints[(i + 1) % polygonPoints.length];

        for (let j = i + 2; j < polygonPoints.length; j++) {
          const [x3, z3] = polygonPoints[j];
          const [x4, z4] = polygonPoints[(j + 1) % polygonPoints.length];

          // Pular se as linhas são consecutivas
          if (
            j === (i + 1) % polygonPoints.length ||
            i === (j + 1) % polygonPoints.length
          ) {
            continue;
          }

          // Verificar se as linhas se cruzam
          const det = (x2 - x1) * (z4 - z3) - (x4 - x3) * (z2 - z1);
          if (Math.abs(det) > 1e-10) {
            // Evitar divisão por zero
            const t = ((x1 - x3) * (z4 - z3) - (z1 - z3) * (x4 - x3)) / det;
            const u = ((x1 - x3) * (z2 - z1) - (z1 - z3) * (x2 - x1)) / det;

            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
              errors.push(
                `Linhas se cruzam: segmento ${i}-${(i + 1) % polygonPoints.length} cruza com segmento ${j}-${(j + 1) % polygonPoints.length}`,
              );
            }
          }
        }
      }

      // Verificar se o polígono tem área positiva (orientação)
      let area = 0;
      for (let i = 0; i < polygonPoints.length; i++) {
        const [x1, z1] = polygonPoints[i];
        const [x2, z2] = polygonPoints[(i + 1) % polygonPoints.length];
        area += (x2 - x1) * (z2 + z1);
      }

      if (Math.abs(area) < 1e-10) {
        errors.push('Polígono tem área zero ou muito pequena');
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [],
  );

  // Debug: mostrar informações sobre os limites
  useEffect(() => {
    if (showDebug) {
      console.log('MovementBoundary Debug Info:');
      console.log('Points:', points);
      console.log('Height:', height);
      console.log('Color:', color);

      // Validar o polígono
      const validation = validatePolygon(points);
      console.log('Polygon Validation:', validation);

      if (!validation.isValid) {
        console.error('❌ Polígono inválido:', validation.errors);
      } else {
        console.log('✅ Polígono válido!');
      }

      // Testar alguns pontos para verificar se a colisão está funcionando
      const testPoints: [number, number][] = [
        [0, 0], // Centro
        [-10, -5], // Dentro
        [25, 25], // Fora
        [-25, -25], // Vértice
        [0, -20], // Fora
      ];

      console.log('Collision Tests:');
      testPoints.forEach(point => {
        const inside = isPointInsidePolygon(point);
        const boundaryInfo = getDistanceToBoundary(point);
        console.log(
          `Point ${point}: inside=${inside}, distance=${boundaryInfo.distance.toFixed(2)}, normal=[${boundaryInfo.normal.map(n => n.toFixed(2)).join(', ')}]`,
        );
      });
    }
  }, [points, height, color, showDebug, validatePolygon]);

  // Função para verificar se um ponto está dentro do polígono
  const isPointInsidePolygon = useCallback(
    (point: [number, number]): boolean => {
      if (points.length < 3) return false;

      let inside = false;
      const [x, z] = point;

      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, zi] = points[i];
        const [xj, zj] = points[j];

        if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    },
    [points],
  );

  // Função para calcular a distância até o limite mais próximo
  const getDistanceToBoundary = useCallback(
    (
      point: [number, number],
    ): { distance: number; normal: [number, number] } => {
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
            // Normal apontando para dentro do polígono
            const crossProduct = C * B - D * A;
            if (crossProduct > 0) {
              closestNormal = [-D / lineLength, C / lineLength];
            } else {
              closestNormal = [D / lineLength, -C / lineLength];
            }
          }
        }
      }

      return { distance: minDistance, normal: closestNormal };
    },
    [points],
  );

  // Funções para usar ClipperLib para offset/extrude de polígonos
  type Pt = [number, number];

  /**
   * Offset/Extrude 2D de um polígono.
   * @param points Polígono em sentido horário/anti-horário
   * @param delta Distância do offset (positiva = para fora, negativa = para dentro)
   */
  const offsetPolygon = useCallback((points: Pt[], delta: number): Pt[][] => {
    // O Clipper trabalha melhor com inteiros; escale e depois des-escale
    const SCALE = 1000;

    // Remova duplicata final, se houver
    const cleaned = ((): Pt[] => {
      if (points.length > 1) {
        const [x0, y0] = points[0];
        const [xn, yn] = points[points.length - 1];
        if (x0 === xn && y0 === yn) return points.slice(0, -1);
      }
      return points.slice();
    })();

    // Escala
    const path = cleaned.map(([x, y]) => ({
      X: Math.round(x * SCALE),
      Y: Math.round(y * SCALE),
    }));

    const co = new (ClipperLib as any).ClipperOffset(2, 0.25 * SCALE);
    co.AddPath(
      path,
      (ClipperLib as any).JoinType.jtMiter,
      (ClipperLib as any).EndType.etClosedPolygon,
    );

    const solutionPaths: { X: number; Y: number }[][] = [];
    co.Execute(solutionPaths, delta * SCALE);

    // Pode haver múltiplos polígonos
    const result: Pt[][] = solutionPaths.map(sp =>
      sp.map(p => [p.X / SCALE, p.Y / SCALE] as Pt),
    );

    return result;
  }, []);

  // Função para usar a biblioteca earclip para triangulação
  const triangulateWithEarclip = useCallback(
    (polygon: [number, number][]): number[] => {
      if (polygon.length < 3) return [];

      try {
        // Converter pontos para o formato esperado pela biblioteca earclip
        // A biblioteca espera um array de arrays: [[x1, z1], [x2, z2], ...]
        const polygonForEarclip = polygon.map(([x, z]) => [x, z]);

        // Usar a biblioteca earclip para triangulação
        const result = earclip([polygonForEarclip]);

        if (result && result.indices && result.indices.length > 0) {
          console.log(
            `✅ Earclip triangulou ${result.indices.length / 3} triângulos`,
          );

          // Converter índices para coordenadas usando os vértices
          const triangles: number[] = [];
          for (let i = 0; i < result.indices.length; i += 3) {
            const i1 = result.indices[i] * 2;
            const i2 = result.indices[i + 1] * 2;
            const i3 = result.indices[i + 2] * 2;

            triangles.push(
              result.vertices[i1],
              result.vertices[i1 + 1], // x1, z1
              result.vertices[i2],
              result.vertices[i2 + 1], // x2, z2
              result.vertices[i3],
              result.vertices[i3 + 1], // x3, z3
            );
          }

          return triangles;
        } else {
          console.warn('⚠️ Earclip retornou resultado vazio');
          return [];
        }
      } catch (error) {
        console.error('❌ Erro na triangulação com earclip:', error);
        return [];
      }
    },
    [],
  );

  // Criar geometria do polígono para debug visual (área preenchida)
  const polygonGeometry = useMemo(() => {
    if (points.length < 3) return null;

    const geometry = new THREE.BufferGeometry();

    // Usar a biblioteca earclip para triangulação
    const triangulatedPoints = triangulateWithEarclip(points);

    if (triangulatedPoints.length === 0) {
      console.warn('Falha na triangulação, usando método de fallback');
      // Fallback: triangulação simples a partir do centro
      const centerX = points.reduce((sum, p) => sum + p[0], 0) / points.length;
      const centerZ = points.reduce((sum, p) => sum + p[1], 0) / points.length;

      const positions: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [x1, z1] = points[i];
        const [x2, z2] = points[(i + 1) % points.length];

        positions.push(centerX, 0, centerZ, x1, 0, z1, x2, 0, z2);
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3),
      );
    } else {
      // Converter pontos 2D para posições 3D
      const positions: number[] = [];
      for (let i = 0; i < triangulatedPoints.length; i += 6) {
        positions.push(
          triangulatedPoints[i],
          0,
          triangulatedPoints[i + 1], // x1, z1
          triangulatedPoints[i + 2],
          0,
          triangulatedPoints[i + 3], // x2, z2
          triangulatedPoints[i + 4],
          0,
          triangulatedPoints[i + 5], // x3, z3
        );
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3),
      );
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [points, triangulateWithEarclip]);

  // Criar geometria das linhas de contorno para debug visual
  const perimeterGeometry = useMemo(() => {
    if (points.length < 2) return null;

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Criar linhas conectando todos os pontos do polígono
    for (let i = 0; i < points.length; i++) {
      const [x1, z1] = points[i];
      const [x2, z2] = points[(i + 1) % points.length];

      positions.push(
        x1,
        0,
        z1, // Ponto atual
        x2,
        0,
        z2, // Próximo ponto
      );
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );

    return geometry;
  }, [points]);

  // Criar geometria dos pontos de vértice para debug visual
  const vertexGeometry = useMemo(() => {
    if (points.length === 0) return null;

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Criar pontos para cada vértice do polígono
    for (const [x, z] of points) {
      positions.push(x, 0, z);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );

    return geometry;
  }, [points]);

  // Criar geometria das paredes ao longo das arestas do boundary
  const wallsGeometry = useMemo(() => {
    if (points.length < 2 || !showWalls) return null;

    // Por enquanto, vamos apenas testar o polígono expandido
    // TODO: Implementar paredes quando o extrude estiver funcionando
    return null;
  }, [points, showWalls, wallHeight]);

  // Criar objeto 3D invisível para colisão
  const collisionObject = useMemo(() => {
    const group = new THREE.Group();
    group.userData = {
      isMovementBoundary: true,
      boundaryData: {
        points: points,
        height: height,
        isPointInside: isPointInsidePolygon,
        getDistanceToBoundary: getDistanceToBoundary,
      },
    };
    return group;
  }, [points, height, isPointInsidePolygon, getDistanceToBoundary]);

  return (
    <group>
      {/* Objeto invisível para colisão */}
      <primitive object={collisionObject} />

      {/* Debug visual do polígono - área preenchida */}
      {showDebug && polygonGeometry && (
        <mesh>
          <primitive object={polygonGeometry} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Debug visual das arestas do polígono expandido */}
      {showDebug &&
        (() => {
          const expandedPolygons = offsetPolygon(points, WALL_OFFSET);
          if (expandedPolygons.length === 0) return null;

          const expandedPoints = expandedPolygons[0];
          const positions: number[] = [];

          // Criar linhas conectando os pontos do polígono expandido
          for (let i = 0; i < expandedPoints.length; i++) {
            const [x1, z1] = expandedPoints[i];
            const [x2, z2] = expandedPoints[(i + 1) % expandedPoints.length];

            positions.push(x1, 0, z1, x2, 0, z2);
          }

          return (
            <lineSegments>
              <primitive
                object={new THREE.BufferGeometry().setAttribute(
                  'position',
                  new THREE.Float32BufferAttribute(positions, 3),
                )}
              />
              <lineBasicMaterial
                color={colors.playground.physics.boundary}
                linewidth={3}
              />
            </lineSegments>
          );
        })()}

      {/* Debug visual das linhas de contorno */}
      {showDebug && perimeterGeometry && (
        <lineSegments>
          <primitive object={perimeterGeometry} />
          <lineBasicMaterial color={color} linewidth={3} />
        </lineSegments>
      )}

      {/* Debug visual dos vértices */}
      {showDebug && vertexGeometry && (
        <points>
          <primitive object={vertexGeometry} />
          <pointsMaterial color={color} size={0.8} sizeAttenuation={false} />
        </points>
      )}

      {/* Debug visual do centro do polígono */}
      {showDebug && points.length > 0 && (
        <mesh
          position={[
            points.reduce((sum, p) => sum + p[0], 0) / points.length,
            0.1,
            points.reduce((sum, p) => sum + p[1], 0) / points.length,
          ]}
        >
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshBasicMaterial color={colors.playground.physics.boundary} />
        </mesh>
      )}

      {/* Paredes ao longo das arestas do boundary */}
      {showWalls && wallsGeometry && (
        <mesh>
          <primitive object={wallsGeometry} />
          <meshStandardMaterial
            color={wallColor}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

export default MovementBoundary;
