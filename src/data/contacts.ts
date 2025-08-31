export interface ContactLink {
  name: string;
  url: string;
  deviconSrc?: string;
  icon?: string;
  color?: string;
}

export const CONTACTS_DATA: ContactLink[] = [
  {
    name: 'CNPq',
    url: '#',
    deviconSrc: '/lattes.png',
    color: 'blue',
  },
  {
    name: 'ORCID',
    url: '#',
    icon: 'SiOrcid',
    color: 'green',
  },
  {
    name: 'LinkedIn',
    url: '#',
    deviconSrc:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg',
    color: 'blue',
  },
  {
    name: 'Instagram',
    url: '#',
    icon: 'SiInstagram',
    color: 'pink',
  },
  {
    name: 'Letterboxd',
    url: '#',
    deviconSrc: '/letterboxd.svg',
    color: 'orange',
  },
  {
    name: 'Goodreads',
    url: '#',
    icon: 'SiGoodreads',
    color: 'brown',
  },
  {
    name: 'Resume PDF',
    url: '#',
    icon: 'VscFilePdf',
    color: 'red',
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
    color: 'black',
  },
];
