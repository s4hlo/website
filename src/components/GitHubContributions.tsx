import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import GitHubCalendar from 'react-github-calendar';
import { colors, colorUtils } from '../theme';

const portfolioDarkTheme = {
  dark: [
    colors.github.dark,
    colors.github.dark2,
    colors.github.dark3,
    colors.github.teal,
    colors.github.bright_teal,
  ],
};

const GitHubContributions: React.FC = () => {
  const username = 's4hlo';
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <Paper
      sx={{
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <CalendarToday
          sx={{ fontSize: 28, color: colors.secondary.light, mr: 2 }}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, color: colors.secondary.light }}
        >
          GitHub Contributions
        </Typography>
      </Box>

      {/* GitHub Calendar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 3,
          borderRadius: 2,
        }}
      >
        <GitHubCalendar
          username={username}
          year={selectedYear}
          colorScheme="dark"
          fontSize={11}
          blockSize={14}
          blockMargin={4}
          theme={portfolioDarkTheme}
          hideColorLegend={false}
          showWeekdayLabels={false}
          labels={{
            totalCount: '{{count}} contributions in ' + selectedYear,
            legend: {
              less: 'Less',
              more: 'More',
            },
          }}
        />

        {/* Year Selector - Vertical Stack */}
        <Stack direction="column" spacing={1}>
          {years.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedYear(year)}
              sx={{
                minWidth: '45px',
                height: '32px',
                borderColor: colorUtils.getBorderColor(colors.pure.white),
                color:
                  selectedYear === year
                    ? colors.pure.white
                    : colors.secondary.light,
                backgroundColor:
                  selectedYear === year
                    ? colors.secondary.light
                    : 'transparent',
                fontSize: '0.75rem',
                '&:hover': {
                  borderColor: colorUtils.getBorderColor(colors.pure.white, 40),
                  backgroundColor:
                    selectedYear === year
                      ? colors.threeD.dark_blue_gray
                      : colorUtils.getBorderColor(colors.secondary.light),
                },
              }}
            >
              {year}
            </Button>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default GitHubContributions;
