export interface ContactLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  description: string;
}

export const CONTACTS_DATA: ContactLink[] = [
  {
    name: 'CNPq',
    url: '#',
    icon: 'SiResearchgate',
    color: 'blue',
    description: 'Lattes - Currículo Lattes',
  },
  {
    name: 'ORCID',
    url: '#',
    icon: 'SiOrcid',
    color: 'green',
    description: 'Identificador de pesquisador',
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: 'SiLinkedin',
    color: 'blue',
    description: 'Perfil profissional',
  },
  {
    name: 'Instagram',
    url: '#',
    icon: 'SiInstagram',
    color: 'pink',
    description: 'Fotos e stories',
  },
  {
    name: 'Letterboxd',
    url: '#',
    icon: 'SiLetterboxd',
    color: 'orange',
    description: 'Resenhas de filmes',
  },
  {
    name: 'Goodreads',
    url: '#',
    icon: 'SiGoodreads',
    color: 'brown',
    description: 'Resenhas de livros',
  },
  {
    name: 'Resume PDF',
    url: '#',
    icon: 'SiPdf',
    color: 'red',
    description: 'Currículo em PDF',
  },
  {
    name: 'LeetCode',
    url: '#',
    icon: 'SiLeetcode',
    color: 'orange',
    description: 'Problemas de programação',
  },
  {
    name: 'GitHub',
    url: '#',
    icon: 'SiGithub',
    color: 'black',
    description: 'Repositórios de código',
  },
];
