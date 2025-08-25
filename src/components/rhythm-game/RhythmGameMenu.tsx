import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { PlayArrow, Delete, FileUpload } from "@mui/icons-material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { colors, colorUtils } from "../../theme";
import { OctaveHeatmap } from "./OctaveHeatmap";

import type { Song } from "../../types/rhythm-game";
import type { MidiAnalysis } from "../../songs/sampleOne";

interface RhythmGameMenuProps {
  selectedSong: Song;
  midiFileName: string;
  midiAnalysis: MidiAnalysis | null;
  showOctaveSelection: boolean;
  isConverting: boolean;
  minOctave: number;
  maxOctave: number;
  onMidiUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetMidi: () => void;
  onMinOctaveChange: (value: number) => void;
  onMaxOctaveChange: (value: number) => void;
  onConvertMidi: () => void;
  onStartGame: () => void;
}

export const RhythmGameMenu: React.FC<RhythmGameMenuProps> = ({
  selectedSong,
  midiFileName,
  midiAnalysis,
  showOctaveSelection,
  isConverting,
  minOctave,
  maxOctave,
  onMidiUpload,
  onResetMidi,
  onMinOctaveChange,
  onMaxOctaveChange,
  onConvertMidi,
  onStartGame,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.gradients.main,
        backgroundAttachment: "fixed",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
            textAlign: "center",
          }}
        >
          {/* Título Principal */}
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              backgroundClip: "text",
              background: colors.gradients.primary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", md: "3rem" },
              mb: 2,
            }}
          >
            Rhythm Game
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Use D F J K keys to play! Test your rhythm and timing skills with 4
            lanes.
          </Typography>

          {/* Layout em duas colunas mais compactas */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              maxWidth: 1000,
              mx: "auto",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Coluna Esquerda - Música Padrão */}
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 3,
                  background: colors.gradients.card.primary,
                  border: `1px solid ${colorUtils.getBorderColor(
                    colors.primary.main
                  )}`,
                  borderRadius: 2,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
                >
                  Música Padrão
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    color: colors.text.secondary,
                  }}
                >
                  Jogue com a música de exemplo incluída no jogo
                </Typography>

                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    background: colors.primary.main + "10",
                    borderRadius: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedSong.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.text.secondary }}
                  >
                    {selectedSong.notes.length} notas • Música clássica
                  </Typography>
                </Box>

                <Tooltip title="Jogar Música Padrão" placement="top">
                  <IconButton
                    onClick={onStartGame}
                    sx={{
                      background: colors.primary.main,
                      color: "white",
                      borderRadius: "8px",
                      padding: "12px",
                      transition: "all 0.3s ease",
                      width: "100%",
                      height: "48px",
                      "&:hover": {
                        background: colors.primary.dark,
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <PlayArrow sx={{ fontSize: "24px" }} />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Box>

            {/* Coluna Direita - Upload MIDI */}
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 3,
                  background: colors.gradients.card.primary,
                  border: `1px solid ${colorUtils.getBorderColor(
                    colors.primary.main
                  )}`,
                  borderRadius: 2,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
                >
                  Upload de Arquivo
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    color: colors.text.secondary,
                  }}
                >
                  Faça upload de um arquivo MIDI para criar sua própria música
                </Typography>

                {/* Upload Section - Botões lado a lado */}
                <Box sx={{ mb: 2 }}>
                  <input
                    ref={(input) => {
                      if (input) input.style.display = "none";
                    }}
                    type="file"
                    accept=".mid,.midi"
                    onChange={onMidiUpload}
                    id="midi-upload"
                  />

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Tooltip title="Upload de arquivo MIDI" placement="top">
                      <IconButton
                        onClick={() => {
                          const fileInput = document.getElementById(
                            "midi-upload"
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.click();
                        }}
                        sx={{
                          background: colors.secondary?.main || "#6b7280",
                          color: "white",
                          borderRadius: "8px",
                          padding: "10px",
                          flex: 1,
                          height: "40px",
                          "&:hover": {
                            background: colors.secondary?.dark || "#4b5563",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        <FileUpload sx={{ fontSize: "20px" }} />
                      </IconButton>
                    </Tooltip>

                    {midiFileName && (
                      <Tooltip title="Limpar arquivo" placement="top">
                        <IconButton
                          onClick={onResetMidi}
                          sx={{
                            background: "#ef4444",
                            color: "white",
                            borderRadius: "8px",
                            padding: "10px",
                            height: "40px",
                            minWidth: "40px",
                            "&:hover": {
                              background: "#dc2626",
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <Delete sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {midiFileName && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.0,
                      borderRadius: 1.5,
                      background: colors.primary.main + "10",
                      display: "flex",
                      justifyContent: "center", 
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <AudioFileIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {midiFileName}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Heatmap de Oitavas - Aparece após upload do MIDI */}
                {showOctaveSelection && midiAnalysis && (
                  <Box sx={{ mb: 2 }}>
                    {/* Coluna Esquerda - Heatmap */}
                    <Box sx={{ flex: 1 }}>
                      <OctaveHeatmap midiAnalysis={midiAnalysis} />
                    </Box>

                    {/* Coluna Direita - Seleção de intervalo de oitavas */}
                    <Box sx={{ flex: 1 }}>
                      {/* Linha única com seletores e botão */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            background: colors.primary.main + "10",
                            borderRadius: 2,
                            p: 1,
                            flex: 1,
                          }}
                        >
                          {/* Seletor MIN */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: colors.text.secondary,
                              }}
                            >
                              MIN
                            </Typography>
                            <Box
                              sx={{
                                width: "50px",
                                height: "32px",
                                border: `1px solid ${colors.primary.main}`,
                                borderRadius: "6px",
                                background: colors.gradients.card.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: colors.text.primary,
                                transition: "background 0.2s",
                                "&:hover": {
                                  background: colors.primary.main + "20",
                                },
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                if (e.button === 0 && minOctave < maxOctave) {
                                  onMinOctaveChange(minOctave + 1);
                                } else if (
                                  e.button === 2 &&
                                  minOctave > midiAnalysis.minOctave
                                ) {
                                  onMinOctaveChange(minOctave - 1);
                                }
                              }}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              {minOctave}
                            </Box>
                          </Box>

                          {/* Seletor MAX */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: colors.text.secondary,
                              }}
                            >
                              MAX
                            </Typography>
                            <Box
                              sx={{
                                width: "50px",
                                height: "32px",
                                border: `1px solid ${colors.primary.main}`,
                                borderRadius: "6px",
                                background: colors.gradients.card.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: colors.text.primary,
                                transition: "background 0.2s",
                                "&:hover": {
                                  background: colors.primary.main + "20",
                                },
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                if (
                                  e.button === 0 &&
                                  maxOctave < midiAnalysis.maxOctave
                                ) {
                                  onMaxOctaveChange(maxOctave + 1);
                                } else if (
                                  e.button === 2 &&
                                  maxOctave > minOctave
                                ) {
                                  onMaxOctaveChange(maxOctave - 1);
                                }
                              }}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              {maxOctave}
                            </Box>
                          </Box>
                        </Box>
                        {/* Botão de conversão */}
                        <Button
                          onClick={onConvertMidi}
                          disabled={isConverting}
                          size="small"
                          sx={{
                            background: colors.primary.main,
                            color: "white",
                            borderRadius: "8px",
                            px: 3,
                            py: 1,
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            height: "70px",
                            minWidth: "100px",
                            transition: "background 0.3s, transform 0.2s",
                            "&:hover": {
                              background: colors.primary.dark,
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          {isConverting ? "Convertendo..." : "Converter"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Música convertida - Aparece após conversão */}
                {!showOctaveSelection &&
                  midiFileName &&
                  selectedSong.name !== "cantabile_in_C_grand" && (
                    <Box sx={{ mb: 2 }}>
                      <Tooltip title="Jogar Música Convertida" placement="top">
                        <IconButton
                          onClick={onStartGame}
                          sx={{
                            background: colors.secondary?.main || "#6b7280",
                            color: "white",
                            borderRadius: "8px",
                            padding: "12px",
                            transition: "all 0.3s ease",
                            width: "100%",
                            height: "48px",
                            "&:hover": {
                              background: colors.secondary?.dark || "#4b5563",
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <PlayArrow sx={{ fontSize: "24px" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
