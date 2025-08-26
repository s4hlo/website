import React from "react";
import {
  Paper,
  IconButton,
} from "@mui/material";
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import { colors, colorUtils } from "../../theme";

interface DifficultySelectorProps {
  gameSpeed: "EASY" | "NORMAL" | "HARD";
  onGameSpeedChange: (speed: "EASY" | "NORMAL" | "HARD") => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  gameSpeed,
  onGameSpeedChange,
}) => {
  const difficulties = [
    { value: "EASY", color: colors.status.success },
    { value: "NORMAL", color: colors.status.warning},
    { value: "HARD", color: colors.status.error},
  ];

  return (
    <Paper
      sx={{
        p: 1.5,
        background: colors.gradients.card.secondary || colors.gradients.card.primary,
        border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
        borderRadius: 2,
        maxWidth: 200,
        mx: "auto",
        mb: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >

      <IconButton
        size="small"
        onClick={() => {
          const currentIndex = difficulties.findIndex(d => d.value === gameSpeed);
          const nextIndex = (currentIndex + 1) % difficulties.length;
          onGameSpeedChange(difficulties[nextIndex].value as "EASY" | "NORMAL" | "HARD");
        }}
        sx={{
          py: 0.75,
          fontSize: "0.8rem",
          fontWeight: 600,
          minWidth: "100px",
          backgroundColor: difficulties.find(d => d.value === gameSpeed)?.color || "#ff9800",
          color: "white",
          border: "none",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: difficulties.find(d => d.value === gameSpeed)?.color || "#ff9800",
            opacity: 0.9,
          },
          transition: "all 0.2s ease",
        }}
      >
        <CachedOutlinedIcon />
        {difficulties.find(d => d.value === gameSpeed)?.value}
      </IconButton>
    </Paper>
  );
};
