# Sistema de Cores - Portfolio

## Visão Geral
O sistema de cores está centralizado no arquivo `src/theme.ts` para manter consistência visual em todo o projeto e facilitar manutenção.

## Estrutura das Cores

### Cores Principais
```typescript
colors.primary.main    // #3b82f6 - Azul principal
colors.primary.light   // #60a5fa - Azul claro
colors.primary.dark    // #2563eb - Azul escuro

colors.secondary.main  // #06b6d4 - Ciano principal
colors.secondary.light // #22d3ee - Ciano claro
colors.secondary.dark  // #0891b2 - Ciano escuro
```

### Cores de Categoria (Skills)
```typescript
colors.category.backend  // #60a5fa - Backend & APIs
colors.category.frontend // #22d3ee - Frontend & Web
colors.category.cloud    // #f59e0b - Cloud & DevOps
colors.category.tools    // #10b981 - Development Tools
colors.category.ai       // #8b5cf6 - AI & Machine Learning
colors.category.games    // #ef4444 - Game Development
colors.category.security // #10b981 - Security
```

### Gradientes
```typescript
colors.gradients.main           // Background principal azulado
colors.gradients.primary        // Gradiente azul-ciano para títulos
colors.gradients.card.primary   // Gradiente para cards principais
colors.gradients.card.secondary // Gradiente para cards secundários
```

### Cores de Status
```typescript
colors.status.success // #10b981 - Verde para sucesso
colors.status.warning // #f59e0b - Amarelo para avisos
colors.status.error   // #ef4444 - Vermelho para erros
colors.status.info    // #3b82f6 - Azul para informações
```

## Funções Utilitárias

### colorUtils.getCardGradient(color, opacity)
Gera gradiente para cards baseado na cor:
```typescript
background: colorUtils.getCardGradient(colors.category.backend)
// Resultado: linear-gradient(135deg, #60a5fa10 0%, #60a5fa05 100%)
```

### colorUtils.getBorderColor(color, opacity)
Gera cor de borda com transparência:
```typescript
border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`
// Resultado: 1px solid #3b82f620
```

### colorUtils.getShadowColor(color, opacity)
Gera cor de sombra com transparência:
```typescript
boxShadow: `0 8px 25px ${colorUtils.getShadowColor(colors.primary.main)}`
// Resultado: 0 8px 25px #3b82f620
```

## Como Usar

### 1. Importar as cores
```typescript
import { colors, colorUtils } from '../theme';
```

### 2. Usar cores diretas
```typescript
sx={{ color: colors.category.frontend }}
```

### 3. Usar gradientes
```typescript
sx={{ background: colors.gradients.main }}
```

### 4. Usar funções utilitárias
```typescript
sx={{ 
  background: colorUtils.getCardGradient(colors.category.backend),
  border: `1px solid ${colorUtils.getBorderColor(colors.category.backend)}`
}}
```

## Benefícios

✅ **Consistência**: Todas as páginas usam as mesmas cores
✅ **Manutenibilidade**: Mudanças de cor em um só lugar
✅ **Reutilização**: Funções utilitárias para padrões comuns
✅ **Escalabilidade**: Fácil adicionar novas cores e categorias
✅ **Padrão**: Sistema organizado e documentado

## Exemplo de Uso Completo

```typescript
<Paper
  sx={{
    p: 4,
    background: colorUtils.getCardGradient(colors.category.backend),
    border: `1px solid ${colorUtils.getBorderColor(colors.category.backend)}`,
    borderRadius: 3,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 8px 25px ${colorUtils.getShadowColor(colors.category.backend)}`,
      borderColor: colorUtils.getBorderColor(colors.category.backend, 40),
    },
  }}
>
  {/* Conteúdo do card */}
</Paper>
``` 