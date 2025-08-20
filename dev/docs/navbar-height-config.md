# Configuração da Altura do Navbar

## Localização da Configuração

A altura do navbar está centralizada em um único local:

**Arquivo:** `src/index.css`
**Linha:** 2
```css
--navbar-height: 80px;
```

## Como Alterar

Para alterar a altura do navbar, edite apenas a variável CSS `--navbar-height` no arquivo `src/index.css`.

**Exemplo:**
- Para navbar menor: `--navbar-height: 60px;`
- Para navbar maior: `--navbar-height: 100px;`

## Arquivos Afetados Automaticamente

Todos os seguintes arquivos usam a variável `--navbar-height` e serão atualizados automaticamente:

- `src/components/NavigationBar.tsx` - Altura do AppBar e Toolbar
- `src/App.tsx` - Padding e altura do container principal
- `src/components/threejs/World3D.tsx` - Altura do canvas 3D
- `src/pages/ThreeDWorld.tsx` - Altura da página 3D
- `src/pages/ThreeDPlayground.tsx` - Altura da página playground
- `src/index.css` - Classes CSS que dependem da altura

## Páginas ThreeJS Automáticas

### Componente ThreePageContainer

Todas as páginas ThreeJS agora usam o componente `ThreePageContainer` que:

✅ **Ajusta automaticamente** a altura considerando o navbar
✅ **Elimina scroll** desnecessário
✅ **Mantém consistência** entre todas as páginas
✅ **Funciona em qualquer resolução**

### Como Usar

```tsx
import ThreePageContainer from '../components/threejs/ThreePageContainer';

const MinhaPagina3D: React.FC = () => {
  return (
    <ThreePageContainer>
      <Canvas>...</Canvas>
    </ThreePageContainer>
  );
};
```

### Configurações Disponíveis

```tsx
<ThreePageContainer
  background="url('/texture.jpg')"  // Background customizado
  overflow="auto"                   // Overflow configurável
  sx={{ /* estilos adicionais */ }} // Estilos customizados
>
```

## Benefícios

✅ **Centralizado:** Uma única variável controla toda a altura
✅ **Consistente:** Todas as páginas se ajustam automaticamente
✅ **Manutenível:** Sem necessidade de procurar por valores hardcoded
✅ **Responsivo:** Funciona em todas as resoluções
✅ **Automático:** Páginas ThreeJS se ajustam sozinhas
✅ **Template:** Template pronto para futuras páginas 3D 