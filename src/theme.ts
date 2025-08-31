import { alpha, createTheme } from '@mui/material/styles';

const primitives = {
  blue: '#60a5fa',
  cyan: '#22d3ee',
  orange: '#f59e0b',
  dark_green: '#10b981',
  violet: '#8b5cf6',
  red: '#ef4444',
  light_green: '#10b981',
  magenta: '#ec4899',
  pure_black: '#000000',
  pure_white: '#ffffff',
  main: '#3b82f6',
  light: '#60a5fa',
  dark: '#2563eb',
  main2: '#06b6d4',
  light2: '#22d3ee',
  dark2: '#0891b2',
  color2: '#a0a0a0',
  color3: '#1a1a1a',
  color4: '#0f172a',
  color5: '#1e293b',
  color6: '#334155',
  gray_light: '#f3f4f6',
  gray_medium: '#9ca3af',
  gray_dark: '#374151',
  transparent: 'transparent',

  // Novas cores encontradas no projeto
  lime_green: '#84cc16',
  bright_orange: '#f97316',
  sky_blue: '#87CEEB',
  light_green_3d: '#90EE90',
  bright_green: '#00FF00',
  bright_red: '#FF0000',
  bright_blue: '#4060ff',
  bright_red_alt: '#ff4444',
  bright_blue_alt: '#9999ff',
  dark_red: '#dc2626',
  dark_blue: '#4f46e5',
  dark_gray: '#94a3b8',
  dark_blue_gray: '#1ba1c1',
  light_blue: '#93c5fd',
  light_cyan: '#67e8f9',
  dark_theme_bg: '#0f0f23',
  dark_theme_bg2: '#1a1a2e',
  dark_theme_bg3: '#16213e',
  dark_theme_bg4: '#141622',
  dark_theme_bg5: '#181825',

  // Cores do CSS
  css_blue: '#646cff',
  css_blue_hover: '#535bf2',
  css_blue_light: '#747bff',
  css_blue_alpha: '#646cffaa',
  css_cyan: '#61dafbaa',
  css_gray: '#888',
  css_dark_bg: '#242424',
  css_light_text: '#213547',
  css_light_bg: '#ffffff',
  css_light_button_bg: '#f9f9f9',

  // Cores do GitHub Contributions
  github_dark: '#172A3A',
  github_dark2: '#0D505E',
  github_dark3: '#1D8383',
  github_teal: '#39C1AD',
  github_bright_teal: '#4DFFE2',
};

// Sistema de cores centralizado
export const colors = {
  // Cores principais
  primary: {
    main: primitives.main,
    light: primitives.light,
    dark: primitives.dark,
  },
  secondary: {
    main: primitives.main2,
    light: primitives.light2,
    dark: primitives.dark2,
  },

  // Cores de categoria para skills
  category: {
    blue: primitives.blue,
    cyan: primitives.cyan,
    orange: primitives.orange,
    dark_green: primitives.dark_green,
    violet: primitives.violet,
    red: primitives.red,
    light_green: primitives.light_green,
    magenta: primitives.magenta,
  },

  // Gradientes de background
  gradients: {
    main: `linear-gradient(135deg, ${primitives.color4} 0%, ${primitives.color5} 50%, ${primitives.color6} 100%)`,
    primary: `linear-gradient(135deg, ${primitives.blue} 0%, ${primitives.cyan} 100%)`,
    card: {
      primary: `linear-gradient(135deg, ${alpha(primitives.blue, 0.1)} 0%, ${alpha(primitives.cyan, 0.05)} 100%)`,
      red: `linear-gradient(135deg, ${alpha(primitives.red, 0.1)} 0%, ${alpha(primitives.red, 0.05)} 100%)`,
      magenta: `linear-gradient(135deg, ${alpha(primitives.magenta, 0.1)} 0%, ${alpha(primitives.magenta, 0.05)} 100%)`,
      violet: `linear-gradient(135deg, ${alpha(primitives.violet, 0.1)} 0%, ${alpha(primitives.violet, 0.05)} 100%)`,
      orange: `linear-gradient(135deg, ${alpha(primitives.orange, 0.1)} 0%, ${alpha(primitives.orange, 0.05)} 100%)`,
      dark_green: `linear-gradient(135deg, ${alpha(primitives.dark_green, 0.1)} 0%, ${alpha(primitives.dark_green, 0.05)} 100%)`,
      light_green: `linear-gradient(135deg, ${alpha(primitives.light_green, 0.1)} 0%, ${alpha(primitives.light_green, 0.05)} 100%)`,
      blue: `linear-gradient(135deg, ${alpha(primitives.blue, 0.1)} 0%, ${alpha(primitives.blue, 0.05)} 100%)`,
      cyan: `linear-gradient(135deg, ${alpha(primitives.cyan, 0.1)} 0%, ${alpha(primitives.cyan, 0.05)} 100%)`,
    },
  },

  pure: {
    white: primitives.pure_white,
    black: primitives.pure_black,
  },

  // Cores de background
  background: {
    default: primitives.pure_black,
    paper: primitives.color3,
    card: alpha(primitives.pure_white, 0.05),
  },

  // Cores de texto
  text: {
    primary: primitives.pure_white,
    secondary: primitives.color2,
  },

  // Cores de status
  status: {
    success: primitives.dark_green,
    warning: primitives.orange,
    error: primitives.red,
    info: primitives.blue,
  },

  // Cores do GitHub Contributions
  github: {
    dark: primitives.github_dark,
    dark2: primitives.github_dark2,
    dark3: primitives.github_dark3,
    teal: primitives.github_teal,
    bright_teal: primitives.github_bright_teal,
  },

  // Cores 3D
  threeD: {
    dark_blue_gray: primitives.dark_blue_gray,
  },
};

// Funções utilitárias para cores
export const colorUtils = {
  getBorderColor: (color: string, opacity: number = 20) => `${color}${opacity}`,
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default,
      paper: 'transparent', // Deixamos transparente para não conflitar com MuiPaper
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    info: {
      main: colors.status.info,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: `0 1px 3px 0 ${alpha(primitives.pure_black, 0.1)}, 0 1px 2px 0 ${alpha(primitives.pure_black, 0.06)}`,
          '&:hover': {
            boxShadow: `0 4px 6px -1px ${alpha(primitives.pure_black, 0.1)}, 0 2px 4px -1px ${alpha(primitives.pure_black, 0.06)}`,
          },

          '&.navbar-button': {
            minWidth: '100px',
            fontSize: '0.8rem',
            padding: '8px 16px',
            borderRadius: '8px',
            borderColor: alpha(primitives.pure_white, 0.2),
            '&:hover': {
              borderColor: alpha(primitives.pure_white, 0.4),
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: '100%',
          top: 0,
          height: 'var(--navbar-height)',
          borderRadius: '0',
          background: colors.gradients.main,
          border: 'none',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: `1px solid ${alpha(primitives.pure_white, 0.1)}`,
          padding: '0px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: colors.gradients.card.primary,
          border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '32px',
          '&.hover-card': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          },
        },
      },
    },
  },
});
