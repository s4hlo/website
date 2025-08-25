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
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            textAlign: "center",
          }}
        >
          {/* Título Principal */}
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              backgroundClip: "text",
              background: colors.gradients.primary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "3rem", md: "4rem" },
              mb: 2,
            }}
          >
            Rhythm Game
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Use D F J K keys to play! Test your rhythm and timing skills with 4
            lanes.
          </Typography>

          {/* Layout em duas colunas */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              maxWidth: 1200,
              mx: "auto",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Coluna Esquerda - Música Padrão */}
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 4,
                  background: colors.gradients.card.primary,
                  border: `1px solid ${colorUtils.getBorderColor(
                    colors.primary.main
                  )}`,
                  borderRadius: 3,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
                >
                  Música Padrão
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                  Jogue com a música de exemplo incluída no jogo
                </Typography>

                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    background: colors.primary.main + "10",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
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
                      borderRadius: "12px",
                      padding: "16px",
                      fontSize: "24px",
                      transition: "all 0.3s ease",
                      width: "100%",
                      height: "60px",
                      "&:hover": {
                        background: colors.primary.dark,
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <PlayArrow sx={{ fontSize: "28px" }} />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Box>

            {/* Coluna Direita - Upload MIDI */}
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 4,
                  background: colors.gradients.card.primary,
                  border: `1px solid ${colorUtils.getBorderColor(
                    colors.primary.main
                  )}`,
                  borderRadius: 3,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
                >
                  Upload de Arquivo
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                  Faça upload de um arquivo MIDI para criar sua própria música
                </Typography>

                {/* Upload Section */}
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
                      borderRadius: "12px",
                      padding: "16px",
                      fontSize: "24px",
                      transition: "all 0.3s ease",
                      width: "100%",
                      height: "60px",
                      marginBottom: "8px",
                      "&:hover": {
                        background: colors.secondary?.dark || "#4b5563",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <FileUpload sx={{ fontSize: "28px" }} />
                  </IconButton>

                  {midiFileName && (
                    <IconButton
                      onClick={onResetMidi}
                      sx={{
                        background: "#ef4444",
                        color: "white",
                        borderRadius: "12px",
                        padding: "12px",
                        fontSize: "20px",
                        transition: "all 0.3s ease",
                        width: "100%",
                        height: "50px",
                        "&:hover": {
                          background: "#dc2626",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <Delete sx={{ fontSize: "24px" }} />
                    </IconButton>
                  )}
                </Box>

                {/* Arquivo selecionado */}
                {midiFileName && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      background: colors.secondary?.main + "20",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Arquivo selecionado:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.text.secondary }}
                    >
                      {midiFileName}
                    </Typography>
                  </Box>
                )}

                {/* Heatmap de Oitavas - Aparece após upload do MIDI */}
                {showOctaveSelection && midiAnalysis && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, textAlign: "center", fontSize: "1rem" }}
                    >
                      Análise das Oitavas
                    </Typography>

                    {/* Layout em duas colunas: Heatmap + Seleção de oitavas */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      {/* Coluna Esquerda - Heatmap */}
                      <Box sx={{ flex: 1 }}>
                        <OctaveHeatmap midiAnalysis={midiAnalysis} />
                      </Box>

                      {/* Coluna Direita - Seleção de intervalo de oitavas */}
                      <Box sx={{ flex: 1 }}>
                        <Paper
                          sx={{
                            p: 2,
                            background: colors.gradients.card.primary,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              textAlign: "center",
                              fontSize: "0.9rem",
                            }}
                          >
                            Escolha o intervalo:
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ mb: 0.5, fontSize: "0.8rem" }}
                              >
                                Mínima
                              </Typography>
                              <input
                                type="number"
                                min={midiAnalysis.minOctave}
                                max={midiAnalysis.maxOctave}
                                value={minOctave}
                                onChange={(e) =>
                                  onMinOctaveChange(parseInt(e.target.value))
                                }
                                style={{
                                  width: "50px",
                                  padding: "4px",
                                  borderRadius: "4px",
                                  border: `1px solid ${colors.primary.main}`,
                                  background: colors.gradients.card.primary,
                                  color: colors.text.primary,
                                  textAlign: "center",
                                  fontSize: "12px",
                                }}
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ mb: 0.5, fontSize: "0.8rem" }}
                              >
                                Máxima
                              </Typography>
                              <input
                                type="number"
                                min={midiAnalysis.minOctave}
                                max={midiAnalysis.maxOctave}
                                value={maxOctave}
                                onChange={(e) =>
                                  onMaxOctaveChange(parseInt(e.target.value))
                                }
                                style={{
                                  width: "50px",
                                  padding: "4px",
                                  borderRadius: "4px",
                                  border: `1px solid ${colors.primary.main}`,
                                  background: colors.gradients.card.primary,
                                  color: colors.text.primary,
                                  textAlign: "center",
                                  fontSize: "12px",
                                }}
                              />
                            </Box>
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              textAlign: "center",
                              color: colors.text.secondary,
                              mb: 1,
                              fontSize: "0.75rem",
                            }}
                          >
                            Recomendado: {midiAnalysis.recommendedMinOctave} -{" "}
                            {midiAnalysis.recommendedMaxOctave}
                          </Typography>

                          {/* Botão de conversão */}
                          <Button
                            onClick={onConvertMidi}
                            disabled={isConverting}
                            sx={{
                              background: colors.primary.main,
                              color: "white",
                              borderRadius: "8px",
                              px: 3,
                              py: 1.5,
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: 0.5,
                              width: "100%",
                              height: "48px",
                              transition: "background 0.3s, transform 0.2s",
                              "&:hover": {
                                background: colors.primary.dark,
                                transform: "scale(1.02)",
                              },
                            }}
                          >
                            {isConverting ? "Convertendo..." : "Converter"}
                          </Button>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Música convertida - Aparece após conversão */}
                {!showOctaveSelection &&
                  midiFileName &&
                  selectedSong.name !== "cantabile_in_C_grand" && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          color: colors.primary.main,
                        }}
                      >
                        Música convertida com sucesso!
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ mb: 2, textAlign: "center" }}
                      >
                        {selectedSong.name} - {selectedSong.notes.length} notas
                      </Typography>

                      <IconButton
                        onClick={onStartGame}
                        sx={{
                          background: colors.secondary?.main || "#6b7280",
                          color: "white",
                          borderRadius: "12px",
                          padding: "16px",
                          fontSize: "24px",
                          transition: "all 0.3s ease",
                          width: "100%",
                          height: "60px",
                          "&:hover": {
                            background: colors.secondary?.dark || "#4b5563",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        <PlayArrow sx={{ fontSize: "28px" }} />
                      </IconButton>
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
