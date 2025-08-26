import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Slider,
  Divider,
} from "@mui/material";
import { Close, VolumeUp } from "@mui/icons-material";
import * as Tone from "tone";
import { colors, colorUtils } from "../theme";
import { useGameState } from "../components/rhythm-game/GameState";
import { useGameLoop } from "../components/rhythm-game/GameLoop";
import { useGameRenderer } from "../components/rhythm-game/GameRenderer";
import { RhythmGameMenu } from "../components/rhythm-game/RhythmGameMenu";
import {
  sampleSong,
  processTrack,
  mapTrackToSong,
  analyzeMidiOctaves,
  type MidiAnalysis,
} from "../songs/sampleOne";
import type { Song } from "../types/rhythm-game";

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
      if (event.key.toLowerCase() === "u") {
        gameState.setShowHitZones((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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
          console.log(
            `Note ${note.id} in hit zone: y=${note.y}, startY=${startY}, endY=${endY}, lane=${keyIndex}`
          );
        }

        return isInHitZone;
      });

      if (hitNote) {
        console.log(
          `Hit note detected: ${hitNote.id} at position ${hitNote.position}, lane ${keyIndex}, y: ${hitNote.y}`
        );

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
          console.log(
            `Marked note ${hitNote.id} for removal via pending system`
          );

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

  const handleMidiUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMidiFile(file);
    setMidiFileName(file.name);

    try {
      // Analisa o arquivo MIDI para mostrar as oitavas
      const analysis = await processTrack({
        midiFile: file,
        fn: analyzeMidiOctaves,
      });
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
      const song = await processTrack({
        midiFile,
        maxOctave,
        minOctave,
        fn: mapTrackToSong,
      });
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colors.gradients.main,
        backgroundAttachment: "fixed",
        py: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {gameState.gameState === "menu" ? (
        <RhythmGameMenu
          selectedSong={selectedSong}
          midiFileName={midiFileName}
          midiAnalysis={midiAnalysis}
          showOctaveSelection={showOctaveSelection}
          isConverting={isConverting}
          minOctave={minOctave}
          maxOctave={maxOctave}
          onMidiUpload={handleMidiUpload}
          onResetMidi={handleResetMidi}
          onMinOctaveChange={setMinOctave}
          onMaxOctaveChange={setMaxOctave}
          onConvertMidi={handleConvertMidi}
          onStartGame={startGame}
        />
      ) : (
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
          {/* Game Controls and Score */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Score and Combo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background:
                  colors.gradients.card.secondary ||
                  colors.gradients.card.primary,
                border: `1px solid ${colorUtils.getBorderColor(
                  colors.primary.main
                )}`,
                borderRadius: 2,
                p: 1,
                minHeight: 48,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: colors.text.primary,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Score: {gameState.score}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: colors.primary.main,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Combo: {gameState.combo}
              </Typography>
            </Box>

            {/* Volume Control */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                background:
                  colors.gradients.card.secondary ||
                  colors.gradients.card.primary,
                border: `1px solid ${colorUtils.getBorderColor(
                  colors.primary.main
                )}`,
                borderRadius: 2,
                minWidth: 140,
                minHeight: 48,
              }}
            >
              <VolumeUp sx={{ color: colors.primary.main, fontSize: 18 }} />
              <Slider
                value={volume}
                onChange={(_, value) => setVolume(value as number)}
                min={0}
                max={100}
                step={5}
                size="small"
                sx={{
                  width: 100,
                  color: colors.primary.main,
                  "& .MuiSlider-thumb": {
                    backgroundColor: colors.primary.main,
                    width: 18,
                    height: 18,
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: colors.primary.main,
                    height: 4,
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    height: 4,
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.secondary,
                  fontSize: "12px",
                  fontWeight: "bold",
                  minWidth: 30,
                  textAlign: "center",
                }}
              >
                {volume}%
              </Typography>
            </Box>

            {/* Quit Button */}
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
                minWidth: "48px",
                minHeight: "48px",
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
          </Box>

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
      )}
    </Box>
  );
};

export default RhythmGame;
