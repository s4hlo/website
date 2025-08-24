import { useState, useRef } from "react";
import type { Note } from "../../types/rhythm-game";

export const useGameState = () => {
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
  const [hitEffect, setHitEffect] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  const startGame = () => {
    setGameState("playing");
    setLastHitZone("");
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  return {
    gameState,
    setGameState,
    currentTime,
    setCurrentTime,
    score,
    setScore,
    combo,
    setCombo,
    notes,
    setNotes,
    activeNotes,
    setActiveNotes,
    keyStates,
    setKeyStates,
    lastHitZone,
    setLastHitZone,
    lastHitPoints,
    setLastHitPoints,
    missedNotesCount,
    setMissedNotesCount,
    audioReady,
    setAudioReady,
    hitEffect,
    setHitEffect,
    startTimeRef,
    lastFrameTimeRef,
    resetGame,
    startGame,
  };
};
