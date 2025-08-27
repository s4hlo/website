import React, { useEffect, useMemo } from "react";
import { colors } from "../../theme";
import type { Note, SongArena } from "../../types/rhythm-game";

const NOTE_HEIGHT = 40;

const songArena: SongArena = {
  earlyNormalZoneHeight: 20,
  earlyGoodZoneHeight: 20,
  perfectZoneHeight: 15,
  lateGoodZoneHeight: 20,
  lateNormalZoneHeight: 20,
};

const scoreValues = {
  perfect: 100,
  good: 50,
  normal: 10,
};

export const useGameRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  gameState: "menu" | "playing",
  activeNotes: Array<Note & { id: string; y: number }>,
  keyStates: boolean[],
  score: number,
  combo: number,
  _currentTime: number,
  lastHitZone: string,
  _lastHitPoints: number,
  audioReady: boolean,
  hitEffect: { x: number; y: number; time: number } | null,
  showHitZones: boolean
) => {
  // Estado para controlar a animação de piscada do feedback
  const [feedbackFlash, setFeedbackFlash] = React.useState<{
    isFlashing: boolean;
    startTime: number;
    lastZone: string;
  }>({ isFlashing: false, startTime: 0, lastZone: "" });

  // Efeito para detectar mudanças no lastHitZone e iniciar a piscada
  React.useEffect(() => {
    if (lastHitZone && (score > 0 || lastHitZone === "missed")) {
      setFeedbackFlash({
        isFlashing: true,
        startTime: Date.now(),
        lastZone: lastHitZone,
      });
    }
  }, [lastHitZone, score]);

  // Memoized zone positions for rendering
  const zonePositions = useMemo(() => {
    const targetY = 800 - 100; // Center of the arena - moved down to give player reaction time
    const totalHeight =
      songArena.earlyNormalZoneHeight +
      songArena.earlyGoodZoneHeight +
      songArena.perfectZoneHeight +
      songArena.lateGoodZoneHeight +
      songArena.lateNormalZoneHeight;
    const startY = targetY - totalHeight / 2;
    const endY = targetY + totalHeight / 2;
    return { targetY, totalHeight, startY, endY, perfectZoneHeight: songArena.perfectZoneHeight };
  }, [songArena]);

  // Draw game
  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const canvas = canvasRef.current;

    const canvasWidth = canvas.width; // 800
    const H = canvas.height; // 600
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with theme background
    ctx.fillStyle = "#181825";
    ctx.fillRect(0, 0, canvasWidth, H);

    // Draw lanes based on fixed 4 lanes configuration
    const laneWidth = canvasWidth / 4;
    const { targetY, totalHeight } = zonePositions;

    for (let i = 0; i < 4; i++) {
      // Lane background with theme colors
      ctx.fillStyle = keyStates[i]
        ? colors.primary.main
        : colors.background.paper;
      ctx.fillRect(i * laneWidth, targetY - NOTE_HEIGHT / 2, laneWidth, NOTE_HEIGHT);

      // Lane borders with theme colors
      ctx.strokeStyle = keyStates[i]
        ? colors.primary.light
        : colors.text.secondary;
      ctx.lineWidth = keyStates[i] ? 3 : 1;
      ctx.strokeRect(i * laneWidth, targetY - NOTE_HEIGHT / 2, laneWidth, NOTE_HEIGHT);

      // Key indicator with theme colors
      if (keyStates[i]) {
        ctx.fillStyle = colors.primary.light;
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        const keys = getKeys();
        ctx.fillText(keys[i], i * laneWidth + laneWidth / 2, targetY + 30);
        ctx.textAlign = "left";
      }
    }

    // Draw column separators (full canvas height)
    ctx.strokeStyle = colors.text.secondary;
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0); // topo do canvas
      ctx.lineTo(i * laneWidth, H); // base do canvas
      ctx.stroke();
    }

    // Draw precision zones with theme colors (only when showHitZones is true)
    if (showHitZones) {
      const startY = targetY - totalHeight / 2;

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
        startY +
          songArena.earlyNormalZoneHeight +
          songArena.earlyGoodZoneHeight,
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
        startY +
          songArena.earlyNormalZoneHeight +
          songArena.earlyGoodZoneHeight,
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
    }

    // Draw active notes
    activeNotes.forEach((note) => {
      // cor por lane - extend to support up to 6 lanes
      const laneColors = [
        colors.category.ai,
        colors.category.frontend,
        colors.category.backend,
        colors.category.cloud,
      ];

      const laneIndex = note.position % 4;
      const noteColor = laneColors[laneIndex];

      // Draw note with rounded corners
      const x = (note.position % 4) * laneWidth + 2;
      const y = note.y - NOTE_HEIGHT / 2;
      const width = laneWidth - 4;
      const height = NOTE_HEIGHT;
      const radius = 8; // Border radius for rounded corners

      ctx.fillStyle = noteColor;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.fill();

      // Draw note name
      ctx.fillStyle = colors.text.primary;
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        note.name,
        (note.position % 4) * laneWidth + laneWidth / 2,
        note.y + 4
      );
      ctx.textAlign = "left";
    });

    // Draw hit effect
    if (hitEffect) {
      const timeSinceHit = Date.now() - hitEffect.time;
      if (timeSinceHit < 200) {
        const alpha = 1 - timeSinceHit / 200;
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.beginPath();
        ctx.arc(hitEffect.x, hitEffect.y, 20 + timeSinceHit / 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Score and combo are now displayed in the UI overlay

    // Draw feedback flash
    if (feedbackFlash.isFlashing) {
      const timeSinceFlash = Date.now() - feedbackFlash.startTime;
      if (timeSinceFlash < 500) {
        const alpha = 1 - timeSinceFlash / 500;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        
        let feedbackText = "";
        let feedbackColor = colors.text.primary;
        
        switch (feedbackFlash.lastZone) {
          case "Perfect":
            feedbackText = "PERFECT!";
            feedbackColor = colors.status.success;
            break;
          case "Early Good":
          case "Late Good":
            feedbackText = "GOOD!";
            feedbackColor = colors.category.frontend;
            break;
          case "Early Normal":
          case "Late Normal":
            feedbackText = "NORMAL";
            feedbackColor = colors.category.ai;
            break;
          case "missed":
            feedbackText = "MISSED!";
            feedbackColor = colors.status.error;
            break;
        }
        
        ctx.fillStyle = feedbackColor;
        ctx.fillText(feedbackText, canvasWidth / 2, H - 200);
        ctx.textAlign = "left";
        
        if (timeSinceFlash >= 500) {
          setFeedbackFlash({ isFlashing: false, startTime: 0, lastZone: "" });
        }
      }
    }

    // Draw audio status
    if (!audioReady) {
      ctx.fillStyle = colors.status.warning;
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Click to start audio", canvasWidth / 2, H - 50);
      ctx.textAlign = "left";
    }

  }, [
    canvasRef,
    gameState,
    activeNotes,
    keyStates,
    score,
    combo,
    hitEffect,
    showHitZones,
    audioReady,
    feedbackFlash,
    zonePositions,
  ]);

  // Update keys array to support fixed 4 lanes
  const getKeys = () => {
    const allKeys = ["D", "F", "J", "K"];
    return allKeys;
  };

  return {
    songArena,
    scoreValues,
  };
};
