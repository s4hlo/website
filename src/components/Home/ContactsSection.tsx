import { Box, Typography } from '@mui/material';
import { CONTACTS_DATA } from '../../data/contacts';
import { WebsiteChipLink } from '../WebsiteChipLink';

const ContactsSection = () => {
  return (
    <Box sx={{ mb: 4 }}>
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
        sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}
      >
        Encontre-me em diferentes plataformas e redes sociais
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          maxWidth: '100%',
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
