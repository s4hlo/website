import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

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
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ 
        height: 'var(--navbar-height)', 
        width: '100%', 
        px: 4,
        minHeight: 'var(--navbar-height) !important',
        maxHeight: 'var(--navbar-height)'
      }}>
        {/* Left side - S4hlo branding */}
        <Typography
          variant="h4"
          component={Link}
          to="/"
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
            to="/"
            variant={isActive('/') ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/') ? 'white' : '#60a5fa',
              backgroundColor: isActive('/') ? '#60a5fa' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/') ? '#4f8be8' : 'rgba(96, 165, 250, 0.1)',
              },
            }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/3d-world"
            variant={isActive('/3d-world') ? 'contained' : 'outlined'}
            color="secondary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/3d-world') ? 'white' : '#22d3ee',
              backgroundColor: isActive('/3d-world') ? '#22d3ee' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/3d-world') ? '#1ba1c1' : 'rgba(34, 211, 238, 0.1)',
              },
            }}
          >
            3D World
          </Button>
          <Button
            component={Link}
            to="/3d-playground"
            variant={isActive('/3d-playground') ? 'contained' : 'outlined'}
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/3d-playground') ? 'white' : '#8b5cf6',
              backgroundColor: isActive('/3d-playground') ? '#8b5cf6' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/3d-playground') ? '#7c3aed' : 'rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            3D Playground
          </Button>
          <Button
            component={Link}
            to="/3d-cubes"
            variant={isActive('/3d-cubes') ? 'contained' : 'outlined'}
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/3d-cubes') ? 'white' : '#f59e0b',
              backgroundColor: isActive('/3d-cubes') ? '#f59e0b' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/3d-cubes') ? '#d97706' : 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            3D Cubes
          </Button>

          <Button
            component={Link}
            to="/resume"
            variant={isActive('/resume') ? 'contained' : 'outlined'}
            color="success"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/resume') ? 'white' : '#10b981',
              backgroundColor: isActive('/resume') ? '#10b981' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/resume') ? '#059669' : 'rgba(16, 185, 129, 0.1)',
              },
            }}
          >
            Resume
          </Button>
          <Button
            component={Link}
            to="/rhythm-game"
            variant={isActive('/rhythm-game') ? 'contained' : 'outlined'}
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/rhythm-game') ? 'white' : '#ec4899',
              backgroundColor: isActive('/rhythm-game') ? '#ec4899' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/rhythm-game') ? '#db2777' : 'rgba(236, 72, 153, 0.1)',
              },
            }}
          >
            Rhythm Game
          </Button>
          <Button
            component={Link}
            to="/github"
            variant={isActive('/github') ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              minWidth: '100px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isActive('/github') ? 'white' : '#60a5fa',
              backgroundColor: isActive('/github') ? '#60a5fa' : 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isActive('/github') ? '#4f8be8' : 'rgba(96, 165, 250,0.1)',
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