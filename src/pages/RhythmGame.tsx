import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { Note, SongArena, Score } from "../types/rhythm-game";
import { sampleSong } from "../songs/sampleOne";
import { Box, Container, Typography, Paper } from "@mui/material";
import * as Tone from "tone";
import { colors, colorUtils } from "../theme";

const songArena: SongArena = {
  earlyNormalZoneHeight: 16,
  earlyGoodZoneHeight: 12,
  perfectZoneHeight: 8,
  lateGoodZoneHeight: 10,
  lateNormalZoneHeight: 12,
};

const scoreValues: Score = {
  perfect: 100,
  good: 50,
  normal: 10,
};

const RhythmGame: React.FC = () => {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNotes, setActiveNotes] = useState<
    Array<Note & { id: string; y: number }>
  >([]);
  const [keyStates, setKeyStates] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [lastHitZone, setLastHitZone] = useState<string>("");
  const [lastHitPoints, setLastHitPoints] = useState<number>(0);
  const [missedNotesCount, setMissedNotesCount] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [hitEffect, setHitEffect] = useState<{ x: number; y: number; time: number } | null>(null);

  // Zone positions - calculated once and stored in ref for game loop access
  const zonePositionsRef = useRef(() => {
    const targetY = 800 - 100; // Center of the arena - moved down to give player reaction time
    const totalHeight =
      songArena.earlyNormalZoneHeight +
      songArena.earlyGoodZoneHeight +
      songArena.perfectZoneHeight +
      songArena.lateGoodZoneHeight +
      songArena.lateNormalZoneHeight;
    const startY = targetY - totalHeight / 2;
    const endY = targetY + totalHeight / 2;
    return { targetY, totalHeight, startY, endY };
  });

  // Memoized zone positions for rendering
  const zonePositions = useMemo(() => zonePositionsRef.current(), []);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tone.js refs
  const synthRef = useRef<Tone.Synth | null>(null);
  const isAudioStartedRef = useRef(false);

  const keys = ["S", "D", "F", "J", "K", "L"];

  // Calculate note speed in pixels per second
  // Convert quarter note duration to pixels per second
  // 50px per quarter note, so speed = 50px / (quarterNoteDuration/1000) seconds
  const noteSpeedPxPerSec = 50 / (sampleSong.quarterNoteDuration / 1000);

  // Initialize Tone.js
  useEffect(() => {
    // Create a synth for note sounds with better sound design
    synthRef.current = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1
      }
    }).toDestination();

    // Set initial volume
    synthRef.current.volume.value = -12;

    // Add reverb for better sound
    const reverb = new Tone.Reverb({
      decay: 0.5,
      wet: 0.3
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
        setAudioReady(true);
        console.log("Audio context started");
      } catch (error) {
        console.error("Failed to start audio context:", error);
        setAudioReady(false);
      }
    }
  }, []);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameState !== "playing") return;

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const songTime = elapsed / 1000; // Convert to seconds
      setCurrentTime(songTime);

      // Calculate delta time for consistent movement
      const deltaTime = timestamp - lastFrameTimeRef.current;
      const deltaTimeSeconds = deltaTime / 1000;
      lastFrameTimeRef.current = timestamp;

      // Get zone positions once per frame
      const { endY } = zonePositionsRef.current();

      // Spawn notes based on song time
      const currentQuarterNote =
        songTime / (sampleSong.quarterNoteDuration / 1000);
      const notesToSpawn = sampleSong.notes.filter(
        (note) => note.time <= currentQuarterNote && !notes.includes(note)
      );

      if (notesToSpawn.length > 0) {
        setNotes((prev) => [...prev, ...notesToSpawn]);
        setActiveNotes((prev) => [
          ...prev,
          ...notesToSpawn.map((note) => ({
            ...note,
            id: `${note.value}-${note.time}-${Math.random()}`,
            y: -50, // Start notes higher above the screen for better visual flow with centered arena
          })),
        ]);
      }

      // Single update: move notes and detect misses in one operation
      setActiveNotes((prev) => {
        let missedNotes = 0;

        const updatedNotes = prev
          .map((note) => ({
            ...note,
            y: note.y + noteSpeedPxPerSec * deltaTimeSeconds, // Use delta-time for consistent speed
          }))
          .filter((note) => {
            // Remove notes that pass the arena boundary (miss detection)
            if (note.y > endY + 50) {
              // Added buffer for better note removal
              missedNotes++;
              return false;
            }
            return true;
          });

        // Update missed notes count to trigger combo reset
        if (missedNotes > 0) {
          setMissedNotesCount((prev) => prev + missedNotes);
        }

        return updatedNotes;
      });

      gameLoopRef.current = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp)
      );
    },
    [gameState, notes, noteSpeedPxPerSec]
  );

  // Reset combo when notes are missed
  useEffect(() => {
    if (missedNotesCount > 0) {
      setCombo(0);
      setLastHitZone("missed");
      setMissedNotesCount(0); // Reset counter
    }
  }, [missedNotesCount]);

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp)
      );
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      const keyIndex = keys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      e.preventDefault();
      setKeyStates((prev) => {
        const newStates = [...prev];
        newStates[keyIndex] = true;
        return newStates;
      });

      // Check for note hits
      const hitNote = activeNotes.find((note) => {
        if (note.position !== keyIndex) return false;

        // Calculate zone positions (same as in drawing)
        const { startY, endY } = zonePositions;

        return note.y >= startY && note.y <= endY;
      });

      if (hitNote) {
        // Calculate zone positions (same as in drawing)
        const { startY } = zonePositions;

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
          setScore((prev) => prev + points);
          setCombo((prev) => prev + 1);

          // Show zone feedback
          setLastHitZone(zoneName);
          setLastHitPoints(points);
          console.log(`Hit: ${zoneName} - ${points} points!`);

          // Add hit effect animation
          const hitX = hitNote.position * (800 / 6) + (800 / 6) / 2;
          const hitY = hitNote.y;
          setHitEffect({ x: hitX, y: hitY, time: Date.now() });

          // Remove hit note
          setActiveNotes((prev) =>
            prev.filter((note) => note.id !== hitNote.id)
          );

          // Play sound with Tone.js
          if (synthRef.current && isAudioStartedRef.current) {
            // Map instrument to different notes for variety
            const noteOffset = hitNote.instrument % 12;
            const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            const noteName = noteNames[noteOffset];
            const octave = 4 + Math.floor(hitNote.instrument / 12);
            const note = `${noteName}${octave}`;
            
            // Adjust volume based on hit quality
            const volume = zoneName === "Perfect" ? -6 : zoneName.includes("Good") ? -8 : -12;
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

      setKeyStates((prev) => {
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
  }, [gameState, activeNotes, keys]);

  // Draw game
  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const canvas = canvasRef.current;

    const canvasWidth = canvas.width; // 800
    const H = canvas.height; // 600
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with theme background
    ctx.fillStyle = colors.background.default;
    ctx.fillRect(0, 0, canvasWidth, H);

    // Draw lanes
    const laneWidth = canvasWidth / 6;
    const { targetY, totalHeight, startY: arenaStartY } = zonePositions;
    const arenaHeight = totalHeight;

    for (let i = 0; i < 6; i++) {
      // Lane background with theme colors
      ctx.fillStyle = keyStates[i] ? colors.primary.main : colors.background.paper;
      ctx.fillRect(i * laneWidth, arenaStartY, laneWidth, arenaHeight);

      // Lane borders with theme colors
      ctx.strokeStyle = keyStates[i] ? colors.primary.light : colors.text.secondary;
      ctx.lineWidth = keyStates[i] ? 3 : 1;
      ctx.strokeRect(i * laneWidth, arenaStartY, laneWidth, arenaHeight);

      // Key indicator with theme colors
      if (keyStates[i]) {
        ctx.fillStyle = colors.primary.light;
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(keys[i], i * laneWidth + laneWidth / 2, arenaStartY + 30);
        ctx.textAlign = "left";
      }
    }

    // Draw column separators (vertical lines between lanes)
    ctx.strokeStyle = colors.text.secondary;
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, arenaStartY);
      ctx.lineTo(i * laneWidth, arenaStartY + arenaHeight);
      ctx.stroke();
    }

    // Draw precision zones with theme colors
    const startY = arenaStartY;

    // Normal zone (theme colors) - top
    ctx.fillStyle = `${colors.category.ai}40`;
    ctx.fillRect(0, startY, canvasWidth, songArena.earlyNormalZoneHeight);

    // Good zone (theme colors) - above perfect
    ctx.fillStyle = `${colors.category.frontend}40`;
    ctx.fillRect(
      0,
      startY + songArena.earlyNormalZoneHeight,
      canvasWidth,
      songArena.earlyGoodZoneHeight
    );

    // Perfect zone (theme colors) - center
    ctx.fillStyle = `${colors.status.success}40`;
    ctx.fillRect(
      0,
      startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight,
      canvasWidth,
      songArena.perfectZoneHeight
    );

    // Good zone (theme colors) - below perfect
    ctx.fillStyle = `${colors.category.frontend}40`;
    ctx.fillRect(
      0,
      startY +
        songArena.earlyNormalZoneHeight +
        songArena.earlyGoodZoneHeight +
        songArena.perfectZoneHeight,
      canvasWidth,
      songArena.lateGoodZoneHeight
    );

    // Normal zone (theme colors) - bottom
    ctx.fillStyle = `${colors.category.ai}40`;
    ctx.fillRect(
      0,
      startY +
        songArena.earlyNormalZoneHeight +
        songArena.earlyGoodZoneHeight +
        songArena.perfectZoneHeight +
        songArena.lateGoodZoneHeight,
      canvasWidth,
      songArena.lateNormalZoneHeight
    );

    // Zone borders with theme colors
    ctx.strokeStyle = colors.text.primary;
    ctx.lineWidth = 1;

    // Draw borders for all zones
    ctx.strokeRect(0, startY, canvasWidth, songArena.earlyNormalZoneHeight);
    ctx.strokeRect(
      0,
      startY + songArena.earlyNormalZoneHeight,
      canvasWidth,
      songArena.earlyGoodZoneHeight
    );
    ctx.strokeRect(
      0,
      startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight,
      canvasWidth,
      songArena.perfectZoneHeight
    );
    ctx.strokeRect(
      0,
      startY +
        songArena.earlyNormalZoneHeight +
        songArena.earlyGoodZoneHeight +
        songArena.perfectZoneHeight,
      canvasWidth,
      songArena.lateGoodZoneHeight
    );
    ctx.strokeRect(
      0,
      startY +
        songArena.earlyNormalZoneHeight +
        songArena.earlyGoodZoneHeight +
        songArena.perfectZoneHeight +
        songArena.lateGoodZoneHeight,
      canvasWidth,
      songArena.lateNormalZoneHeight
    );

    // Target line (center) with theme colors
    ctx.strokeStyle = colors.primary.main;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(canvasWidth, targetY);
    ctx.stroke();

    // Draw notes with theme colors
    activeNotes.forEach((note) => {
      const x = note.position * laneWidth + laneWidth / 2;
      const y = note.y;

      // Note rectangle with rounded corners
      const noteWidth = 40;
      const noteHeight = 20;
      const cornerRadius = 8;

      // Use theme colors for notes
      const noteThemeColors = [
        colors.primary.main,
        colors.secondary.main,
        colors.category.backend,
        colors.category.frontend,
        colors.category.cloud,
        colors.category.ai
      ];
      
      ctx.fillStyle = noteThemeColors[note.position];
      ctx.beginPath();

      // Draw rounded rectangle manually for better compatibility
      const x1 = x - noteWidth / 2;
      const y1 = y - noteHeight / 2;
      const x2 = x1 + noteWidth;
      const y2 = y1 + noteHeight;

      ctx.moveTo(x1 + cornerRadius, y1);
      ctx.lineTo(x2 - cornerRadius, y1);
      ctx.quadraticCurveTo(x2, y1, x2, y1 + cornerRadius);
      ctx.lineTo(x2, y2 - cornerRadius);
      ctx.quadraticCurveTo(x2, y2, x2 - cornerRadius, y2);
      ctx.lineTo(x1 + cornerRadius, y2);
      ctx.quadraticCurveTo(x1, y2, x1, y2 - cornerRadius);
      ctx.lineTo(x1, y1 + cornerRadius);
      ctx.quadraticCurveTo(x1, y1, x1 + cornerRadius, y1);

      ctx.fill();

      // Note border with theme colors
      ctx.strokeStyle = colors.text.primary;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw UI with theme colors
    ctx.fillStyle = colors.text.primary;
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvasWidth / 2, 40);
    ctx.fillText(`Combo: ${combo}`, canvasWidth / 2, 70);
    
    // Audio status indicator with theme colors
    ctx.font = "16px Arial";
    ctx.fillStyle = audioReady ? colors.status.success : colors.status.error;
    ctx.fillText(`Audio: ${audioReady ? "Ready" : "Not Ready"}`, canvasWidth / 2, 100);
    
    ctx.textAlign = "left";

    // Show last hit feedback with theme colors
    if (lastHitZone && (score > 0 || lastHitZone === "missed")) {
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle =
        lastHitZone === "Perfect"
          ? colors.status.success
          : lastHitZone.includes("Good")
          ? colors.status.warning
          : lastHitZone.includes("Normal")
          ? colors.category.cloud
          : colors.status.error;
      ctx.fillText(`${lastHitZone} +${lastHitPoints}`, canvasWidth / 2, 120);
      ctx.textAlign = "left";
    }

    // Draw hit effect animation with theme colors
    if (hitEffect) {
      const timeSinceHit = Date.now() - hitEffect.time;
      const maxDuration = 500; // 500ms animation
      
      if (timeSinceHit < maxDuration) {
        const alpha = 1 - (timeSinceHit / maxDuration);
        const radius = 20 + (timeSinceHit / maxDuration) * 30;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = colors.primary.light;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hitEffect.x, hitEffect.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        setHitEffect(null);
      }
    }
  }, [
    gameState,
    activeNotes,
    keyStates,
    score,
    combo,
    currentTime,
    songArena,
    lastHitZone,
    lastHitPoints,
    audioReady,
    hitEffect,
  ]);

  const startGame = async () => {
    // Start audio context first
    await startAudio();
    
    setGameState("playing");
    setLastHitZone("");
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  if (gameState === "menu") {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: colors.gradients.main,
          backgroundAttachment: 'fixed',
          py: 4
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
                  background: colors.gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '3rem', md: '4rem' },
                  mb: 4
                }}
              >
                Rhythm Game
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, lineHeight: 1.6 }}
              >
                Use S D F J K L keys to play! Test your rhythm and timing skills.
              </Typography>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
                style={{
                  background: colors.primary.main,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
        minHeight: '100vh',
        background: colors.gradients.main,
        backgroundAttachment: 'fixed',
        py: 4
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
              p: 3,
              background: colors.gradients.card.primary,
              border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
              borderRadius: 3,
              mb: 3,
              width: "100%",
              maxWidth: 800,
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              style={{
                width: "100%",
                maxWidth: 720,
                height: "auto",
                display: "block",
                borderRadius: "8px",
              }}
            />
          </Paper>

          {/* Game Controls */}
          <Box sx={{ position: "absolute", top: 20, right: 20 }}>
            <button
              onClick={resetGame}
              style={{
                background: colors.status.error,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
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
