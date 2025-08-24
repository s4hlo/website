# Funcionalidade de Toggle de Stats com Tecla P

## Visão Geral

A funcionalidade de toggle de stats com a tecla "P" foi implementada no `ThreePageContainer` para fornecer uma experiência consistente em todas as páginas ThreeJS do portfolio.

## Como Funciona

### Hook Personalizado: `useStatsToggle`

Um hook personalizado foi criado para gerenciar o estado dos stats:

```typescript
// src/hooks/useStatsToggle.ts
export const useStatsToggle = (initialState: boolean = false) => {
  const [statsVisible, setStatsVisible] = useState(initialState);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'p') {
        setStatsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return { statsVisible, setStatsVisible };
};
```

### Componente: `ThreePageContainer`

O `ThreePageContainer` foi atualizado para incluir:

- **Prop `showStats`**: Define se os stats devem estar visíveis por padrão (padrão: `false`)
- **Children como função**: Permite acessar o estado `statsVisible` nos componentes filhos
- **Listener de tecla P**: Toggle automático dos stats

## Uso

### Uso Básico (Stats Desabilitados por Padrão)

```tsx
<ThreePageContainer>
  <Canvas>
    {/* Seu conteúdo 3D */}
  </Canvas>
</ThreePageContainer>
```

### Com Stats Habilitados por Padrão

```tsx
<ThreePageContainer showStats={true}>
  {(statsVisible) => (
    <Canvas>
      {statsVisible && <Stats />}
      {/* Seu conteúdo 3D */}
    </Canvas>
  )}
</ThreePageContainer>
```

### Exemplo Completo

```tsx
import { Stats } from '@react-three/drei';
import ThreePageContainer from '../components/threejs/ThreePageContainer';

export default function MinhaPagina3D() {
  return (
    <ThreePageContainer>
      {(statsVisible) => (
        <Canvas>
          {statsVisible && <Stats />}
          
          {/* Cena 3D */}
          <ambientLight intensity={0.5} />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </Canvas>
      )}
    </ThreePageContainer>
  );
}
```

## Páginas Atualizadas

As seguintes páginas foram atualizadas para usar a nova funcionalidade:

1. **ThreeDWorld** - Stats desabilitados por padrão (tecla P para ativar)
2. **ThreeDCubes** - Stats desabilitados por padrão (tecla P para ativar)  
3. **ThreeDPlayground** - Stats desabilitados por padrão (tecla P para ativar)

## Características

- **Tecla P**: Toggle dos stats em qualquer página
- **Estado padrão**: Stats desabilitados por padrão para melhor performance
- **Estado persistente**: O estado é mantido durante a sessão
- **Consistência**: Mesmo comportamento em todas as páginas
- **Performance**: Hook otimizado com cleanup automático
- **Flexibilidade**: Stats podem ser habilitados/desabilitados por página

## Benefícios

1. **UX Consistente**: Todas as páginas 3D têm o mesmo comportamento
2. **Performance por Padrão**: Stats desabilitados inicialmente para melhor FPS
3. **Fácil Debug**: Desenvolvedores podem rapidamente ativar stats com tecla P
4. **Acessibilidade**: Tecla P é intuitiva para "Performance"
5. **Manutenibilidade**: Código centralizado no container
6. **Reutilização**: Qualquer nova página 3D herda automaticamente a funcionalidade
