import { useEffect, useMemo } from "react";
import { colors } from "../../theme";
import type { Note } from "../../types/rhythm-game";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const songArena = {
  earlyNormalZoneHeight: 16,
  earlyGoodZoneHeight: 12,
  perfectZoneHeight: 8,
  lateGoodZoneHeight: 10,
  lateNormalZoneHeight: 12,
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
  currentTime: number,
  lastHitZone: string,
  lastHitPoints: number,
  audioReady: boolean,
  hitEffect: { x: number; y: number; time: number } | null
) => {
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
    return { targetY, totalHeight, startY, endY };
  }, []);

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

    // Draw lanes
    const laneWidth = canvasWidth / 6;
    const { targetY, totalHeight, startY: arenaStartY } = zonePositions;
    const arenaHeight = totalHeight;

    for (let i = 0; i < 6; i++) {
      // Lane background with theme colors
      ctx.fillStyle = keyStates[i]
        ? colors.primary.main
        : colors.background.paper;
      ctx.fillRect(i * laneWidth, arenaStartY, laneWidth, arenaHeight);

      // Lane borders with theme colors
      ctx.strokeStyle = keyStates[i]
        ? colors.primary.light
        : colors.text.secondary;
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

    // Draw column separators (full canvas height)
    ctx.strokeStyle = colors.text.secondary;
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0); // topo do canvas
      ctx.lineTo(i * laneWidth, H); // base do canvas
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
      const laneX = note.position * laneWidth;
      const gutter = 2; // coloque 0 se quiser ocupar 100% da largura da lane

      const noteWidth = laneWidth - gutter * 2; // ocupa a largura da lane (menos a folga)
      const noteHeight = 30; // ajuste se quiser mais "alta/baixa"
      const cornerRadius = Math.min(10, noteWidth / 6, noteHeight / 2);

      // posição da nota
      const x1 = laneX + gutter; // alinhar à esquerda da lane + folga
      const y1 = note.y - noteHeight / 2; // manter centralização vertical no y atual
      const x2 = x1 + noteWidth;
      const y2 = y1 + noteHeight;

      // cor por lane
      const noteThemeColors = [
        colors.primary.main,
        colors.secondary.main,
        colors.category.backend,
        colors.category.frontend,
        colors.category.cloud,
        colors.category.ai,
      ];
      ctx.fillStyle = noteThemeColors[note.position];

      // desenho do retângulo arredondado
      ctx.beginPath();
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

      // borda da nota
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
    ctx.fillText(
      `Audio: ${audioReady ? "Ready" : "Not Ready"}`,
      canvasWidth / 2,
      100
    );

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
      ctx.fillText(`${lastHitZone} +${lastHitPoints}`, canvasWidth / 2, 600);
      ctx.textAlign = "left";
    }

    // Draw hit effect animation with theme colors
    if (hitEffect) {
      const timeSinceHit = Date.now() - hitEffect.time;
      const maxDuration = 500; // 500ms animation

      if (timeSinceHit < maxDuration) {
        const alpha = 1 - timeSinceHit / maxDuration;
        const radius = 20 + (timeSinceHit / maxDuration) * 30;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = colors.primary.light;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hitEffect.x, hitEffect.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [
    canvasRef,
    gameState,
    activeNotes,
    keyStates,
    score,
    combo,
    currentTime,
    lastHitZone,
    lastHitPoints,
    audioReady,
    hitEffect,
    zonePositions,
  ]);

  return {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    songArena,
    scoreValues,
  };
};

const keys = ["S", "D", "F", "J", "K", "L"];
