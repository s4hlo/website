import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { colors, colorUtils } from "../../theme";
import { OctaveHeatmap } from "./OctaveHeatmap";
import type { Song, MidiAnalysis } from "../../songs/sampleOne";

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
      <Container maxWidth="lg">
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
          <Paper
            sx={{
              p: 6,
              background: colors.gradients.card.primary,
              border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
              borderRadius: 3,
              maxWidth: 600,
              mx: "auto",
            }}
          >
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
                mb: 4,
              }}
            >
              Rhythm Game
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Use D F J K keys to play! 
              Test your rhythm and timing skills with 4 lanes.
            </Typography>

            {/* MIDI Upload Section */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {midiFileName ? `Arquivo selecionado: ${midiFileName}` : "Ou faça upload de um arquivo MIDI:"}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <input
                  ref={(input) => {
                    if (input) input.style.display = 'none';
                  }}
                  type="file"
                  accept=".mid,.midi"
                  onChange={onMidiUpload}
                  id="midi-upload"
                />
                <button
                  onClick={() => {
                    const fileInput = document.getElementById('midi-upload') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                  style={{
                    background: colors.secondary?.main || "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    minWidth: "200px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.secondary?.dark || "#4b5563";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.secondary?.main || "#6b7280";
                  }}
                >
                  Escolher arquivo MIDI
                </button>
                
                {midiFileName && (
                  <button
                    onClick={onResetMidi}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      minWidth: "150px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ef4444";
                    }}
                  >
                    Limpar arquivo
                  </button>
                )}
              </Box>
            </Box>

            {/* Heatmap de Oitavas - Aparece após upload do MIDI */}
            {showOctaveSelection && midiAnalysis && (
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
                  Análise das Oitavas - Escolha o intervalo para converter
                </Typography>
                
                {/* Heatmap das oitavas */}
                <OctaveHeatmap midiAnalysis={midiAnalysis} />

                {/* Seleção de intervalo de oitavas */}
                <Paper sx={{ p: 3, mb: 3, background: colors.gradients.card.primary }}>
                  <Typography variant="body2" sx={{ mb: 2, textAlign: "center" }}>
                    Escolha o intervalo de oitavas para converter:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Oitava Mínima</Typography>
                      <input
                        type="number"
                        min={midiAnalysis.minOctave}
                        max={midiAnalysis.maxOctave}
                        value={minOctave}
                        onChange={(e) => onMinOctaveChange(parseInt(e.target.value))}
                        style={{
                          width: '80px',
                          padding: '8px',
                          borderRadius: '4px',
                          border: `1px solid ${colors.primary.main}`,
                          background: colors.gradients.card.primary,
                          color: colors.text.primary,
                          textAlign: 'center',
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Oitava Máxima</Typography>
                      <input
                        type="number"
                        min={midiAnalysis.minOctave}
                        max={midiAnalysis.maxOctave}
                        value={maxOctave}
                        onChange={(e) => onMaxOctaveChange(parseInt(e.target.value))}
                        style={{
                          width: '80px',
                          padding: '8px',
                          borderRadius: '4px',
                          border: `1px solid ${colors.primary.main}`,
                          background: colors.gradients.card.primary,
                          color: colors.text.primary,
                          textAlign: 'center',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ textAlign: "center", color: colors.text.secondary, mb: 2 }}>
                    Recomendado: {midiAnalysis.recommendedMinOctave} - {midiAnalysis.recommendedMaxOctave}
                  </Typography>
                  
                  {/* Botão de conversão */}
                  <button
                    onClick={onConvertMidi}
                    disabled={isConverting}
                    style={{
                      background: isConverting ? colors.text.secondary : colors.primary.main,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: isConverting ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      minWidth: "200px",
                      opacity: isConverting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isConverting) {
                        e.currentTarget.style.background = colors.primary.dark;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isConverting) {
                        e.currentTarget.style.background = colors.primary.main;
                      }
                    }}
                  >
                    {isConverting ? "Convertendo..." : "Converter MIDI para Song"}
                  </button>
                </Paper>
              </Box>
            )}

            {/* Música convertida - Aparece após conversão */}
            {!showOctaveSelection && midiFileName && selectedSong.name !== "cantabile_in_C_grand" && (
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                  Música convertida com sucesso!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedSong.name} - {selectedSong.notes.length} notas
                </Typography>
                
                {/* JSON Display - Mostra o resultado da conversão */}
                <Box sx={{ mt: 3, textAlign: "left" }}>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                    Resultado da conversão:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      background: "#1f2937",
                      color: "#e5e7eb",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      maxHeight: "200px",
                      overflow: "auto",
                      border: "1px solid #374151",
                    }}
                  >
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(selectedSong, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </Box>
            )}

            <button
              onClick={onStartGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
              style={{
                background: colors.primary.main,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "16px 40px",
                fontSize: "22px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "250px",
                marginTop: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primary.dark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.primary.main;
              }}
            >
              Start Game
            </button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
