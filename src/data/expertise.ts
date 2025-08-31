export interface ExpertiseFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const EXPERTISE_DATA = {
  title: 'Expertise',
  features: [
    {
      icon: 'Code',
      title: 'Full-Stack Development',
      description:
        'Desenvolvimento completo de aplicações web com tecnologias modernas',
      color: 'blue',
    },
    {
      icon: 'Web',
      title: 'Modern Web Technologies',
      description: 'React, TypeScript e PWA para experiências web excepcionais',
      color: 'cyan',
    },
    {
      icon: 'Cloud',
      title: 'Cloud & DevOps',
      description:
        'Infraestrutura em nuvem e automação de processos de desenvolvimento',
      color: 'orange',
    },
    {
      icon: 'Psychology',
      title: 'AI & Machine Learning',
      description: 'Integração de IA e modelos de aprendizado de máquina',
      color: 'violet',
    },
    {
      icon: 'Gamepad',
      title: 'Game Development',
      description: 'Desenvolvimento de jogos com Unity e Godot',
      color: 'red',
    },
    {
      icon: 'Security',
      title: 'Security First',
      description: 'Sistemas seguros com autenticação e autorização robustos',
      color: 'light_green',
    },
  ] as ExpertiseFeature[],
};
