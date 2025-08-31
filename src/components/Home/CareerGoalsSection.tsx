import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { colors } from '../../theme';
import { CAREER_GOALS_DATA } from '../../data/career-goals';

const CareerGoalsSection = () => {
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
        {CAREER_GOALS_DATA.title}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}
      >
        {CAREER_GOALS_DATA.subtitle}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
        }}
      >
        {CAREER_GOALS_DATA.goals.map((goal, index) => (
          <Paper
            key={goal.title}
            className="hover-card"
            sx={{
              height: '100%',
              '&:hover': {
                borderColor: `${getColor(goal.color)}40`,
                boxShadow: `0 8px 25px ${getColor(goal.color)}20`,
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getColor(goal.color)} 0%, ${getColor(goal.color)}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ color: 'white', fontWeight: 700 }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 600, color: getColor(goal.color), mb: 2 }}
              >
                {goal.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {goal.period}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {goal.goals.map((goalText, goalIndex) => (
                <Box
                  key={goalIndex}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getColor(goal.color),
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {goalText}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CareerGoalsSection;
