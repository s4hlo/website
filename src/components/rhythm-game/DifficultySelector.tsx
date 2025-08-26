import React from "react";
import { IconButton } from "@mui/material";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { colors } from "../../theme";

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
    { value: "NORMAL", color: colors.status.warning },
    { value: "HARD", color: colors.status.error },
  ];

  return (
    <IconButton
      size="small"
      onClick={() => {
        const currentIndex = difficulties.findIndex(
          (d) => d.value === gameSpeed
        );
        const nextIndex = (currentIndex + 1) % difficulties.length;
        onGameSpeedChange(
          difficulties[nextIndex].value as "EASY" | "NORMAL" | "HARD"
        );
      }}
      sx={{
        py: 0.75,
        fontSize: "0.8rem",
        fontWeight: 600,
        minWidth: "100px",
        backgroundColor:
          difficulties.find((d) => d.value === gameSpeed)?.color || "#ff9800",
        color: "white",
        border: "none",
        borderRadius: "4px",
        "&:hover": {
          backgroundColor:
            difficulties.find((d) => d.value === gameSpeed)?.color || "#ff9800",
          opacity: 0.9,
        },
        transition: "all 0.2s ease",
      }}
    >
      <CachedOutlinedIcon />
      {difficulties.find((d) => d.value === gameSpeed)?.value}
    </IconButton>
  );
};
