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
  tools: Tool[];
}

export interface Tool {
  name: string;
  deviconSrc?: string;
  icon?: string;
  color?: string;
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
      tools: [
        {
          name: 'NestJS',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
        },
        {
          name: 'DBeaver',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dbeaver/dbeaver-original.svg',
        },
        {
          name: 'PostgreSQL',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain.svg',
        },
        {
          name: 'TypeORM',
          icon: 'SiTypeorm',
          color: 'orange',
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
      tools: [
        {
          name: 'React',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
        },
        {
          name: 'TypeScript',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
        },
        {
          name: 'Vite',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
        },
        {
          name: 'Material-UI',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg',
        },
        {
          name: 'Three.js',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
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
      tools: [
        {
          name: 'AWS',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
        },
        {
          name: 'Docker',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg',
        },
        {
          name: 'Git',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-plain.svg',
        },
        {
          name: 'Linux',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/archlinux/archlinux-original.svg',
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
      tools: [
        {
          name: 'Neovim',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neovim/neovim-original.svg',
        },
        {
          name: 'VS Code',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
        },
        {
          name: 'Postman',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-plain.svg',
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

      tools: [
        {
          name: 'Python',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
        },
        {
          name: 'Scikit-learn',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg',
        },
        {
          name: 'PyTorch',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
        },
        {
          name: 'TensorFlow',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
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
      tools: [
        {
          name: 'Unity',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
        },
        {
          name: 'Godot',
          deviconSrc:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg',
        },
      ],
    },
  ] as SkillCategory[],
};
