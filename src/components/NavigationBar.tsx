import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ROUTES } from '../constants/routes';
import { colors } from '../theme';

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        top: 0,
        height: 'var(--navbar-height)',
        background: colors.gradients.main,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          height: 'var(--navbar-height)',
          width: '100%',
          px: 4,
          minHeight: 'var(--navbar-height) !important',
          maxHeight: 'var(--navbar-height)',
        }}
      >
        {/* Left side - S4hlo branding */}
        <Typography
          variant="h4"
          component={Link}
          to={ROUTES.HOME}
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #93c5fd 0%, #67e8f9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
            transition: 'all 0.3s ease',
          }}
        >
          S4hlo
        </Typography>

        {/* Right side - Navigation buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to={ROUTES.HOME}
            variant={isActive(ROUTES.HOME) ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.HOME) ? 'white' : '#60a5fa',
              backgroundColor: isActive(ROUTES.HOME)
                ? '#60a5fa'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.HOME)
                  ? '#4f8be8'
                  : 'rgba(96, 165, 250, 0.1)',
              },
            }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to={ROUTES.THREE_D.MUSEUM}
            variant={isActive(ROUTES.THREE_D.MUSEUM) ? 'contained' : 'outlined'}
            color="secondary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.THREE_D.MUSEUM) ? 'white' : '#22d3ee',
              backgroundColor: isActive(ROUTES.THREE_D.MUSEUM)
                ? '#22d3ee'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.THREE_D.MUSEUM)
                  ? '#1ba1c1'
                  : 'rgba(34, 211, 238, 0.1)',
              },
            }}
          >
            3D Museum
          </Button>
          <Button
            component={Link}
            to={ROUTES.THREE_D.PLAYGROUND}
            variant={
              isActive(ROUTES.THREE_D.PLAYGROUND) ? 'contained' : 'outlined'
            }
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.THREE_D.PLAYGROUND) ? 'white' : '#8b5cf6',
              backgroundColor: isActive(ROUTES.THREE_D.PLAYGROUND)
                ? '#8b5cf6'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.THREE_D.PLAYGROUND)
                  ? '#7c3aed'
                  : 'rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            3D Playground
          </Button>
          <Button
            component={Link}
            to={ROUTES.THREE_D.CUBES}
            variant={isActive(ROUTES.THREE_D.CUBES) ? 'contained' : 'outlined'}
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.THREE_D.CUBES) ? 'white' : '#f59e0b',
              backgroundColor: isActive(ROUTES.THREE_D.CUBES)
                ? '#f59e0b'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.THREE_D.CUBES)
                  ? '#d97706'
                  : 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            3D Cubes
          </Button>

          <Button
            component={Link}
            to={ROUTES.RESUME}
            variant={isActive(ROUTES.RESUME) ? 'contained' : 'outlined'}
            color="success"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.RESUME) ? 'white' : '#10b981',
              backgroundColor: isActive(ROUTES.RESUME)
                ? '#10b981'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.RESUME)
                  ? '#059669'
                  : 'rgba(16, 185, 129, 0.1)',
              },
            }}
          >
            Resume
          </Button>
          <Button
            component={Link}
            to={ROUTES.RHYTHM_GAME}
            variant={isActive(ROUTES.RHYTHM_GAME) ? 'contained' : 'outlined'}
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.RHYTHM_GAME) ? 'white' : '#ec4899',
              backgroundColor: isActive(ROUTES.RHYTHM_GAME)
                ? '#ec4899'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.RHYTHM_GAME)
                  ? '#db2777'
                  : 'rgba(236, 72, 153, 0.1)',
              },
            }}
          >
            Rhythm Game
          </Button>
          <Button
            component={Link}
            to={ROUTES.GITHUB}
            variant={isActive(ROUTES.GITHUB) ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive(ROUTES.GITHUB) ? 'white' : '#60a5fa',
              backgroundColor: isActive(ROUTES.GITHUB)
                ? '#60a5fa'
                : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive(ROUTES.GITHUB)
                  ? '#4f8be8'
                  : 'rgba(96, 165, 250,0.1)',
              },
            }}
          >
            GitHub
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
