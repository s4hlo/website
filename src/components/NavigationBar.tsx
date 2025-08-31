import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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
    <AppBar position="fixed" elevation={0}>
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
    </AppBar>
  );
};

export default NavigationBar;
