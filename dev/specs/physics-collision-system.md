# Sistema de Física e Colisões - Three.js 3D World

## Visão Geral

Este documento especifica a implementação de um sistema robusto de física e colisões para o mundo 3D, permitindo que o player interaja realisticamente com obstáculos, plataformas e o ambiente.

## Objetivos

- **Colisões precisas** durante movimento horizontal (WASD)
- **Colisões no ar** durante pulos e queda
- **Posicionamento preciso** em cima de plataformas
- **Física realista** para movimento e colisões
- **Performance otimizada** para jogos em tempo real

## Análise de Soluções Disponíveis

### 1. Three.js Built-in (Nativo)
- **Raycasting**: Detecção de colisão com raios
- **BoundingBox**: Caixas de colisão simples
- **BoundingSphere**: Esferas de colisão
- **Pros**: Leve, integrado, sem dependências externas
- **Contras**: Física básica, colisões simples

### 2. Cannon.js (Recomendado)
- **Descrição**: Motor de física 3D completo
- **Recursos**: 
  - Corpos rígidos e soft bodies
  - Colisões precisas
  - Gravidade e forças
  - Constraints e joints
- **Pros**: Física realista, bem testado, documentação boa
- **Contras**: Bundle size maior, complexidade adicional

### 3. Ammo.js
- **Descrição**: Port do Bullet Physics para Web
- **Recursos**: Física AAA, muito robusto
- **Pros**: Física de console/PC
- **Contras**: Bundle muito grande, complexo demais para nosso caso

### 4. Rapier.js
- **Descrição**: Motor de física moderno em Rust/WASM
- **Recursos**: Performance excelente, física realista
- **Pros**: Muito rápido, moderno
- **Contras**: Menos maduro, documentação limitada

## Solução Recomendada: Cannon.js

### Justificativa
- **Equilíbrio perfeito** entre funcionalidade e complexidade
- **Integração nativa** com Three.js
- **Performance adequada** para jogos em tempo real
- **Comunidade ativa** e bem documentado
- **Bundle size aceitável** (~200KB gzipped)

## Arquitetura do Sistema

### 1. Estrutura de Componentes

```
PhysicsWorld (Cannon.js)
├── Ground Body (Plano estático)
├── Player Body (Capsule dinâmico)
├── Obstacle Bodies (Caixas estáticas)
└── Platform Bodies (Plataformas estáticas)
```

### 2. Integração com Three.js

```
Three.js Scene
├── Visual Meshes (renderização)
├── Physics Bodies (física)
└── Sync System (sincronização)
```

## Especificação Técnica

### 1. Corpo do Player

#### Propriedades Físicas
- **Tipo**: `CANNON.Body` (capsule)
- **Massa**: 70kg (realista)
- **Forma**: Capsule com raio 0.5m e altura 1.8m
- **Fricção**: 0.3 (superfície normal)
- **Restituição**: 0.1 (pouco bounce)

#### Estados de Movimento
- **Idle**: Sem movimento, física ativa
- **Walking**: Movimento horizontal com colisões
- **Jumping**: Movimento vertical com colisões no ar
- **Falling**: Gravidade aplicada, colisões ativas

### 2. Sistema de Colisões

#### Colisões Horizontais (WASD)
```typescript
// Detectar colisão antes de aplicar movimento
const rayStart = player.position;
const rayEnd = rayStart + movementVector;
const hit = physicsWorld.raycast(rayStart, rayEnd);

if (hit) {
  // Ajustar movimento para não atravessar
  movementVector = hit.point - rayStart;
}
```

#### Colisões Verticais (Pulo/Queda)
```typescript
// Verificar colisão abaixo do player
const groundRay = new CANNON.Ray();
groundRay.from = player.position;
groundRay.to = player.position - [0, 1.1, 0]; // 10cm abaixo dos pés

const groundHit = physicsWorld.raycast(groundRay);
if (groundHit) {
  // Player está no chão
  isOnGround = true;
  velocity.y = 0;
}
```

#### Colisões no Ar
```typescript
// Verificar colisões em todas as direções durante movimento
const collisionRays = [
  [1, 0, 0], [-1, 0, 0],  // Frente/Trás
  [0, 0, 1], [0, 0, -1],  // Esquerda/Direita
  [0, 1, 0], [0, -1, 0]   // Cima/Baixo
];

collisionRays.forEach(direction => {
  const hit = physicsWorld.raycast(player.position, direction);
  if (hit) {
    // Ajustar movimento baseado na colisão
    handleCollision(hit, direction);
  }
});
```

### 3. Obstáculos e Plataformas

