# Plano de Ação - Sistema de Física e Colisões (Three.js Nativo)

## Visão Geral
Implementação do sistema de física e colisões usando apenas recursos nativos do Three.js, focando em performance e simplicidade.

## Solução Escolhida: Three.js Built-in
- **Raycasting**: Para detecção de colisões precisas
- **BoundingBox/BoundingSphere**: Para caixas de colisão
- **Math**: Para cálculos de física básica
- **Pros**: Leve, sem dependências externas, integrado
- **Foco**: Colisões precisas e física básica realista

## Fase 1: Sistema Base (Semana 1)

### 1.1 Estrutura de Colisão
- [ ] Criar sistema de bounding boxes para objetos
- [ ] Implementar raycaster para detecção de colisões
- [ ] Sistema de layers para otimização de colisões

### 1.2 Player Controller
- [ ] Implementar movimento WASD com colisões
- [ ] Sistema de gravidade básico
- [ ] Detecção de colisão com o chão

### 1.3 Mundo Básico
- [ ] Chão com colisão
- [ ] Sistema de coordenadas para colisões
- [ ] Estrutura de dados para objetos colidíveis

## Fase 2: Sistema de Colisões (Semana 2)

### 2.1 Colisões Horizontais
- [ ] Raycasting em 4 direções (WASD)
- [ ] Prevenção de atravessamento de paredes
- [ ] Sistema de deslizamento ao longo de obstáculos

### 2.2 Colisões Verticais
- [ ] Detecção de colisão abaixo do player
- [ ] Sistema de pulo com colisão no ar
- [ ] Prevenção de atravessamento de tetos

### 2.3 Sistema de Plataformas
- [ ] Detecção de plataformas elevadas
- [ ] Colisão apenas de cima
- [ ] Sistema de escalada automática

## Fase 3: Obstáculos e Ambiente (Semana 3)

### 3.1 Tipos de Obstáculos
- [ ] Obstáculos sólidos (paredes, caixas)
- [ ] Plataformas (superfícies para subir)
- [ ] Obstáculos semi-sólidos (arbustos, cercas)

### 3.2 Sistema de Colisão por Tipo
- [ ] Colisão completa para sólidos
- [ ] Colisão seletiva para plataformas
- [ ] Colisão condicional para semi-sólidos

### 3.3 Otimizações
- [ ] Spatial partitioning para colisões
- [ ] LOD para objetos distantes
- [ ] Pooling de raycaster

## Fase 4: Física Avançada (Semana 4)

### 4.1 Sistema de Forças
- [ ] Gravidade realista
- [ ] Fricção de superfície
- [ ] Momentum e inércia

### 4.2 Colisões Dinâmicas
- [ ] Colisões entre objetos móveis
- [ ] Sistema de empurrão
- [ ] Reação a colisões

### 4.3 Polimento
- [ ] Suavização de movimento
- [ ] Prevenção de jitter
- [ ] Otimização de performance

## Estrutura de Arquivos

### Core Physics
```
src/physics/
├── PhysicsWorld.ts          # Mundo de física principal
├── CollisionSystem.ts       # Sistema de colisões
├── PlayerPhysics.ts         # Física do player
└── types.ts                 # Tipos de física
```

### Collision Objects
```
src/physics/objects/
├── CollisionObject.ts       # Classe base para objetos colidíveis
├── SolidObstacle.ts         # Obstáculos sólidos
├── Platform.ts              # Plataformas
└── SemiSolidObstacle.ts     # Obstáculos semi-sólidos
```

### Integration
```
src/components/threejs/
├── PhysicsWorld.tsx         # Componente React para física
└── CollisionDebug.tsx       # Debug visual de colisões
```

## Implementação Técnica

### 1. Sistema de Raycasting
```typescript
class CollisionSystem {
  private raycaster: THREE.Raycaster;
  
  checkCollision(start: Vector3, end: Vector3): CollisionResult {
    const direction = end.clone().sub(start);
    const ray = new THREE.Ray(start, direction.normalize());
    
    const intersects = this.raycaster.intersectObjects(this.collidableObjects);
    return this.processCollision(intersects, direction.length());
  }
}
```

### 2. Bounding Box System
```typescript
class CollisionObject {
  public boundingBox: THREE.Box3;
  public collisionType: 'solid' | 'platform' | 'semi-solid';
  
  updateBoundingBox() {
    this.boundingBox.setFromObject(this.mesh);
  }
}
```

### 3. Player Physics
```typescript
class PlayerPhysics {
  private velocity: Vector3;
  private isOnGround: boolean;
  
  update(deltaTime: number) {
    // Aplicar gravidade
    if (!this.isOnGround) {
      this.velocity.y -= 9.82 * deltaTime;
    }
    
    // Verificar colisões antes de mover
    const newPosition = this.checkMovementCollision();
    this.position.copy(newPosition);
  }
}
```

## Dependências

### Pacotes Necessários
```json
{
  "three": "^0.160.0",
  "@types/three": "^0.160.0"
}
```

### Imports Principais
```typescript
import * as THREE from 'three';
import { Vector3, Raycaster, Box3, Ray } from 'three';
```

## Métricas de Sucesso

### Performance
- **FPS**: Mínimo 55 FPS
- **Colisões**: Máximo 100 objetos simultâneos
- **Memory**: < 30MB para sistema de física

### Qualidade
- **Precisão**: Colisões dentro de 10cm
- **Estabilidade**: Sem jitter ou tremores
- **Responsividade**: Input lag < 20ms

## Cronograma Detalhado

### Semana 1: Base
- **Dia 1-2**: Estrutura de colisão e raycaster
- **Dia 3-4**: Player controller básico
- **Dia 5**: Mundo básico e testes

### Semana 2: Colisões
- **Dia 1-2**: Colisões horizontais
- **Dia 3-4**: Colisões verticais e plataformas
- **Dia 5**: Testes e polimento

### Semana 3: Obstáculos
- **Dia 1-2**: Sistema de obstáculos
- **Dia 3-4**: Otimizações de colisão
- **Dia 5**: Testes de performance

### Semana 4: Polimento
- **Dia 1-2**: Física avançada
- **Dia 3-4**: Otimizações finais
- **Dia 5**: Testes completos e documentação

## Próximos Passos Imediatos

1. **Criar estrutura de pastas** para sistema de física
2. **Implementar raycaster básico** para detecção de colisões
3. **Criar classe CollisionObject** base
4. **Integrar com PlayerController** existente
5. **Testar colisões básicas** com o chão

## Considerações de Design

- **Simplicidade**: Manter o sistema simples e performático
- **Extensibilidade**: Estrutura que permite adicionar novos tipos de colisão
- **Debug**: Sistema de debug visual para desenvolvimento
- **Performance**: Otimizações contínuas baseadas em métricas reais 