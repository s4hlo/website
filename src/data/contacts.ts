import { colors } from '../theme';
import type { Tool } from './skills';

export const CONTACTS_DATA: Tool[] = [
  {
    name: 'CNPq',
    url: '#',
    deviconSrc: '/lattes.png',
  },
  {
    name: 'ORCID',
    url: '#',
    icon: 'SiOrcid',
    color: colors.brands.orcid,
  },
  {
    name: 'LinkedIn',
    url: '#',
    deviconSrc:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg',
  },
  {
    name: 'Instagram',
    url: '#',
    icon: 'SiInstagram',
    color: colors.brands.instagram,
  },
  {
    name: 'Letterboxd',
    url: '#',
    deviconSrc: '/letterboxd.svg',
  },
  {
    name: 'Goodreads',
    url: '#',
    icon: 'SiGoodreads',
    color: colors.brands.goodreads,
  },
  {
    name: 'Resume PDF',
    url: '#',
    icon: 'VscFilePdf',
    color: colors.category.red,
  },
  {
    name: 'LeetCode',
    url: '#',
    deviconSrc:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/leetcode/leetcode-original.svg',
  },
  {
    name: 'GitHub',
    url: '#',
    icon: 'SiGithub',
    color: colors.brands.github,
  },
];
