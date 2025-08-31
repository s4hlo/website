import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  Code,
  Web,
  Cloud,
  Psychology,
  Gamepad,
  Security,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { EXPERTISE_DATA } from '../../data/expertise';

const ExpertiseSection = () => {
  const iconMap = {
    Code: <Code />,
    Web: <Web />,
    Cloud: <Cloud />,
    Psychology: <Psychology />,
    Gamepad: <Gamepad />,
    Security: <Security />,
  };

  const getColor = (colorKey: string) => {
    return (
      colors.category[colorKey as keyof typeof colors.category] ||
      colors.primary.main
    );
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}
      >
        {EXPERTISE_DATA.title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
        }}
      >
        {EXPERTISE_DATA.features.map((feature, index) => (
          <Box key={index}>
            <Paper
              className="hover-card"
              sx={{
                height: '100%',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getColor(feature.color)} 0%, ${getColor(feature.color)}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {React.cloneElement(
                    iconMap[feature.icon as keyof typeof iconMap],
                    {
                      sx: { fontSize: 40, color: 'white' },
                    },
                  )}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: getColor(feature.color),
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ExpertiseSection;
