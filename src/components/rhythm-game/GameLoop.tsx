import { useCallback, useEffect, useRef } from "react";
import type { Note, Song } from "../../types/rhythm-game";

// NOTE_FALL_SPEED is now dynamic and comes from gameState.getGameSpeed()

export const useGameLoop = (
  gameState: "menu" | "playing",
  gameSpeed: number,
  notes: Note[],
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setActiveNotes: React.Dispatch<
    React.SetStateAction<Array<Note & { id: string; y: number }>>
  >,
  setCurrentTime: (time: number) => void,
  setMissedNotesCount: React.Dispatch<React.SetStateAction<number>>,
  startTimeRef: React.MutableRefObject<number>,
  lastFrameTimeRef: React.MutableRefObject<number>,
  songArena: {
    earlyNormalZoneHeight: number;
    earlyGoodZoneHeight: number;
    perfectZoneHeight: number;
    lateGoodZoneHeight: number;
    lateNormalZoneHeight: number;
  },
  currentSong: Song,
  pendingNoteRemovals: Set<string>,
  clearPendingRemovals: () => void
) => {
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastActiveNotesRef = useRef<Array<Note & { id: string; y: number }>>([]);

  const CONST_1 = 500;
  const CONST_3 = 1000;

  const noteSpeedPxPerSec = gameSpeed / (CONST_1 / CONST_3);

  // Zone positions - calculated based on songArena configuration
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
      const currentQuarterNote = songTime / (CONST_1 / CONST_3);
      const notesToSpawn = currentSong.notes.filter(
        (note: Note) => {
          const noteTime = note.time <= currentQuarterNote;
          const notAlreadySpawned = !notes.some(existingNote => 
            existingNote.name === note.name && 
            existingNote.position === note.position && 
            Math.abs(existingNote.time - note.time) < 0.01
          );
          const notAlreadyActive = !lastActiveNotesRef.current.some(activeNote => 
            activeNote.name === note.name && 
            activeNote.position === note.position && 
            Math.abs(activeNote.time - note.time) < 0.01
          );
          
          // Log potential spawn issues
          if (noteTime && notAlreadySpawned && !notAlreadyActive) {
            console.log(`Note spawn blocked: ${note.name} at time ${note.time}, position ${note.position}`);
            console.log(`Already spawned: ${!notAlreadySpawned}`);
            console.log(`Already active: ${!notAlreadyActive}`);
          }
          
          return noteTime && notAlreadySpawned && notAlreadyActive;
        }
      );

      if (notesToSpawn.length > 0) {
        console.log(`Spawning ${notesToSpawn.length} new notes at time ${songTime.toFixed(2)}s`);
        notesToSpawn.forEach((note) => {
          console.log(`  - Note: ${note.name}, time: ${note.time}, position: ${note.position}`);
        });

        // Add new notes to active notes
        const newActiveNotes = notesToSpawn.map((note) => ({
          ...note,
          id: `${note.name}-${note.time}-${note.position}-${Math.random().toString(36).substr(2, 9)}`,
          y: 0, // Start at top
        }));

        setActiveNotes((prev) => [...prev, ...newActiveNotes]);
        setNotes((prev) => [...prev, ...notesToSpawn]);
      }

      // Update existing active notes positions
      setActiveNotes((prev) => {
        const updatedNotes = prev
          .map((note) => {
            // Skip notes marked for removal
            if (pendingNoteRemovals.has(note.id)) {
              return null;
            }

            // Calculate new Y position based on speed
            const newY = note.y + noteSpeedPxPerSec * deltaTimeSeconds;

            // Check if note has passed the target zone
            if (newY > endY + 50) {
              // Note missed - remove it and increment missed count
              setMissedNotesCount((prev) => prev + 1);
              return null;
            }

            return { ...note, y: newY };
          })
          .filter((note) => note !== null) as Array<Note & { id: string; y: number }>;

        // Update last active notes ref for next frame
        lastActiveNotesRef.current = updatedNotes;

        return updatedNotes;
      });

      // Clean up pending removals
      if (pendingNoteRemovals.size > 0) {
        clearPendingRemovals();
      }

      // Continue game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [
      gameState,
      notes,
      setNotes,
      setActiveNotes,
      setCurrentTime,
      setMissedNotesCount,
      startTimeRef,
      lastFrameTimeRef,
      songArena,
      currentSong,
      pendingNoteRemovals,
      clearPendingRemovals,
      noteSpeedPxPerSec,
    ]
  );

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return {
    gameLoopRef,
  };
};
