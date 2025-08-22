# Sistema de Limites de Movimento (MovementBoundary)

## Visão Geral

O `MovementBoundary` é um componente que substitui o sistema de paredes tradicionais por polígonos planos que definem áreas onde o player pode se mover. Quando o player tenta sair dessas áreas, o sistema aplica um efeito de "sliding" que permite deslizar ao longo dos limites em vez de travar completamente.

## Características

- **Polígonos Planos**: Define áreas de movimento usando pontos 2D (x, z)
- **Colisão Inteligente**: Detecta quando o player tenta sair da área permitida
- **Sistema de Sliding**: Permite deslizar ao longo dos limites em vez de travar
- **Debug Visual**: Opção para mostrar visualmente os limites e áreas
- **Flexibilidade**: Suporta qualquer forma de polígono (triângulos, retângulos, formas complexas)

## Uso Básico

```tsx
import MovementBoundary from './MovementBoundary';

// Área retangular simples
<MovementBoundary 
  points={[
    [-5, -5], [5, -5], [5, 5], [-5, 5]
  ]}
  height={2}
  color="#FF0000"
  showDebug={true}
/>
```

## Propriedades

- `points`: Array de pontos `[x, z]` que formam o polígono
- `height`: Altura do limite para colisão (padrão: 2)
- `color`: Cor para visualização de debug (padrão: "#FF0000")
- `showDebug`: Mostrar visualização do polígono (padrão: false)

## Exemplos de Formas

### Retângulo
```tsx
points={[
  [-5, -5], [5, -5], [5, 5], [-5, 5]
]}
```

### Triângulo
```tsx
points={[
  [0, 0], [3, 0], [1.5, 3]
]}
```

### Forma em L
```tsx
points={[
  [-3, -3], [3, -3], [3, -1], [1, -1], [1, 3], [-3, 3]
]}
```

### Círculo Aproximado (Octágono)
```tsx
points={[
  [0, 4], [2.83, 2.83], [4, 0], [2.83, -2.83], 
  [0, -4], [-2.83, -2.83], [-4, 0], [-2.83, 2.83]
]}
```

## Como Funciona

1. **Definição da Área**: Os pontos definem um polígono no plano XZ
2. **Detecção de Colisão**: O sistema verifica se a posição do player está dentro do polígono
3. **Cálculo de Sliding**: Quando há colisão, calcula o movimento paralelo ao limite
4. **Aplicação do Movimento**: Aplica o movimento ajustado para manter o player dentro da área

## Vantagens sobre Paredes Tradicionais

- **Flexibilidade**: Qualquer forma de polígono é possível
- **Performance**: Cálculos 2D são mais eficientes que colisões 3D complexas
- **Controle**: Movimento mais suave e previsível
- **Debug**: Visualização clara das áreas de movimento

## Integração com PlayerController

O `PlayerController` automaticamente detecta e usa os limites de movimento definidos pelos `MovementBoundary`. Não é necessário configurar nada adicional - apenas adicione os componentes à cena.

## Dicas de Uso

1. **Área Principal**: Defina primeiro uma área externa grande para o movimento geral
2. **Obstáculos**: Use áreas menores para criar obstáculos internos
3. **Formas Simples**: Comece com formas simples (retângulos, triângulos)
4. **Debug Visual**: Use `showDebug={true}` durante o desenvolvimento
5. **Pontos em Sentido Horário**: Para melhor compatibilidade, defina os pontos em sentido horário 