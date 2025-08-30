import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import { PlayArrow, Delete, FileUpload } from "@mui/icons-material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { colors, colorUtils } from "../../theme";
import { OctaveHeatmap } from "./OctaveHeatmap";
import { DifficultySelector } from "./DifficultySelector";

import type { Song } from "../../types/rhythm-game";
import { sampleSong, type MidiAnalysis } from "../../songs/sampleOne";

interface RhythmGameMenuProps {
  selectedSong: Song;
  midiFileName: string;
  midiAnalysis: MidiAnalysis | null;
  showOctaveSelection: boolean;
  isConverting: boolean;
  minOctave: number;
  maxOctave: number;
  gameSpeed: "EASY" | "NORMAL" | "HARD";
  onMidiUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetMidi: () => void;
  onMinOctaveChange: (value: number) => void;
  onMaxOctaveChange: (value: number) => void;
  onGameSpeedChange: (speed: "EASY" | "NORMAL" | "HARD") => void;
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
  gameSpeed,
  onMidiUpload,
  onResetMidi,
  onMinOctaveChange,
  onMaxOctaveChange,
  onGameSpeedChange,
  onConvertMidi,
  onStartGame,
}) => {
  return (
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
            fontSize: { xs: "3rem", md: "3.5rem" },
            mb: 3,
          }}
        >
          Rhythm Game
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6, fontSize: "1.1rem" }}
        >
          Use D F J K keys to play! Test your rhythm and timing skills with 4
          lanes.
        </Typography>

        <Box
          sx={{
            mb: 4,
            justifyContent: "flex-end",
            flexDirectiion: "column",
            alignItems: "right",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <DifficultySelector
              gameSpeed={gameSpeed}
              onGameSpeedChange={onGameSpeedChange}
            />
          </Box>

        {/* Layout em duas colunas mais compactas */}
        <Paper
          sx={{
            display: "flex",
            gap: 4,
            maxWidth: 1100,
            mx: "auto",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Coluna Esquerda - Música Padrão */}
          <Box
            sx={{
              flex: 1,
              minWidth: { md: "400px" },
              minHeight: { md: "400px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
            >
              Música Padrão
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                textAlign: "center",
                color: colors.text.secondary,
              }}
            >
              escolha uma música para jogar
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
              <Box
                sx={{
                  width: 280,
                  flexShrink: 0,
                  p: 2,
                  background: colors.primary.main + "10",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {sampleSong.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary }}
                  >
                    {sampleSong.notes.length} notas
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={onStartGame}
                sx={{
                  background: colors.primary.main,
                  color: "white",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  minWidth: "56px",
                  flex: 1,
                  "&:hover": {
                    background: colors.primary.dark,
                    transform: "scale(1.02)",
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Divider vertical entre as colunas */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
              borderColor: colors.primary.main + "30",
              borderWidth: "1px",
            }}
          />

          {/* Coluna Direita - Upload MIDI */}
          <Box
            sx={{
              flex: 1,
              minWidth: { md: "400px" },
              minHeight: { md: "400px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
            >
              Upload de Arquivo
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                textAlign: "center",
                color: colors.text.secondary,
              }}
            >
              Faça upload de um arquivo MIDI
            </Typography>

            {/* Upload Section - Botões lado a lado */}
            <Box>
              <input
                ref={(input) => {
                  if (input) input.style.display = "none";
                }}
                type="file"
                accept=".mid,.midi"
                onChange={onMidiUpload}
                id="midi-upload"
              />

              {/* Botão de upload sempre visível */}
              <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
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
                      borderRadius: "12px",
                      padding: "16px",
                      flex: 1,
                      height: "56px",
                      "&:hover": {
                        background: colors.secondary?.dark || "#4b5563",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <FileUpload sx={{ fontSize: "28px" }} />
                  </IconButton>
                </Tooltip>

                {midiFileName && (
                  <Tooltip title="Limpar arquivo" placement="top">
                    <IconButton
                      onClick={onResetMidi}
                      sx={{
                        background: "#ef4444",
                        color: "white",
                        borderRadius: "12px",
                        padding: "16px",
                        height: "56px",
                        minWidth: "56px",
                        "&:hover": {
                          background: "#dc2626",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <Delete sx={{ fontSize: "24px" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Dropzone embaixo do botão quando não há arquivo */}
              {!midiFileName && (
                <Box
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "midi-upload"
                    ) as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                  sx={{
                    border: `2px dashed ${colors.primary.main}40`,
                    borderRadius: "12px",
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    minHeight: "200px",
                    background: colors.primary.main + "08",
                    "&:hover": {
                      background: colors.primary.main + "10",
                    },
                  }}
                >
                  <FileUpload
                    sx={{
                      fontSize: "48px",
                      color: colors.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.primary.main,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Arraste e solte um arquivo MIDI
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.secondary,
                      mb: 2,
                    }}
                  >
                    ou clique para selecionar
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.secondary,
                      display: "block",
                    }}
                  >
                    Formatos aceitos: .mid, .midi
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Arquivo selecionado */}
            {midiFileName && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  background: colors.primary.main + "10",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <AudioFileIcon fontSize="medium" />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: "1rem" }}
                  >
                    {midiFileName}
                  </Typography>
                </Box>
              </Box>
            )}

            {midiAnalysis && (
              <Box sx={{ mb: 2 }}>
                {/* Coluna Esquerda - Heatmap */}
                <Box sx={{ flex: 1 }}>
                  <OctaveHeatmap midiAnalysis={midiAnalysis} />
                </Box>
              </Box>
            )}

            {/* Heatmap de Oitavas - Aparece após upload do MIDI */}
            {showOctaveSelection && (
              <Box sx={{ flex: 1 }}>
                {/* Linha única com seletores e botão */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
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
                      p: 2,
                      flex: 1,
                    }}
                  >
                    {/* Seletor MIN */}
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
                          midiAnalysis &&
                          minOctave > midiAnalysis.minOctave
                        ) {
                          onMinOctaveChange(minOctave - 1);
                        }
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {minOctave}
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        display: { xs: "none", md: "block" },
                        borderColor: colors.primary.main + "30",
                        borderWidth: "1px",
                      }}
                    />

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
                          midiAnalysis &&
                          maxOctave < midiAnalysis.maxOctave
                        ) {
                          onMaxOctaveChange(maxOctave + 1);
                        } else if (e.button === 2 && maxOctave > minOctave) {
                          onMaxOctaveChange(maxOctave - 1);
                        }
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {maxOctave}
                    </Box>
                  </Box>
                  {/* Botão de conversão */}
                  <Button
                    onClick={onConvertMidi}
                    disabled={isConverting}
                    size="small"
                    sx={{
                      background: colors.secondary?.main,
                      color: "white",
                      borderRadius: "8px",
                      px: 3,
                      py: 2,
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      minWidth: "100px",
                      height: "64px",
                      transition: "background 0.3s, transform 0.2s",
                      "&:hover": {
                        background: colors.secondary?.dark,
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {isConverting ? "Convertendo..." : "Converter"}
                  </Button>
                </Box>
              </Box>
            )}
            {!showOctaveSelection &&
              midiFileName &&
              selectedSong.name !== "cantabile_in_C_grand" && (
                <IconButton
                  onClick={onStartGame}
                  sx={{
                    background: colors.primary?.main || "#6b7280",
                    color: "white",
                    borderRadius: "12px",
                    padding: "16px",
                    transition: "all 0.3s ease",
                    width: "100%",
                    height: "64px",
                    "&:hover": {
                      background: colors.primary?.dark || "#4b5563",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <PlayArrow sx={{ fontSize: "32px" }} />
                </IconButton>
              )}
          </Box>
        </Paper>
        </Box>
      </Box>
    </Container>
  );
};
