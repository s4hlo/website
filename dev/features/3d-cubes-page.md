# 3D Cubes Page

## Visão Geral
Nova página 3D que exibe esferas interativas com física baseada no código de exemplo fornecido.

## Características
- Esferas 3D com física realista usando Rapier
- Sistema de cores dinâmico com acentos
- Iluminação ambiente avançada com Lightformers
- Interação por clique para mudar esquema de cores
- Física sem gravidade para movimento flutuante

## Implementação
- **Arquivo**: `src/pages/ThreeDCubes.tsx`
- **Container**: `ThreePageContainer` para layout consistente
- **Física**: Sistema Rapier com colisões esféricas
- **Iluminação**: Environment com múltiplos Lightformers
- **Materiais**: MeshStandardMaterial com propriedades variáveis

## Dependências
- `maath` para easing de animações
- `@react-three/rapier` para física
- `@react-three/drei` para componentes 3D

## Navegação
- Rota: `/3d-cubes`
- Botão na navbar com cor laranja (#f59e0b)
- Posicionado após "3D Playground"

## Funcionalidades
1. **Esferas Flutuantes**: 18 esferas com posições aleatórias
2. **Mudança de Cores**: Clique alterna entre 4 esquemas de cores
3. **Física Realista**: Colisões e movimento suave
4. **Iluminação Dinâmica**: Múltiplas fontes de luz com rotação 