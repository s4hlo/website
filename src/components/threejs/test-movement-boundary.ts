// Teste das funções do MovementBoundary
// Este arquivo pode ser executado com Node.js para testar a lógica

interface Point2D {
  x: number;
  z: number;
}

interface MovementBoundaryTest {
  points: [number, number][];
  testPoints: Point2D[];
  expectedResults: boolean[];
}

// Função para verificar se um ponto está dentro do polígono
function isPointInsidePolygon(point: [number, number], polygon: [number, number][]): boolean {
  if (polygon.length < 3) return false;
  
  let inside = false;
  const [x, z] = point;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, zi] = polygon[i];
    const [xj, zj] = polygon[j];
    
    if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Função para calcular a distância até o limite mais próximo
function getDistanceToBoundary(point: [number, number], polygon: [number, number][]): { distance: number; normal: [number, number] } {
  if (polygon.length < 2) return { distance: 0, normal: [0, 0] };
  
  let minDistance = Infinity;
  let closestNormal: [number, number] = [0, 0];
  
  for (let i = 0; i < polygon.length; i++) {
    const [x1, z1] = polygon[i];
    const [x2, z2] = polygon[(i + 1) % polygon.length];
    
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
}

// Testes
const tests: MovementBoundaryTest[] = [
  {
    points: [[-5, -5], [5, -5], [5, 5], [-5, 5]], // Quadrado
    testPoints: [
      { x: 0, z: 0 },    // Dentro
      { x: 6, z: 0 },    // Fora (direita)
      { x: 0, z: 6 },    // Fora (cima)
      { x: -6, z: 0 },   // Fora (esquerda)
      { x: 0, z: -6 },   // Fora (baixo)
      { x: 5, z: 5 }     // Borda
    ],
    expectedResults: [true, false, false, false, false, true]
  },
  {
    points: [[0, 0], [3, 0], [1.5, 3]], // Triângulo
    testPoints: [
      { x: 1.5, z: 1 },  // Dentro
      { x: 0, z: 0 },    // Vértice
      { x: 4, z: 0 },    // Fora
      { x: 1.5, z: 4 }   // Fora
    ],
    expectedResults: [true, true, false, false]
  }
];

// Executar testes
console.log("🧪 Testando MovementBoundary...\n");

tests.forEach((test, testIndex) => {
  console.log(`Teste ${testIndex + 1}: Polígono com ${test.points.length} pontos`);
  console.log(`Pontos: ${JSON.stringify(test.points)}\n`);
  
  test.testPoints.forEach((point, pointIndex) => {
    const point2D: [number, number] = [point.x, point.z];
    const isInside = isPointInsidePolygon(point2D, test.points);
    const distanceInfo = getDistanceToBoundary(point2D, test.points);
    const expected = test.expectedResults[pointIndex];
    
    console.log(`  Ponto ${pointIndex + 1}: (${point.x}, ${point.z})`);
    console.log(`    Está dentro: ${isInside} (esperado: ${expected})`);
    console.log(`    Distância até limite: ${distanceInfo.distance.toFixed(3)}`);
    console.log(`    Normal: [${distanceInfo.normal[0].toFixed(3)}, ${distanceInfo.normal[1].toFixed(3)}]`);
    console.log(`    ✅ ${isInside === expected ? 'PASSOU' : 'FALHOU'}\n`);
  });
  
  console.log("---\n");
});

console.log("🎯 Testes concluídos!"); 