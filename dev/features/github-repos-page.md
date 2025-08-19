# GitHub Repositories Page

## Overview
Nova página que exibe os repositórios públicos do GitHub do usuário @s4hlo em um layout de grid responsivo.

## Features
- Lista repositórios usando a GitHub API pública
- Layout de grid responsivo uniforme (xs: 1 coluna, sm: 2 colunas, md: 3 colunas, lg: 4 colunas)
- Cards informativos mostrando nome, descrição, linguagem, estrelas e tópicos
- Todos os cards com altura fixa (320px) para manter uniformidade
- Ícone do GitHub em cada card
- Botões para acessar código e demo
- Efeito hover com animação
- Estados de loading e erro
- Design consistente com o tema da aplicação
- Interface em inglês

## Technical Details
- **API Endpoint**: `GET /users/s4hlo/repos?sort=updated&per_page=100`
- **Componente**: `src/pages/GitHubRepos.tsx`
- **Rota**: `/github-repos`
- **Navegação**: Botão "GitHub" na barra de navegação

## Data Structure
```typescript
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  visibility: string;
  updated_at: string;
  topics: string[];
}
```

## Dependencies
- Material-UI components
- Material-UI icons
- React hooks (useState, useEffect)

## Notes
- A API do GitHub tem limite de rate limiting para requisições não autenticadas
- Os repositórios são ordenados por data de atualização
- Máximo de 100 repositórios por página
- Tópicos limitados a 3 por repositório para manter o layout limpo 