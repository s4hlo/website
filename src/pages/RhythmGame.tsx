import React, { useEffect, useRef, useCallback } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import * as Tone from "tone";
import { colors, colorUtils } from "../theme";
import { useGameState } from "../components/rhythm-game/GameState";
import { useGameLoop } from "../components/rhythm-game/GameLoop";
import { useGameRenderer } from "../components/rhythm-game/GameRenderer";

const RhythmGame: React.FC = () => {
  const gameState = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tone.js refs
  const synthRef = useRef<Tone.Synth | null>(null);
  const isAudioStartedRef = useRef(false);

  const keys = ["S", "D", "F", "J", "K", "L"];

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

  // Use game loop hook
  const { zonePositionsRef } = useGameLoop(
    gameState.gameState,
    gameState.notes,
    gameState.setNotes,
    gameState.setActiveNotes,
    gameState.setCurrentTime,
    gameState.setMissedNotesCount,
    gameState.startTimeRef,
    gameState.lastFrameTimeRef
  );

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
    gameState.hitEffect
  );

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameState !== "playing") return;

      const keyIndex = keys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      e.preventDefault();
      gameState.setKeyStates((prev) => {
        const newStates = [...prev];
        newStates[keyIndex] = true;
        return newStates;
      });

      // Check for note hits
      const hitNote = gameState.activeNotes.find((note) => {
        if (note.position !== keyIndex) return false;

        // Calculate zone positions (same as in drawing)
        const { startY, endY } = zonePositionsRef.current();

        return note.y >= startY && note.y <= endY;
      });

      if (hitNote) {
        // Calculate zone positions (same as in drawing)
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
          console.log(`Hit: ${zoneName} - ${points} points!`);

          // Add hit effect animation
          const hitX =
            hitNote.position * (600 / 6) + 600 / 6 / 2;
          const hitY = hitNote.y;
          gameState.setHitEffect({ x: hitX, y: hitY, time: Date.now() });

          // Remove hit note
          gameState.setActiveNotes((prev) =>
            prev.filter((note) => note.id !== hitNote.id)
          );

          // Play sound with Tone.js
          if (synthRef.current && isAudioStartedRef.current) {
            // Map instrument to different notes for variety
            const noteOffset = hitNote.instrument % 12;
            const noteNames = [
              "C",
              "C#",
              "D",
              "D#",
              "E",
              "F",
              "F#",
              "G",
              "G#",
              "A",
              "A#",
              "B",
            ];
            const noteName = noteNames[noteOffset];
            const octave = 4 + Math.floor(hitNote.instrument / 12);
            const note = `${noteName}${octave}`;

            // Adjust volume based on hit quality
            const volume =
              zoneName === "Perfect"
                ? -6
                : zoneName.includes("Good")
                ? -8
                : -12;
            synthRef.current.volume.value = volume;

            // Play the note
            synthRef.current.triggerAttackRelease(note, "8n");
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyIndex = keys.indexOf(e.key.toUpperCase());
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
  }, [gameState, keys, songArena, scoreValues, zonePositionsRef]);

  const startGame = async () => {
    // Start audio context first
    await startAudio();

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
                  background: colors.gradients.primary,
                  backgroundClip: "text",
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
                sx={{ mb: 6, lineHeight: 1.6 }}
              >
                Use S D F J K L keys to play! Test your rhythm and timing
                skills.
              </Typography>
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
