import { Box, Typography, Paper } from '@mui/material';
import { Speed, Security, Architecture } from '@mui/icons-material';

const WhyChooseMeSection = () => {
  return (
    <Box sx={{ mb: 8 }}>
      <Paper>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}
        >
          Why Choose Me?
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Speed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Performance First
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Otimização de performance, lazy loading e arquitetura escalável
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Security sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Security Expert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistemas de autenticação robustos e práticas de segurança
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Architecture sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Clean Architecture
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Código limpo, padrões de design e arquitetura escalável
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default WhyChooseMeSection;