#### Tipos de Objetos
1. **Obstáculos Sólidos**
   - Caixas, paredes, árvores
   - Bloqueiam movimento completamente
   - Colisão precisa com bounding boxes

2. **Plataformas**
   - Superfícies para subir
   - Colisão apenas de cima
   - Permitem movimento horizontal

3. **Obstáculos Semi-Sólidos**
   - Arbustos, cercas baixas
   - Podem ser atravessados a pé
   - Colisão apenas durante pulo

#### Implementação de Colisões
```typescript
interface CollisionObject {
  mesh: THREE.Mesh;           // Visual
  body: CANNON.Body;          // Física
  type: 'solid' | 'platform' | 'semi-solid';
  properties: {
    height: number;            // Altura para colisão
    friction: number;          // Fricção da superfície
    bounciness: number;        // Elasticidade
  };
}
```

### 4. Sistema de Física

#### Configuração do Mundo
```typescript
const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);  // Gravidade realista
physicsWorld.broadphase = new CANNON.SAPBroadphase();  // Otimização
physicsWorld.allowSleep = true;  // Dormir corpos estáticos
```

#### Loop de Física
```typescript
const timeStep = 1/60;  // 60 FPS
const maxSubSteps = 3;  // Sub-steps para estabilidade

useFrame((state, delta) => {
  // Atualizar física
  physicsWorld.step(timeStep, delta, maxSubSteps);
  
  // Sincronizar posições
  syncPhysicsWithVisuals();
  
  // Aplicar controles do player
  handlePlayerInput();
});
```

### 5. Sincronização Visual-Física

#### Sistema de Sincronização
```typescript
function syncPhysicsWithVisuals() {
  // Player
  playerMesh.position.copy(playerBody.position);
  playerMesh.quaternion.copy(playerBody.quaternion);
  
  // Obstáculos (se dinâmicos)
  obstacleMeshes.forEach((mesh, index) => {
    const body = obstacleBodies[index];
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });
}
```

#### Interpolação Suave
```typescript
// Para movimento mais suave
const lerpFactor = 0.1;
playerMesh.position.lerp(playerBody.position, lerpFactor);
```

## Implementação por Fases

### Fase 1: Sistema Base
- [ ] Instalar e configurar Cannon.js
- [ ] Criar mundo de física básico
- [ ] Implementar corpo do player
- [ ] Sincronização básica visual-física

### Fase 2: Colisões Básicas
- [ ] Colisões com o chão
- [ ] Colisões horizontais simples
- [ ] Sistema de raycasting
- [ ] Detecção de colisões

### Fase 3: Obstáculos
- [ ] Sistema de obstáculos estáticos
- [ ] Colisões com obstáculos
- [ ] Plataformas elevadas
- [ ] Sistema de escalada

### Fase 4: Otimizações
- [ ] Broadphase optimization
- [ ] LOD para colisões
- [ ] Pooling de objetos
- [ ] Performance monitoring

## Dependências

### Pacotes Necessários
```json
{
  "cannon-es": "^0.20.0",
  "@types/cannon-es": "^0.20.0"
}
```

### Imports
```typescript
import * as CANNON from 'cannon-es';
```

## Considerações de Performance

### Otimizações
1. **Broadphase**: SAPBroadphase para melhor performance
2. **Sleeping**: Corpos estáticos dormem automaticamente
3. **LOD**: Menos precisão para objetos distantes
4. **Pooling**: Reutilizar objetos de física

### Métricas
- **Target FPS**: 60 FPS
- **Physics Steps**: Máximo 3 sub-steps
- **Collision Objects**: Máximo 100 simultâneos
- **Memory Usage**: < 50MB para física

## Testes e Validação

### Cenários de Teste
1. **Movimento Básico**: WASD sem obstáculos
2. **Pulo Simples**: Pulo vertical sem colisões
3. **Colisão Horizontal**: Bater em parede andando
4. **Colisão no Ar**: Bater em obstáculo durante pulo
5. **Plataforma**: Pular em cima de plataforma
6. **Múltiplas Colisões**: Várias colisões simultâneas

### Métricas de Qualidade
- **Precisão**: Colisões dentro de 5cm
- **Estabilidade**: Sem "tremor" ou jitter
- **Performance**: FPS consistente > 55
- **Responsividade**: Input lag < 16ms

## Conclusão

O sistema de física e colisões baseado em Cannon.js oferece a melhor relação entre funcionalidade, performance e facilidade de implementação. A arquitetura proposta garante colisões precisas tanto para movimento horizontal quanto vertical, com suporte completo para obstáculos e plataformas.

A implementação em fases permite desenvolvimento incremental e validação contínua, garantindo um sistema robusto e otimizado para jogos em tempo real. 