import React, { useState } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import GitHubCalendar from "react-github-calendar";


const portfolioDarkTheme = {
  dark: ["#172A3A", "#0D505E", "#1D8383", "#39C1AD", "#4DFFE2"],
};
const GitHubContributions: React.FC = () => {
  const username = "s4hlo";
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <Paper
      sx={{
        mb: 4,
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
          alignItems: "flex-start",
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
            totalCount: "{{count}} contributions in " + selectedYear,
            legend: {
              less: "Less",
              more: "More",
            },
          }}
        />

        {/* Year Selector - Vertical Stack */}
        <Stack direction="column" spacing={1}>
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedYear(year)}
              sx={{
                minWidth: "45px",
                height: "32px",
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: selectedYear === year ? "white" : "#22d3ee",
                backgroundColor:
                  selectedYear === year ? "#22d3ee" : "transparent",
                fontSize: "0.75rem",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  backgroundColor:
                    selectedYear === year
                      ? "#1ba1c1"
                      : "rgba(34, 211, 238, 0.1)",
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
