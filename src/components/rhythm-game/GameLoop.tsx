import { useCallback, useEffect, useRef } from "react";
import type { Note, Song } from "../../types/rhythm-game";

export const useGameLoop = (
  gameState: "menu" | "playing",
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
    lanes: number;
  },
  currentSong: Song,
  pendingNoteRemovals: Set<string>,
  clearPendingRemovals: () => void
) => {
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastActiveNotesRef = useRef<Array<Note & { id: string; y: number }>>([]);

  // Calculate note speed in pixels per second
  // Convert quarter note duration to pixels per second
  // 50px per quarter note, so speed = 50px / (quarterNoteDuration/1000) seconds
  const noteSpeedPxPerSec = 50 / (currentSong.quarterNoteDuration / 1000);

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
      const currentQuarterNote =
        songTime / (currentSong.quarterNoteDuration / 1000);
      const notesToSpawn = currentSong.notes.filter(
        (note: Note) => {
          const noteTime = note.time <= currentQuarterNote;
          const notAlreadySpawned = !notes.some(existingNote => 
            existingNote.value === note.value && 
            existingNote.position === note.position && 
            Math.abs(existingNote.time - note.time) < 0.01
          );
          const notAlreadyActive = !lastActiveNotesRef.current.some(activeNote => 
            activeNote.value === note.value && 
            activeNote.position === note.position && 
            Math.abs(activeNote.time - note.time) < 0.01
          );
          
          // Log potential spawn issues
          if (noteTime && notAlreadySpawned && !notAlreadyActive) {
            console.log(`Note spawn blocked: ${note.value} at time ${note.time}, position ${note.position}`);
            console.log(`Already spawned: ${!notAlreadySpawned}`);
            console.log(`Already active: ${!notAlreadyActive}`);
          }
          
          return noteTime && notAlreadySpawned && notAlreadyActive;
        }
      );

      if (notesToSpawn.length > 0) {
        console.log(`Spawning ${notesToSpawn.length} new notes at time ${songTime.toFixed(2)}s`);
        notesToSpawn.forEach(note => {
          console.log(`  - Note: ${note.value}, time: ${note.time}, position: ${note.position}`);
        });
        
        setNotes((prev) => [...prev, ...notesToSpawn]);
        setActiveNotes((prev) => {
          const newActiveNotes = [
            ...prev,
            ...notesToSpawn.map((note) => ({
              ...note,
              id: `${note.value}-${note.time}-${note.position}-${Math.random().toString(36).substr(2, 9)}`,
              y: -50, // Start notes higher above the screen for better visual flow with centered arena
            })),
          ];
          lastActiveNotesRef.current = newActiveNotes;
          return newActiveNotes;
        });
      }

      // Single update: move notes and detect misses in one operation
      setActiveNotes((prev) => {
        // Use the last known state to avoid conflicts with note removal
        const currentNotes = prev.length > 0 ? prev : lastActiveNotesRef.current;
        let missedNotes = 0;

        const updatedNotes = currentNotes
          .map((note: Note & { id: string; y: number }) => ({
            ...note,
            y: note.y + noteSpeedPxPerSec * deltaTimeSeconds, // Use delta-time for consistent speed
          }))
          .filter((note) => {
            // Remove notes that are marked for removal by collision detection
            if (pendingNoteRemovals.has(note.id)) {
              console.log(`Removing note ${note.id} marked for removal by collision`);
              return false;
            }
            
            // Remove notes that pass the arena boundary (miss detection)
            if (note.y > endY + 50) {
              // Added buffer for better note removal
              missedNotes++;
              console.log(`Note ${note.id} missed at y: ${note.y}, endY: ${endY}`);
              return false;
            }
            return true;
          });

        // Clear pending removals after processing
        if (pendingNoteRemovals.size > 0) {
          console.log(`Cleared ${pendingNoteRemovals.size} pending removals`);
          clearPendingRemovals();
        }

        // Update missed notes count to trigger combo reset
        if (missedNotes > 0) {
          console.log(`Missed ${missedNotes} notes`);
          setMissedNotesCount((prev) => prev + missedNotes);
        }

        // Store the updated state for next frame
        lastActiveNotesRef.current = updatedNotes;
        
        // Log for debugging
        if (updatedNotes.length !== currentNotes.length) {
          console.log(`GameLoop: processed ${currentNotes.length} notes, result: ${updatedNotes.length}, missed: ${missedNotes}, pending removals: ${pendingNoteRemovals.size}`);
        }
        
        return updatedNotes;
      });

      gameLoopRef.current = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp)
      );
    },
    [
      gameState,
      notes,
      noteSpeedPxPerSec,
      setNotes,
      setActiveNotes,
      setCurrentTime,
      setMissedNotesCount,
      startTimeRef,
      lastFrameTimeRef,
      songArena,
      pendingNoteRemovals,
      clearPendingRemovals,
    ]
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
  }, [gameState, gameLoop, songArena]);

  return {
    zonePositionsRef,
    gameLoopRef,
  };
};
