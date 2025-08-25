import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { colors } from "../../theme";
import type { MidiAnalysis } from "../../songs/sampleOne";

interface OctaveHeatmapProps {
  midiAnalysis: MidiAnalysis;
}

export const OctaveHeatmap: React.FC<OctaveHeatmapProps> = ({ midiAnalysis }) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 4, 
        mb: 4, 
        background: colors.gradients.card.primary,
        borderRadius: 3,
        border: `1px solid ${colors.primary.main}20`
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          Distribuição de Notas por Oitava
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary,
            fontSize: '0.9rem',
            opacity: 0.8
          }}
        >
          Total: <strong>{midiAnalysis.totalNotes}</strong> notas
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2, 
        mb: 4,
        flexWrap: 'wrap'
      }}>
        {midiAnalysis.octaveStats.map((stat) => (
          <Box
            key={stat.octave}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              minWidth: 50,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 100,
                border: `2px solid ${colors.primary.main}40`,
                borderRadius: '8px',
                position: 'relative',
                boxShadow: `0 4px 12px ${colors.primary.main}20`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${colors.primary.main}30`,
                }
              }}
            >
              {/* Barra de porcentagem */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${Math.min(stat.percentage * 1.4, 100)}%`,
                  background: `linear-gradient(to top, ${colors.primary.main}, ${colors.primary.main}80)`,
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease',
                }}
              />
              
              {/* Número da oitava */}
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
                fontWeight: 500,
                fontSize: '0.75rem',
                opacity: 0.9,
                mt: 0.5
              }}
            >
              {stat.percentage.toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ 
        textAlign: "center", 
        p: 2, 
        background: colors.primary.main + '10',
        borderRadius: 2,
        border: `1px solid ${colors.primary.main}20`
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary,
            fontWeight: 500
          }}
        >
          🎵 Oitavas disponíveis: <strong>{midiAnalysis.minOctave}</strong> - <strong>{midiAnalysis.maxOctave}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};
