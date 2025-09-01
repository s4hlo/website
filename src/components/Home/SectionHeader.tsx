import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { colors } from '../../theme';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconColor?: string;
}

const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ mr: 2, color: colors.category.cyan, fontSize: 32 }}>
          {icon}
        </Box>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            color: colors.pure.white,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: 800,
          mx: 'auto',
          opacity: 0.8,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
