import { Box, Typography, Tooltip } from '@mui/material';
import { colors, colorUtils } from '../../theme';
import { CONTACTS_DATA } from '../../data/contacts';
import * as SiIcons from 'react-icons/si';

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
                                  gap: 3,
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
              component="a"
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-card"
              sx={{
                p: 3,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 20)}`,
                background: colors.gradients.card.primary,
                borderRadius: 3,
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${colorUtils.getBorderColor(colors.pure.black, 40)}`,
                  borderColor: colorUtils.getBorderColor(colors.pure.white, 40),
                  background: colors.gradients.card.cyan,
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
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colorUtils.getBorderColor(getColor(contact.color || 'blue'), 20)} 0%, ${colorUtils.getBorderColor(getColor(contact.color || 'blue'), 10)} 100%)`,
                  border: `1px solid ${colorUtils.getBorderColor(getColor(contact.color || 'blue'), 30)}`,
                  p: 1.5,
                  mb: 2,
                  boxShadow: `0 4px 15px ${colorUtils.getBorderColor(getColor(contact.color || 'blue'), 30)}`,
                  color: getColor(contact.color || 'blue'),
                }}
              >
                {getIcon(contact)}
              </Box>

              <Typography
                variant="subtitle1"
                component="h4"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.2,
                }}
              >
                {contact.name}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default ContactsSection;
