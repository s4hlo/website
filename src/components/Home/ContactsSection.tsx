import { Box, Typography } from '@mui/material';
import { colors } from '../../theme';
import { CONTACTS_DATA } from '../../data/contacts';
import { WebsiteChipLink } from '../WebsiteChipLink';

const ContactsSection = () => {
  return (
    <Box sx={{ mb: 8 }}>

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
