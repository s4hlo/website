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
  const [showHitZones, setShowHitZones] = useState(false);

  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Function to update key states based on number of lanes
  const updateKeyStatesForLanes = (lanes: number) => {
    const newKeyStates = new Array(lanes).fill(false);
    setKeyStates(newKeyStates);
  };

  // Function to clean up notes and ensure no duplicates
  const cleanupNotes = () => {
    setActiveNotes((prev) => {
      // Remove any notes that might be stuck or duplicated
      const uniqueNotes = prev.filter((note, index, self) => 
        index === self.findIndex(n => 
          n.id === note.id || 
          (n.value === note.value && 
           n.position === note.position && 
           Math.abs(n.time - note.time) < 0.01)
        )
      );
      
      if (uniqueNotes.length !== prev.length) {
        console.log(`Cleaned up notes: ${prev.length} -> ${uniqueNotes.length}`);
      }
      
      return uniqueNotes;
    });
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
    // Reset key states to default 6 lanes
    updateKeyStatesForLanes(6);
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
    // Reset key states to default 6 lanes
    updateKeyStatesForLanes(6);
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
    showHitZones,
    setShowHitZones,
    startTimeRef,
    lastFrameTimeRef,
    resetGame,
    startGame,
    updateKeyStatesForLanes,
    cleanupNotes,
  };
};
