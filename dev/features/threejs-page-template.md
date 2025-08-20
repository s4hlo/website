# Template para Páginas ThreeJS

## Estrutura Padrão

Use este template para criar novas páginas ThreeJS que funcionem automaticamente com o navbar:

```tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import ThreePageContainer from '../components/threejs/ThreePageContainer';

const NovaPaginaThreeJS: React.FC = () => {
  return (
    <ThreePageContainer>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        {/* Seu conteúdo 3D aqui */}
      </Canvas>
      
      {/* Overlays e controles aqui */}
    </ThreePageContainer>
  );
};

export default NovaPaginaThreeJS;
```

## Características Automáticas

✅ **Altura correta:** `calc(100vh - var(--navbar-height))`
✅ **Sem scroll:** `overflow: hidden` por padrão
✅ **Layout consistente:** Mesmo comportamento em todas as páginas
✅ **Responsivo:** Funciona em todas as resoluções

## Configurações Disponíveis

```tsx
<ThreePageContainer
  background="url('/texture.jpg')"  // Background customizado
  overflow="auto"                   // Overflow configurável
  sx={{ /* estilos adicionais */ }} // Estilos customizados
>
```

## Exemplos de Uso

### Página Simples
```tsx
<ThreePageContainer>
  <Canvas>...</Canvas>
</ThreePageContainer>
```

### Com Background Customizado
```tsx
<ThreePageContainer background="radial-gradient(circle, #1a1a2e, #16213e)">
  <Canvas>...</Canvas>
</ThreePageContainer>
```

### Com Overflow Visível
```tsx
<ThreePageContainer overflow="visible">
  <Canvas>...</Canvas>
</ThreePageContainer>
```

## Benefícios

- 🎯 **Zero configuração:** Funciona automaticamente
- 🔧 **Manutenível:** Mudanças centralizadas
- 📱 **Responsivo:** Adapta-se a qualquer tela
- 🚀 **Performance:** Sem reflows desnecessários 