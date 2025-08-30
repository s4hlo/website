import { useState, useRef } from 'react';
import type { Note } from '../../types/rhythm-game';

export const useGameState = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
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
  ]);
  const [lastHitZone, setLastHitZone] = useState<string>('');
  const [lastHitPoints, setLastHitPoints] = useState<number>(0);
  const [missedNotesCount, setMissedNotesCount] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [hitEffect, setHitEffect] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [showHitZones, setShowHitZones] = useState(false);
  const [pendingNoteRemovals, setPendingNoteRemovals] = useState<Set<string>>(
    new Set(),
  );
  const [gameSpeed, setGameSpeed] = useState<'EASY' | 'NORMAL' | 'HARD'>(
    'NORMAL',
  );

  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Function to clean up notes and ensure no duplicates
  const cleanupNotes = () => {
    setActiveNotes(prev => {
      // Remove any notes that might be stuck or duplicated
      const uniqueNotes = prev.filter(
        (note, index, self) =>
          index ===
          self.findIndex(
            n =>
              n.id === note.id ||
              (n.name === note.name &&
                n.position === note.position &&
                Math.abs(n.time - note.time) < 0.01),
          ),
      );

      if (uniqueNotes.length !== prev.length) {
        console.log(
          `Cleaned up notes: ${prev.length} -> ${uniqueNotes.length}`,
        );
      }

      return uniqueNotes;
    });
  };

  // Function to mark a note for removal
  const markNoteForRemoval = (noteId: string) => {
    setPendingNoteRemovals(prev => new Set([...prev, noteId]));
    console.log(`Marked note ${noteId} for removal`);
  };

  // Function to clear pending removals
  const clearPendingRemovals = () => {
    setPendingNoteRemovals(new Set());
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
    clearPendingRemovals();
    // Reset key states to 4 lanes (fixed)
    setKeyStates([false, false, false, false]);
  };

  const startGame = () => {
    setGameState('playing');
    setLastHitZone('');
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
    clearPendingRemovals();
    // Reset key states to 4 lanes (fixed)
    setKeyStates([false, false, false, false]);
  };

  const getGameSpeed = () => {
    switch (gameSpeed) {
      case 'EASY':
        return 200;
      case 'NORMAL':
        return 300;
      case 'HARD':
        return 400;
      default:
        return 300;
    }
  };

  return {
    gameState,
    setGameState,
    currentTime,
    setCurrentTime,
    score,
    setScore,
    combo,
    gameSpeed,
    setGameSpeed,
    getGameSpeed,
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
    cleanupNotes,
    markNoteForRemoval,
    clearPendingRemovals,
    pendingNoteRemovals,
  };
};
