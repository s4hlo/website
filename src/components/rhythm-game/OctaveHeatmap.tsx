import React from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../../theme";
import type { MidiAnalysis } from "../../songs/sampleOne";

interface OctaveHeatmapProps {
  midiAnalysis: MidiAnalysis;
}

export const OctaveHeatmap: React.FC<OctaveHeatmapProps> = ({
  midiAnalysis,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        p: 1,
        pt: 2,
        borderRadius: 1.5,
        background: colors.primary.main + "10",
      }}
    >
      {midiAnalysis.octaveStats.map((stat) => (
        <Box
          key={stat.octave}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            flex: 1,
            minWidth: 0,
            px: 0.5,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 80,
              border: `1px solid ${colors.primary.main}40`,
              borderRadius: 2,
              position: "relative",
              boxShadow: `0 2px 6px ${colors.primary.main}20`,
            }}
          >
            {/* Barra de porcentagem */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${Math.min(stat.percentage * 1.4, 100)}%`,
                background: colors.primary.main,
                borderRadius: 2,
              }}
            />

            {/* Número da oitava */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                color: colors.text.primary,
              }}
            >
              {stat.octave}
            </Typography>
          </Box>

          {/* Porcentagem */}
          <Typography
            variant="caption"
            sx={{
              color: colors.primary.main,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {stat.percentage.toFixed(0)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
