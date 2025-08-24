import { useCallback, useEffect, useRef } from "react";
import type { Note } from "../../types/rhythm-game";
import { sampleSong } from "../../songs/sampleOne";

export const useGameLoop = (
  gameState: "menu" | "playing",
  notes: Note[],
  setNotes: (notes: Note[]) => void,
  setActiveNotes: (notes: Array<Note & { id: string; y: number }>) => void,
  setCurrentTime: (time: number) => void,
  setMissedNotesCount: (count: number) => void,
  startTimeRef: React.MutableRefObject<number>,
  lastFrameTimeRef: React.MutableRefObject<number>
) => {
  const gameLoopRef = useRef<number | undefined>(undefined);

  // Calculate note speed in pixels per second
  // Convert quarter note duration to pixels per second
  // 50px per quarter note, so speed = 50px / (quarterNoteDuration/1000) seconds
  const noteSpeedPxPerSec = 50 / (sampleSong.quarterNoteDuration / 1000);

  // Zone positions - calculated once and stored in ref for game loop access
  const zonePositionsRef = useRef(() => {
    const targetY = 800 - 100; // Center of the arena - moved down to give player reaction time
    const totalHeight = 16 + 12 + 8 + 10 + 12; // earlyNormal + earlyGood + perfect + lateGood + lateNormal
    const startY = targetY - totalHeight / 2;
    const endY = targetY + totalHeight / 2;
    return { targetY, totalHeight, startY, endY };
  });

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
    [gameState, notes, noteSpeedPxPerSec, setNotes, setActiveNotes, setCurrentTime, setMissedNotesCount, startTimeRef, lastFrameTimeRef]
  );

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

  return {
    zonePositionsRef,
    gameLoopRef,
  };
};
