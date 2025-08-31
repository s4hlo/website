export interface Skill {
  name: string;
  level: number;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export const SKILLS_DATA = {
  title: 'Technical Skills',
  subtitle:
    'Full-stack developer with expertise in modern web technologies, cloud infrastructure, and cutting-edge AI/ML solutions',
  categories: [
    {
      title: 'Backend & APIs',
      icon: 'Code',
      color: 'blue',
      skills: [
        {
          name: 'NestJS',
          level: 95,
          description:
            'Framework Node.js para aplicações escaláveis e eficientes',
          tags: ['Node.js', 'TypeScript', 'Decorators', 'Dependency Injection'],
        },
        {
          name: 'TypeORM',
          level: 90,
          description: 'ORM para TypeScript com suporte a múltiplos bancos',
          tags: ['Database', 'Migrations', 'Relations', 'Query Builder'],
        },
        {
          name: 'PostgreSQL',
          level: 88,
          description: 'Banco de dados relacional avançado',
          tags: ['SQL', 'Performance', 'Indexing', 'Stored Procedures'],
        },
        {
          name: 'Authorization Systems',
          level: 92,
          description: 'Sistemas de autenticação e autorização robustos',
          tags: ['JWT', 'OAuth', 'RBAC', 'Security'],
        },
      ],
    },
    {
      title: 'Frontend & Web',
      icon: 'Web',
      color: 'cyan',
      skills: [
        {
          name: 'React',
          level: 95,
          description: 'Biblioteca para interfaces de usuário interativas',
          tags: ['Hooks', 'Context', 'Performance', 'TypeScript'],
        },
        {
          name: 'TypeScript',
          level: 93,
          description: 'Superset do JavaScript com tipagem estática',
          tags: ['Types', 'Interfaces', 'Generics', 'Advanced Types'],
        },
        {
          name: 'Modern Web',
          level: 90,
          description: 'Tecnologias web modernas e PWA',
          tags: ['ES6+', 'Web APIs', 'Service Workers', 'Performance'],
        },
      ],
    },
    {
      title: 'Cloud & DevOps',
      icon: 'Cloud',
      color: 'orange',
      skills: [
        {
          name: 'AWS',
          level: 85,
          description: 'Serviços em nuvem da Amazon',
          tags: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
        },
        {
          name: 'Linux',
          level: 90,
          description: 'Sistemas operacionais baseados em Unix',
          tags: ['Arch Linux', 'Shell Scripting', 'System Administration'],
        },
        {
          name: 'Arch Linux',
          level: 88,
          description: 'Distribuição Linux rolling release',
          tags: ['Pacman', 'AUR', 'Customization', 'Performance'],
        },
      ],
    },
    {
      title: 'Development Tools',
      icon: 'Terminal',
      color: 'dark_green',
      skills: [
        {
          name: 'Neovim',
          level: 92,
          description: 'Editor de texto modal altamente customizável',
          tags: ['Lua', 'Plugins', 'LSP', 'Telescope', 'Treesitter'],
        },
        {
          name: 'Git',
          level: 90,
          description: 'Sistema de controle de versão distribuído',
          tags: ['Workflows', 'Rebase', 'Cherry-pick', 'Git Hooks'],
        },
      ],
    },
    {
      title: 'AI & Machine Learning',
      icon: 'Psychology',
      color: 'violet',
      skills: [
        {
          name: 'Python',
          level: 88,
          description: 'Linguagem para ciência de dados e ML',
          tags: ['NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow'],
        },
        {
          name: 'Machine Learning',
          level: 85,
          description: 'Algoritmos e modelos de aprendizado de máquina',
          tags: [
            'Supervised Learning',
            'Neural Networks',
            'Data Preprocessing',
          ],
        },
        {
          name: 'LLMs & AI',
          level: 80,
          description: 'Large Language Models e inteligência artificial',
          tags: ['OpenAI API', 'Prompt Engineering', 'AI Integration'],
        },
      ],
    },
    {
      title: 'Game Development',
      icon: 'Gamepad',
      color: 'red',
      skills: [
        {
          name: 'Unity',
          level: 75,
          description: 'Engine de desenvolvimento de jogos',
          tags: ['C#', '3D Graphics', 'Physics', 'Animation'],
        },
        {
          name: 'Godot',
          level: 70,
          description: 'Engine de jogos open source',
          tags: ['GDScript', '2D/3D', 'Cross-platform', 'Lightweight'],
        },
      ],
    },
  ] as SkillCategory[],
};
