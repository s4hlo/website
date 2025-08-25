import React, { useEffect, useRef, useCallback, useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import * as Tone from "tone";
import { colors, colorUtils } from "../theme";
import { useGameState } from "../components/rhythm-game/GameState";
import { useGameLoop } from "../components/rhythm-game/GameLoop";
import { useGameRenderer } from "../components/rhythm-game/GameRenderer";
import { sampleSong, convertMidiToSong } from "../songs/sampleOne";
import type { Song } from "../types/rhythm-game";

const RhythmGame: React.FC = () => {
  const gameState = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSong, setSelectedSong] = useState<Song>(sampleSong);
  const [midiFileName, setMidiFileName] = useState<string>("");

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

    // Set initial volume
    synthRef.current.volume.value = -12;

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
  const { zonePositionsRef } = useGameLoop(
    gameState.gameState,
    gameState.notes,
    gameState.setNotes,
    gameState.setActiveNotes,
    gameState.setCurrentTime,
    gameState.setMissedNotesCount,
    gameState.startTimeRef,
    gameState.lastFrameTimeRef,
    songArena,
    selectedSong
  );

  // Update key states when lane configuration changes
  useEffect(() => {
    if (songArena.lanes !== gameState.keyStates.length) {
      gameState.updateKeyStatesForLanes(songArena.lanes);
    }
  }, [songArena.lanes, gameState]);

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

  // Handle key presses
  useEffect(() => {
    // Função para mapear posição da nota para lane disponível
    const mapNotePositionToLane = (notePosition: number, availableLanes: number) => {
      // Se a posição está dentro do range das lanes disponíveis, usa diretamente
      if (notePosition < availableLanes) {
        return notePosition;
      }
      
      // Caso contrário, mapeia proporcionalmente
      // Ex: 6 lanes para 4 lanes: pos 4,5 -> lanes 0,1
      // Ex: 6 lanes para 3 lanes: pos 3,4,5 -> lanes 0,1,2
      const maxPosition = 6; // Assumindo que o máximo é 6 (baseado no notePositionMap)
      const ratio = availableLanes / maxPosition;
      return Math.floor(notePosition * ratio);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameState !== "playing") return;

      // Get keys based on current lane configuration with correct mapping
      const getKeysForLanes = (lanes: number) => {
        switch (lanes) {
          case 1: return ["J"];
          case 2: return ["F", "J"];
          case 3: return ["D", "F", "J"];
          case 4: return ["D", "F", "J", "K"];
          case 5: return ["D", "F", "J", "K", "L"];
          case 6: return ["S", "D", "F", "J", "K", "L"];
          default: return ["S", "D", "F", "J", "K", "L"];
        }
      };

      const currentKeys = getKeysForLanes(songArena.lanes);
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
        // Mapeia a posição da nota para a lane correta
        const mappedPosition = mapNotePositionToLane(note.position, songArena.lanes);
        if (mappedPosition !== keyIndex) return false;

        // Calculate zone positions (same as in drawing)
        const { startY, endY } = zonePositionsRef.current();

        return note.y >= startY && note.y <= endY;
      });

      if (hitNote) {
        console.log(`Hit note detected: ${hitNote.id} at position ${hitNote.position}, lane ${keyIndex}`);
        
        // Calculate zone positions (same as drawing)
        const { startY } = zonePositionsRef.current();

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

          // Add hit effect animation - usa a posição mapeada
          const laneWidth = 600 / songArena.lanes;
          const mappedPosition = mapNotePositionToLane(hitNote.position, songArena.lanes);
          const hitX = mappedPosition * laneWidth + laneWidth / 2;
          const hitY = hitNote.y;
          gameState.setHitEffect({ x: hitX, y: hitY, time: Date.now() });

          // Remove hit note - use a more robust removal method
          gameState.setActiveNotes((prev) => {
            const filteredNotes = prev.filter((note) => note.id !== hitNote.id);
            // Log for debugging
            console.log(`Removed note ${hitNote.id}, remaining: ${filteredNotes.length}`);
            return filteredNotes;
          });

          // Verify removal
          setTimeout(() => {
            const currentNotes = gameState.activeNotes;
            const noteStillExists = currentNotes.some(note => note.id === hitNote.id);
            if (noteStillExists) {
              console.warn(`Note ${hitNote.id} still exists after removal attempt`);
            } else {
              console.log(`Note ${hitNote.id} successfully removed`);
            }
          }, 0);

          // Play sound with Tone.js
          if (synthRef.current && isAudioStartedRef.current) {
            // Use the actual note value from the MIDI file
            const noteValue = hitNote.value; // This contains the actual note like "E55", "D#55", etc.
            
            // Adjust volume based on hit quality
            const volume =
              zoneName === "Perfect"
                ? -6
                : zoneName.includes("Good")
                ? -8
                : -12;
            synthRef.current.volume.value = volume;

            // Play the actual note from the MIDI file
            synthRef.current.triggerAttackRelease(noteValue, "8n");
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Get keys based on current lane configuration with correct mapping
      const getKeysForLanes = (lanes: number) => {
        switch (lanes) {
          case 1: return ["J"];
          case 2: return ["F", "J"];
          case 3: return ["D", "F", "J"];
          case 4: return ["D", "F", "J", "K"];
          case 5: return ["D", "F", "J", "K", "L"];
          case 6: return ["S", "D", "F", "J", "K", "L"];
          default: return ["S", "D", "F", "J", "K", "L"];
        }
      };

      const currentKeys = getKeysForLanes(songArena.lanes);
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
  }, [gameState, songArena, scoreValues, zonePositionsRef]);

  const handleMidiUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const song = await convertMidiToSong(file);
      setSelectedSong(song);
      setMidiFileName(file.name);
    } catch (error) {
      console.error("Error converting MIDI file:", error);
      alert("Erro ao converter arquivo MIDI. Usando música padrão.");
      setSelectedSong(sampleSong);
      setMidiFileName("");
    }
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
                Use {(() => {
                  const getKeysForLanes = (lanes: number) => {
                    switch (lanes) {
                      case 1: return ["J"];
                      case 2: return ["F", "J"];
                      case 3: return ["D", "F", "J"];
                      case 4: return ["D", "F", "J", "K"];
                      case 5: return ["D", "F", "J", "K", "L"];
                      case 6: return ["S", "D", "F", "J", "K", "L"];
                      default: return ["S", "D", "F", "J", "K", "L"];
                    }
                  };
                  return getKeysForLanes(songArena.lanes).join(" ");
                })()} keys to play! 
                Test your rhythm and timing skills with {songArena.lanes} lanes.
              </Typography>

              {/* MIDI Upload Section */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {midiFileName ? `Música selecionada: ${midiFileName}` : "Ou faça upload de um arquivo MIDI:"}
                </Typography>
                
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
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginBottom: "16px",
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
                    onClick={() => {
                      setSelectedSong(sampleSong);
                      setMidiFileName("");
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ef4444";
                    }}
                  >
                    Usar música padrão
                  </button>
                )}
              </Box>

              {/* JSON Display */}
              {midiFileName && (
                <Box sx={{ mb: 4, textAlign: "left" }}>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                    Música convertida:
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
              )}
              
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
                style={{
                  background: colors.primary.main,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 32px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
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
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
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
              mb: 3,
              width: "100%",
              maxWidth: 600,
              overflow: "hidden", // Remove any overflow that might cause borders
            }}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              style={{
                width: "100%",
                maxWidth: 600, // Match the Paper maxWidth
                height: "auto",
                display: "block",
                borderRadius: "8px",
                margin: 0, // Remove any default margins
                padding: 0, // Remove any default padding
              }}
            />
          </Paper>

          {/* Game Controls */}
          <Box sx={{ position: "absolute", top: 20, right: 20 }}>
            <button
              onClick={gameState.resetGame}
              style={{
                background: colors.status.error,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.status.error;
              }}
            >
              Quit
            </button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RhythmGame;
