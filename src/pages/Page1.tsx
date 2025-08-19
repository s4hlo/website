import { Box, Typography, Container } from '@mui/material';

const Page1 = () => {
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        mt: 0
      }}
    >
      <Box sx={{ 
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Page 1
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          This is the first additional page
        </Typography>
      </Box>
    </Container>
  );
};

export default Page1; 