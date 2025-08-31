import { Box, Typography, Tooltip } from '@mui/material';
import { colors, colorUtils } from '../../theme';
import { CONTACTS_DATA } from '../../data/contacts';
import * as SiIcons from 'react-icons/si';
import { VscFilePdf } from 'react-icons/vsc';

const ContactsSection = () => {
  const getColor = (colorKey: string) => {
    const colorMap: { [key: string]: string } = {
      blue: colors.category.blue,
      cyan: colors.category.cyan,
      orange: colors.category.orange,
      red: colors.category.red,
      green: colors.category.light_green,
      purple: colors.category.violet,
      black: colors.pure.black,
      pink: colors.category.magenta,
      brown: colors.category.orange,
    };
    return colorMap[colorKey] || colors.primary.main;
  };

  const getIcon = (contact: {
    deviconSrc?: string;
    icon?: string;
    name: string;
  }) => {
    if (contact.deviconSrc) {
      return (
        <img
          src={contact.deviconSrc}
          alt={contact.name}
          style={{
            width: '35px',
            height: '35px',
          }}
        />
      );
    }
    if (contact.icon === 'VscFilePdf') {
      return <VscFilePdf size={35} />;
    }

    if (contact.icon) {
      const IconComponent = (SiIcons as any)[contact.icon];
      return IconComponent ? <IconComponent size={35} /> : null;
    }

    return null;
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}
      >
        Conecte-se Comigo
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 800, mx: 'auto' }}
      >
        Encontre-me em diferentes plataformas e redes sociais
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 0 },
        }}
      >
        {CONTACTS_DATA.map(contact => (
          <Tooltip
            key={contact.name}
            title={contact.name}
            placement="top"
            arrow
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  background: colorUtils.getBorderColor(colors.pure.white, 5),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                  width: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colorUtils.getBorderColor(colors.pure.white, 15)} 0%, ${colorUtils.getBorderColor(colors.pure.white, 8)} 100%)`,
                  border: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 25)}`,
                  p: 1.5,
                  mb: 1,
                  boxShadow: `0 2px 8px ${colorUtils.getBorderColor(colors.pure.black, 30)}`,
                  color: getColor(contact.color || 'blue'),
                }}
              >
                {getIcon(contact)}
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default ContactsSection;
