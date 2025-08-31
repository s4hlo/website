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
};

// Funções utilitárias para cores
export const colorUtils = {
  getColorWithOpacity: (color: string, opacity: number = 1): string => {
    return color.replace(/rgba?\(([^)]+)\)/, (_, values) => {
      const parts = values.split(',').map((v: string) => v.trim());
      const [r, g, b] = parts; // ignora a opacidade antiga
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });
  },

  getCardGradient: (color: string, opacity: number = 10) =>
    `linear-gradient(135deg, ${color}${opacity} 0%, ${color}05 100%)`,

  // Gera cor de borda com transparência
  getBorderColor: (color: string, opacity: number = 20) => `${color}${opacity}`,

  // Gera cor de sombra com transparência
  getShadowColor: (color: string, opacity: number = 20) => `${color}${opacity}`,
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
