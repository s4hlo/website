export interface CareerItem {
  title: string;
  period: string;
  description: string;
  tags: string[];
  type: 'academic' | 'professional';
}

export const CAREER_PATH_DATA = {
  academic: [
    {
      title: 'Bacharelado em Ciência da Computação',
      period: '2020 - 2024',
      description: 'Formação em fundamentos teóricos e práticos da computação, com foco em algoritmos, estruturas de dados e desenvolvimento de software.',
      tags: ['Algoritmos', 'Estruturas de Dados', 'Programação', 'Matemática'],
      type: 'academic' as const,
    },
    {
      title: 'Pesquisa em Machine Learning',
      period: '2022 - 2024',
      description: 'Desenvolvimento de modelos de aprendizado de máquina para análise de dados e reconhecimento de padrões.',
      tags: ['Machine Learning', 'Python', 'TensorFlow', 'Pesquisa'],
      type: 'academic' as const,
    },
    {
      title: 'Iniciação Científica',
      period: '2021 - 2023',
      description: 'Participação em projetos de pesquisa relacionados a otimização de algoritmos e análise de complexidade computacional.',
      tags: ['Pesquisa', 'Algoritmos', 'Otimização', 'Análise'],
      type: 'academic' as const,
    },
  ],
  professional: [
    {
      title: 'Desenvolvedor Full-Stack Senior',
      period: '2022 - Presente',
      description: 'Desenvolvimento de aplicações web escaláveis usando React, Node.js e tecnologias em nuvem.',
      tags: ['React', 'Node.js', 'AWS', 'TypeScript'],
      type: 'professional' as const,
    },
    {
      title: 'Arquiteto de Software',
      period: '2023 - Presente',
      description: 'Design de arquiteturas de sistemas distribuídos e microsserviços para aplicações empresariais.',
      tags: ['Arquitetura', 'Microsserviços', 'Docker', 'Kubernetes'],
      type: 'professional' as const,
    },
    {
      title: 'Tech Lead',
      period: '2023 - Presente',
      description: 'Liderança técnica de equipes de desenvolvimento, definindo padrões de código e arquitetura.',
      tags: ['Liderança', 'Code Review', 'Mentoria', 'Arquitetura'],
      type: 'professional' as const,
    },
  ],
};
