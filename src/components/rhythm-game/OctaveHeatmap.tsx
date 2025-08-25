import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { colors } from "../../theme";
import type { MidiAnalysis } from "../../songs/sampleOne";

interface OctaveHeatmapProps {
  midiAnalysis: MidiAnalysis;
}

export const OctaveHeatmap: React.FC<OctaveHeatmapProps> = ({
  midiAnalysis,
}) => {
  return (
    <>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          Oitavas
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
            fontSize: "0.9rem",
            opacity: 0.8,
          }}
        >
          <strong>{midiAnalysis.totalNotes}</strong> notas
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
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
              minWidth: 35,
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 80,
                border: `1px solid ${colors.primary.main}40`,
                borderRadius: "4px",
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
                  background: `linear-gradient(to top, ${colors.primary.main}, ${colors.primary.main}80)`,
                  borderRadius: "2px 2px 0 0",
                }}
              />

              {/* Número da oitava */}
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: colors.text.primary,
                  fontWeight: 600,
                  fontSize: "0.7rem",
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
                fontSize: "0.7rem",
                textAlign: "center",
              }}
            >
              {stat.percentage.toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};
