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
  currentSong: Song
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
          const notAlreadySpawned = !notes.includes(note);
          const notAlreadyActive = !lastActiveNotesRef.current.some(activeNote => 
            activeNote.value === note.value && activeNote.time === note.time
          );
          return noteTime && notAlreadySpawned && notAlreadyActive;
        }
      );

      if (notesToSpawn.length > 0) {
        console.log(`Spawning ${notesToSpawn.length} new notes`);
        setNotes((prev) => [...prev, ...notesToSpawn]);
        setActiveNotes((prev) => {
          const newActiveNotes = [
            ...prev,
            ...notesToSpawn.map((note) => ({
              ...note,
              id: `${note.value}-${note.time}-${Math.random()}`,
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

        // Store the updated state for next frame
        lastActiveNotesRef.current = updatedNotes;
        
        // Log for debugging
        if (updatedNotes.length !== currentNotes.length) {
          console.log(`GameLoop: processed ${currentNotes.length} notes, result: ${updatedNotes.length}`);
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
