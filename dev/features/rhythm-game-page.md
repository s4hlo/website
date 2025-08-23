# Rhythm Game Page

## Overview
Nova página de jogo de ritmo criada para o portfolio, implementando um sistema de jogo baseado em notas musicais e timing com interface visual estilo Guitar Hero.

## Features Implementadas

### Sistema de Notas
- **Estrutura de dados**: Cada nota possui valor (A5, B#4), posição (0-5), instrumento (0-1) e tempo
- **Posições**: 6 posições mapeadas para teclas SDF JKL
- **Instrumentos**: 2 sintetizadores diferentes (sine e square wave)

### Sistema Visual Guitar Hero
- **Notas caindo**: As notas caem de cima para baixo sempre na mesma velocidade constante
- **6 faixas verticais**: Cada faixa corresponde a uma tecla (S D F J K L)
- **Zona de acerto**: Área azul na parte inferior onde o jogador deve sincronizar
- **Velocidade constante**: Todas as notas caem na mesma velocidade, independente do BPM da música
- **Interface imersiva**: Visual similar ao Guitar Hero com notas coloridas por status

### Sistema de Pontuação
- **Níveis de precisão**: Perfect (±0.1 semínimas), Good (±0.25), Normal (±0.5)
- **Pontuação**: Perfect=100, Good=50, Normal=25, Miss=0
- **Sem penalidade**: Errar não tira pontos, apenas deixa de ganhar

### Controles
- **Teclas**: S D F J K L para as 6 posições
- **Controles do jogo**: Play/Pause, Stop
- **Interface visual**: Teclas destacam quando há notas ativas

### Tecnologias Utilizadas
- **Tone.js**: Biblioteca de áudio para reprodução de notas
- **React**: Interface e lógica do jogo
- **Material-UI**: Componentes visuais
- **TypeScript**: Tipagem estática

## Estrutura de Arquivos
- `src/pages/RhythmGame.tsx` - Página principal
- `src/types/rhythm-game.ts` - Tipos TypeScript
- Rota adicionada em `/rhythm-game`
- Botão de navegação na barra superior

## Música de Exemplo
- **BPM**: 120
- **Nome**: "Sample Rhythm"
- **Notas**: Sequência de C4 até C6 com diferentes instrumentos
- **Duração**: Aproximadamente 7 segundos

## Mecânica de Jogo
### Sistema de Queda das Notas
- **Velocidade constante**: Todas as notas caem na mesma velocidade
- **Tempo de queda**: 4 segundos para cada nota cair do topo até a zona de acerto
- **Sincronização**: O jogador deve pressionar a tecla quando a nota chegar na zona azul
- **Independência do BPM**: A velocidade visual é constante, mas o timing musical segue o BPM da música

### Estados Visuais das Notas
- **Roxas**: Notas que ainda não estão ativas (caindo)
- **Azuis**: Notas ativas para acerto (na zona de acerto)
- **Verdes**: Notas acertadas com sucesso
- **Vermelhas**: Notas perdidas (passaram da zona de acerto)

## Próximas Melhorias
- Sistema de músicas customizáveis
- Diferentes instrumentos e sons
- Efeitos visuais mais elaborados
- Sistema de combos e streaks
- Múltiplas dificuldades
- Opção de ajustar velocidade visual das notas
