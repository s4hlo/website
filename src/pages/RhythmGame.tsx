import React, { useEffect, useRef, useCallback, useState } from "react";
import { Box, Container, Typography, Paper, Slider } from "@mui/material";
import { Close } from "@mui/icons-material";
import * as Tone from "tone";
import { colors, colorUtils } from "../theme";
import { useGameState } from "../components/rhythm-game/GameState";
import { useGameLoop } from "../components/rhythm-game/GameLoop";
import { useGameRenderer } from "../components/rhythm-game/GameRenderer";
import { OctaveHeatmap } from "../components/rhythm-game/OctaveHeatmap";
import { sampleSong, convertMidiToSong, analyzeMidiOctaves, type MidiAnalysis } from "../songs/sampleOne";
import type { Song } from "../types/rhythm-game";
import { VolumeUp } from "@mui/icons-material";

const RhythmGame: React.FC = () => {
  const gameState = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSong, setSelectedSong] = useState<Song>(sampleSong);
  const [midiFileName, setMidiFileName] = useState<string>("");
  const [volume, setVolume] = useState<number>(50); // Volume control (0-100)
  
  // Estados para conversão MIDI
  const [midiFile, setMidiFile] = useState<File | null>(null);
  const [midiAnalysis, setMidiAnalysis] = useState<MidiAnalysis | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [minOctave, setMinOctave] = useState<number>(3);
  const [maxOctave, setMaxOctave] = useState<number>(6);
  const [showOctaveSelection, setShowOctaveSelection] = useState(false);

  // Tone.js refs
  const synthRef = useRef<Tone.Synth | null>(null);
  const isAudioStartedRef = useRef(false);

  // Initialize Tone.js
  useEffect(() => {
    // Create a synth for note sounds with better sound design
    synthRef.current = new Tone.Synth({
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1,
      },
    }).toDestination();

    // Set initial volume based on volume state
    updateSynthVolume();

    // Add reverb for better sound
    const reverb = new Tone.Reverb({
      decay: 0.5,
      wet: 0.3,
    }).toDestination();

    synthRef.current.connect(reverb);

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      reverb.dispose();
    };
  }, []);

  // Update synth volume when volume state changes
  const updateSynthVolume = useCallback(() => {
    if (synthRef.current) {
      // Convert volume (0-100) to dB (-40 to 0)
      const dbValue = (volume / 100) * 40 - 40;
      synthRef.current.volume.value = dbValue;
    }
  }, [volume]);

  // Update synth volume when volume changes
  useEffect(() => {
    updateSynthVolume();
  }, [volume, updateSynthVolume]);

  // Start audio context on user interaction
  const startAudio = useCallback(async () => {
    if (!isAudioStartedRef.current && synthRef.current) {
      try {
        await Tone.start();
        isAudioStartedRef.current = true;
        gameState.setAudioReady(true);
        console.log("Audio context started");
      } catch (error) {
        console.error("Failed to start audio context:", error);
        gameState.setAudioReady(false);
      }
    }
  }, [gameState]);

  // Use game renderer hook
  const { songArena, scoreValues } = useGameRenderer(
    canvasRef,
    gameState.gameState,
    gameState.activeNotes,
    gameState.keyStates,
    gameState.score,
    gameState.combo,
    gameState.currentTime,
    gameState.lastHitZone,
    gameState.lastHitPoints,
    gameState.audioReady,
    gameState.hitEffect,
    gameState.showHitZones
  );

  // Use game loop hook (moved after useGameRenderer to access songArena)
  useGameLoop(
    gameState.gameState,
    gameState.notes,
    gameState.setNotes,
    gameState.setActiveNotes,
    gameState.setCurrentTime,
    gameState.setMissedNotesCount,
    gameState.startTimeRef,
    gameState.lastFrameTimeRef,
    songArena,
    selectedSong,
    gameState.pendingNoteRemovals,
    gameState.clearPendingRemovals
  );

  // No need to update key states - fixed at 4 lanes

  // Keyboard listener for debug controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'u') {
        gameState.setShowHitZones(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // Reset combo when notes are missed
  useEffect(() => {
    if (gameState.missedNotesCount > 0) {
      gameState.setCombo(0);
      gameState.setLastHitZone("missed");
      gameState.setMissedNotesCount(0); // Reset counter
    }
  }, [gameState.missedNotesCount]);

  // Periodic cleanup of notes to prevent orphans
  useEffect(() => {
    if (gameState.gameState === "playing") {
      const cleanupInterval = setInterval(() => {
        gameState.cleanupNotes();
      }, 5000); // Clean up every 5 seconds

      return () => clearInterval(cleanupInterval);
    }
  }, [gameState.gameState, gameState.cleanupNotes]);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameState !== "playing") return;

      // Fixed 4 lanes with keys D, F, J, K
      const currentKeys = ["D", "F", "J", "K"];
      const keyIndex = currentKeys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      e.preventDefault();
      gameState.setKeyStates((prev) => {
        const newStates = [...prev];
        newStates[keyIndex] = true;
        return newStates;
      });

      // Check for note hits
      const hitNote = gameState.activeNotes.find((note) => {
        // Fixed 4 lanes - map position to lane
        const mappedPosition = note.position % 4;
        if (mappedPosition !== keyIndex) return false;

        // Calculate zone positions (fixed values)
        const targetY = 800 - 100;
        const totalHeight = 
          songArena.earlyNormalZoneHeight +
          songArena.earlyGoodZoneHeight +
          songArena.perfectZoneHeight +
          songArena.lateGoodZoneHeight +
          songArena.lateNormalZoneHeight;
        const startY = targetY - totalHeight / 2;
        const endY = targetY + totalHeight / 2;

        // Check if note is within the hit zone
        const isInHitZone = note.y >= startY && note.y <= endY;
        
        if (isInHitZone) {
          console.log(`Note ${note.id} in hit zone: y=${note.y}, startY=${startY}, endY=${endY}, lane=${keyIndex}`);
        }

        return isInHitZone;
      });

      if (hitNote) {
        console.log(`Hit note detected: ${hitNote.id} at position ${hitNote.position}, lane ${keyIndex}, y: ${hitNote.y}`);
        
        // Calculate zone positions (fixed values)
        const targetY = 800 - 100;
        const totalHeight = 
          songArena.earlyNormalZoneHeight +
          songArena.earlyGoodZoneHeight +
          songArena.perfectZoneHeight +
          songArena.lateGoodZoneHeight +
          songArena.lateNormalZoneHeight;
        const startY = targetY - totalHeight / 2;

        // Determine which zone the note was hit in
        let points = 0;
        let zoneName = "";

        if (
          hitNote.y >= startY &&
          hitNote.y < startY + songArena.earlyNormalZoneHeight
        ) {
          // Early Normal zone
          points = scoreValues.normal;
          zoneName = "Early Normal";
        } else if (
          hitNote.y >= startY + songArena.earlyNormalZoneHeight &&
          hitNote.y <
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight
        ) {
          // Early Good zone
          points = scoreValues.good;
          zoneName = "Early Good";
        } else if (
          hitNote.y >=
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight &&
          hitNote.y <
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight +
              songArena.perfectZoneHeight
        ) {
          // Perfect zone
          points = scoreValues.perfect;
          zoneName = "Perfect";
        } else if (
          hitNote.y >=
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight +
              songArena.perfectZoneHeight &&
          hitNote.y <
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight +
              songArena.perfectZoneHeight +
              songArena.lateGoodZoneHeight
        ) {
          // Late Good zone
          points = scoreValues.good;
          zoneName = "Late Good";
        } else if (
          hitNote.y >=
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight +
              songArena.perfectZoneHeight +
              songArena.lateGoodZoneHeight &&
          hitNote.y <
            startY +
              songArena.earlyNormalZoneHeight +
              songArena.earlyGoodZoneHeight +
              songArena.perfectZoneHeight +
              songArena.lateGoodZoneHeight +
              songArena.lateNormalZoneHeight
        ) {
          // Late Normal zone
          points = scoreValues.normal;
          zoneName = "Late Normal";
        }

        if (points > 0) {
          gameState.setScore((prev) => prev + points);
          gameState.setCombo((prev) => prev + 1);

          // Show zone feedback
          gameState.setLastHitZone(zoneName);
          gameState.setLastHitPoints(points);

          // Add hit effect animation - fixed 4 lanes
          const laneWidth = 600 / 4;
          const mappedPosition = hitNote.position % 4;
          const hitX = mappedPosition * laneWidth + laneWidth / 2;
          const hitY = hitNote.y;
          gameState.setHitEffect({ x: hitX, y: hitY, time: Date.now() });

          // Remove hit note - use pending removal system
          gameState.markNoteForRemoval(hitNote.id);
          console.log(`Marked note ${hitNote.id} for removal via pending system`);

          // Play sound with Tone.js
          if (synthRef.current && isAudioStartedRef.current) {
            // Use the actual note name from the song
            const noteName = hitNote.name; // This contains the actual note like "E4", "D4", etc.
            
            // Play the actual note from the song
            synthRef.current.triggerAttackRelease(noteName, "8n");
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Fixed 4 lanes with keys D, F, J, K
      const currentKeys = ["D", "F", "J", "K"];
      const keyIndex = currentKeys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      gameState.setKeyStates((prev) => {
        const newStates = [...prev];
        newStates[keyIndex] = false;
        return newStates;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, songArena, scoreValues]);

  const handleMidiUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMidiFile(file);
    setMidiFileName(file.name);
    
    try {
      // Analisa o arquivo MIDI para mostrar as oitavas
      const analysis = await analyzeMidiOctaves(file);
      setMidiAnalysis(analysis);
      
      // Define valores padrão baseados na análise
      setMinOctave(analysis.recommendedMinOctave);
      setMaxOctave(analysis.recommendedMaxOctave);
      setShowOctaveSelection(true);
    } catch (error) {
      console.error("Error analyzing MIDI file:", error);
      alert("Erro ao analisar arquivo MIDI. Usando música padrão.");
      setSelectedSong(sampleSong);
      setMidiFileName("");
      setMidiFile(null);
      setMidiAnalysis(null);
    }
  };

  const handleConvertMidi = async () => {
    if (!midiFile || !midiAnalysis) return;

    setIsConverting(true);
    try {
      const song = await convertMidiToSong(midiFile, maxOctave, minOctave);
      setSelectedSong(song);
      setShowOctaveSelection(false);
      console.log("MIDI convertido com sucesso:", song);
    } catch (error) {
      console.error("Error converting MIDI file:", error);
      alert("Erro ao converter arquivo MIDI. Usando música padrão.");
      setSelectedSong(sampleSong);
      setMidiFileName("");
      setMidiFile(null);
      setMidiAnalysis(null);
      setShowOctaveSelection(false);
    } finally {
      setIsConverting(false);
    }
  };

  const handleResetMidi = () => {
    setSelectedSong(sampleSong);
    setMidiFileName("");
    setMidiFile(null);
    setMidiAnalysis(null);
    setShowOctaveSelection(false);
    setMinOctave(3);
    setMaxOctave(6);
  };

  const startGame = async () => {
    // Start audio context first
    await startAudio();

    // Set the selected song notes (either MIDI converted or sample)
    gameState.setNotes(selectedSong.notes);
    
    gameState.startGame();
  };

  if (gameState.gameState === "menu") {
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
                border: `1px solid ${colorUtils.getBorderColor(
                  colors.primary.main
                )}`,
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

              {/* MIDI functionality removed - using fixed sample song only */}

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
                    onChange={handleMidiUpload}
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
                      onClick={handleResetMidi}
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
                          onChange={(e) => setMinOctave(parseInt(e.target.value))}
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
                          onChange={(e) => setMaxOctave(parseInt(e.target.value))}
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
                      onClick={handleConvertMidi}
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
              {!showOctaveSelection && midiFileName && selectedSong.name !== sampleSong.name && (
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
                onClick={startGame}
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
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.gradients.main,
        backgroundAttachment: "fixed",
        py: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Game Controls - Repositioned to top right */}
          <Box sx={{ 
            position: "absolute", 
            top: 20, 
            right: 20, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2, 
            alignItems: 'center',
            zIndex: 10,
          }}>
            {/* Stop Button */}
            <button
              onClick={gameState.resetGame}
              style={{
                background: colors.status.error,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "44px",
                minHeight: "44px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc2626";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.status.error;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Close />
            </button>

            {/* Volume Control */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1, 
              background: colors.gradients.card.primary,
              border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
              p: 2, 
              borderRadius: 3,
              minHeight: 120,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}>
              <Box sx={{ 
                color: colors.primary.main,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <VolumeUp sx={{ fontSize: 18 }} />
              </Box>
              
              <Box sx={{ height: 60, display: 'flex', alignItems: 'center' }}>
                <Slider
                  value={volume}
                  onChange={(_, value) => setVolume(value as number)}
                  min={0}
                  max={100}
                  step={5}
                  orientation="vertical"
                  size="small"
                  sx={{
                    color: colors.primary.main,
                    '& .MuiSlider-thumb': {
                      backgroundColor: colors.primary.main,
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: colors.primary.main,
                      width: 4,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      width: 4,
                    },
                  }}
                />
              </Box>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.text.secondary,
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {volume}%
              </Typography>
            </Box>
          </Box>

          {/* Canvas Container - Centered */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <Paper
              sx={{
                p: 2,
                background: colors.gradients.card.primary,
                border: `1px solid ${colorUtils.getBorderColor(
                  colors.primary.main
                )}`,
                borderRadius: 3,
                width: "100%",
                maxWidth: 600,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <canvas
                ref={canvasRef}
                width={600}
                height={800}
                style={{
                  width: "100%",
                  maxWidth: 600,
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                  margin: 0,
                  padding: 0,
                }}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RhythmGame;
