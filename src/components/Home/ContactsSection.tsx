import { Box, Typography, Tooltip } from '@mui/material';
import { colors, colorUtils } from '../../theme';
import { CONTACTS_DATA } from '../../data/contacts';
import * as SiIcons from 'react-icons/si';
import { VscFilePdf } from 'react-icons/vsc';
import { WebsiteChipLink } from '../WebsiteChipLink';

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
          <WebsiteChipLink key={contact.name} tool={contact} />
        ))}
      </Box>
    </Box>
  );
};

export default ContactsSection;
