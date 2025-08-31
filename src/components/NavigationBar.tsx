import { Link, useLocation } from 'react-router-dom';
import { Box, Toolbar, Typography, Button } from '@mui/material';
import { ROUTES } from '../constants/routes';
import { colors, colorUtils } from '../theme';

const NavigationButton = (props: {
  to: string;
  isActive: boolean;
  color: string;
  title: string;
}) => {
  return (
    <Button
      component={Link}
      to={props.to}
      variant={props.isActive ? 'contained' : 'outlined'}
      className="navbar-button"
      sx={{
        color: props.isActive ? colors.pure.white : props.color,
        backgroundColor: props.isActive ? props.color : 'transparent',
        '&:hover': {
          borderColor: colorUtils.getBorderColor(colors.pure.white, 0.4),
          color: props.isActive ? colors.pure.white : props.color,
          backgroundColor: props.isActive
            ? props.color
            : colorUtils.getBorderColor(props.color, 0.3),
        },
      }}
    >
      {props.title}
    </Button>
  );
};

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: '10%',
        right: '10%',
        width: 'auto',
        maxWidth: 1200,
        margin: '0 auto',
        borderRadius: '32px',
        background: colorUtils.getBorderColor(colors.pure.white, 8),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 15)}`,
        boxShadow: `0 8px 32px ${colorUtils.getBorderColor(colors.pure.black, 0.3)}`,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          px: 4,
          py: 1,
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
            background: colors.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            '&:hover': {
              background: colors.gradients.primary,
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
          <NavigationButton
            to={ROUTES.HOME}
            isActive={isActive(ROUTES.HOME)}
            color={colors.category.blue}
            title="Home"
          />
          <NavigationButton
            to={ROUTES.THREE_D.MUSEUM}
            isActive={isActive(ROUTES.THREE_D.MUSEUM)}
            color={colors.category.cyan}
            title="3D Museum"
          />
          <NavigationButton
            to={ROUTES.THREE_D.PLAYGROUND}
            isActive={isActive(ROUTES.THREE_D.PLAYGROUND)}
            color={colors.category.violet}
            title="3D Playground"
          />
          <NavigationButton
            to={ROUTES.THREE_D.CUBES}
            isActive={isActive(ROUTES.THREE_D.CUBES)}
            color={colors.category.orange}
            title="3D Cubes"
          />
          <NavigationButton
            to={ROUTES.RHYTHM_GAME}
            isActive={isActive(ROUTES.RHYTHM_GAME)}
            color={colors.category.magenta}
            title="Rhythm Game"
          />
        </Box>
      </Toolbar>
    </Box>
  );
};

export default NavigationBar;
