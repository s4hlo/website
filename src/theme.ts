import { createTheme } from '@mui/material/styles';

// Sistema de cores centralizado
export const colors = {
  // Cores principais
  primary: {
    main: '#3b82f6', // blue-500
    light: '#60a5fa', // blue-400
    dark: '#2563eb', // blue-600
  },
  secondary: {
    main: '#06b6d4', // cyan-500
    light: '#22d3ee', // cyan-400
    dark: '#0891b2', // cyan-600
  },
  
  // Cores de categoria para skills
  category: {
    backend: '#60a5fa', // blue
    frontend: '#22d3ee', // cyan
    cloud: '#f59e0b', // amber
    tools: '#10b981', // emerald
    ai: '#8b5cf6', // violet
    games: '#ef4444', // red
    security: '#10b981', // emerald
  },
  
  // Gradientes de background
  gradients: {
    main: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    primary: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
    card: {
      primary: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%)',
      secondary: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%)',
    }
  },
  
  // Cores de background
  background: {
    default: '#0f0f0f',
    paper: '#1a1a1a',
    card: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Cores de texto
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
  },
  
  // Cores de status
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

// Funções utilitárias para cores
export const colorUtils = {
  // Gera gradiente para cards baseado na cor
  getCardGradient: (color: string, opacity: number = 10) => 
    `linear-gradient(135deg, ${color}${opacity} 0%, ${color}05 100%)`,
  
  // Gera cor de borda com transparência
  getBorderColor: (color: string, opacity: number = 20) => 
    `${color}${opacity}`,
  
  // Gera cor de sombra com transparência
  getShadowColor: (color: string, opacity: number = 20) => 
    `${color}${opacity}`,
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
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: colors.gradients.card.primary,
          border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "32px",
          "&.hover-card": {
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          },
        },
      },
    },
  },
}); 