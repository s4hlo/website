import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import GitHubCalendar from "react-github-calendar";

const portfolioDarkTheme = {
  dark: [ "#172A3A", "#0D505E", "#1D8383", "#39C1AD", "#4DFFE2" ],
}
const GitHubContributions: React.FC = () => {
  const username = "s4hlo";

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <CalendarToday sx={{ fontSize: 28, color: "#22d3ee", mr: 2 }} />
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, color: "#22d3ee" }}
        >
          GitHub Contributions
        </Typography>
      </Box>

      {/* GitHub Calendar */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
                       "& .react-activity-calendar": {
               "& .calendar-day": {
                 '&[data-level="0"]': { fill: "#0d1117" },
                 '&[data-level="1"]': { fill: "#0c2d6b" },
                 '&[data-level="2"]': { fill: "#1f6feb" },
                 '&[data-level="3"]': { fill: "#58a6ff" },
                 '&[data-level="4"]': { fill: "#79c0ff" },
               },
             },
        }}
      >
        <GitHubCalendar
          username={username}
          colorScheme="dark"
          fontSize={11}
          blockSize={14}
          blockMargin={4}
          theme={portfolioDarkTheme}
          hideColorLegend={false}
          showWeekdayLabels={false}
          labels={{
            totalCount: "{{count}} contributions in the last year",
            legend: {
              less: "Less",
              more: "More",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default GitHubContributions;
