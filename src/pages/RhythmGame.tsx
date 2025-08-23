import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Note, Song, SongArena, Score } from '../types/rhythm-game';

// Sample song data
const sampleSong: Song = {
  name: "Sample Rhythm Song",
  quarterNoteDuration: 500, // 500ms per quarter note
  notes: [
    { value: "C5", position: 0, instrument: 0, time: 0 },
    { value: "D5", position: 1, instrument: 0, time: 1 },
    { value: "E5", position: 2, instrument: 1, time: 2 },
    { value: "F5", position: 0, instrument: 0, time: 3 },
    { value: "F5", position: 1, instrument: 0, time: 4 },
    { value: "F5", position: 2, instrument: 0, time: 5 },
    { value: "C5", position: 0, instrument: 0, time: 6 },
    { value: "D5", position: 1, instrument: 0, time: 7 },
    { value: "C5", position: 2, instrument: 0, time: 8 },
    { value: "D5", position: 0, instrument: 0, time: 9 },
    { value: "D5", position: 1, instrument: 0, time: 10 },
    { value: "D5", position: 2, instrument: 0, time: 11 },
    { value: "C5", position: 0, instrument: 0, time: 12 },
    { value: "D5", position: 1, instrument: 0, time: 13 },
    { value: "E5", position: 2, instrument: 1, time: 14 },
    { value: "F5", position: 0, instrument: 0, time: 15 },
    { value: "F5", position: 1, instrument: 0, time: 16 },
    { value: "F5", position: 2, instrument: 0, time: 17 },
    { value: "C5", position: 0, instrument: 0, time: 18 },
    { value: "D5", position: 1, instrument: 0, time: 19 },
    { value: "C5", position: 2, instrument: 0, time: 20 },
    { value: "D5", position: 0, instrument: 0, time: 21 },
    { value: "D5", position: 1, instrument: 0, time: 22 },
    { value: "D5", position: 2, instrument: 0, time: 23 },
  ]
};

const songArena: SongArena = {
  earlyNormalZoneHeight: 50,
  earlyGoodZoneHeight: 50,
  perfectZoneHeight: 20,
  lateGoodZoneHeight: 50,
  lateNormalZoneHeight: 50
};

const scoreValues: Score = {
  perfect: 100,
  good: 50,
  normal: 10
};

const RhythmGame: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNotes, setActiveNotes] = useState<Array<Note & { id: string; y: number }>>([]);
  const [keyStates, setKeyStates] = useState<boolean[]>([false, false, false, false, false, false]);
  const [lastHitZone, setLastHitZone] = useState<string>('');
  const [lastHitPoints, setLastHitPoints] = useState<number>(0);

  // Helper function to calculate zone positions
  const getZonePositions = () => {
    const targetY = 450; // Center of the arena - moved down to give player reaction time
    const totalHeight = songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight + songArena.lateNormalZoneHeight;
    const startY = targetY - totalHeight / 2;
    const endY = targetY + totalHeight / 2;
    return { targetY, totalHeight, startY, endY };
  };

  const gameLoopRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);

  const keys = ['S', 'D', 'F', 'J', 'K', 'L'];
  const noteColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== 'playing') return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const songTime = elapsed / 1000; // Convert to seconds
    setCurrentTime(songTime);

    // Spawn notes based on song time
    const currentQuarterNote = songTime / (sampleSong.quarterNoteDuration / 1000);
    const notesToSpawn = sampleSong.notes.filter(note => 
      note.time <= currentQuarterNote && 
      !notes.includes(note)
    );

    if (notesToSpawn.length > 0) {
      setNotes(prev => [...prev, ...notesToSpawn]);
      setActiveNotes(prev => [
        ...prev,
        ...notesToSpawn.map(note => ({
          ...note,
          id: `${note.value}-${note.time}-${Math.random()}`,
          y: -50 // Start notes higher above the screen for better visual flow with centered arena
        }))
      ]);
    }

    // Update note positions
    setActiveNotes(prev => 
      prev.map(note => ({
        ...note,
        y: note.y + 1.8 // Note speed - adjusted for centered arena with reaction time
      })).filter(note => note.y < 600) // Remove notes that go off screen
    );

    // Check for missed notes
    setActiveNotes(prev => 
      prev.filter(note => {
        // Calculate zone positions (same as in drawing)
        const { endY } = getZonePositions();
        
        if (note.y > endY + 50) { // Added buffer for better note removal
          // Note missed
          setCombo(0);
          return false;
        }
        return true;
      })
    );

    gameLoopRef.current = requestAnimationFrame((timestamp) => gameLoop(timestamp));
  }, [gameState, notes]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame((timestamp) => gameLoop(timestamp));
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
      if (gameState !== 'playing') return;
      
      const keyIndex = keys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      e.preventDefault();
      setKeyStates(prev => {
        const newStates = [...prev];
        newStates[keyIndex] = true;
        return newStates;
      });

      // Check for note hits
      const hitNote = activeNotes.find(note => {
        if (note.position !== keyIndex) return false;
        
        // Calculate zone positions (same as in drawing)
        const { startY, endY } = getZonePositions();
        
        return note.y >= startY && note.y <= endY;
      });

      if (hitNote) {
        // Calculate zone positions (same as in drawing)
        const { startY } = getZonePositions();
        
        // Determine which zone the note was hit in
        let points = 0;
        let zoneName = '';
        
        if (hitNote.y >= startY && hitNote.y < startY + songArena.earlyNormalZoneHeight) {
          // Early Normal zone
          points = scoreValues.normal;
          zoneName = 'Early Normal';
        } else if (hitNote.y >= startY + songArena.earlyNormalZoneHeight && hitNote.y < startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight) {
          // Early Good zone
          points = scoreValues.good;
          zoneName = 'Early Good';
        } else if (hitNote.y >= startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight && hitNote.y < startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight) {
          // Perfect zone
          points = scoreValues.perfect;
          zoneName = 'Perfect';
        } else if (hitNote.y >= startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight && hitNote.y < startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight) {
          // Late Good zone
          points = scoreValues.good;
          zoneName = 'Late Good';
        } else if (hitNote.y >= startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight && hitNote.y < startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight + songArena.lateNormalZoneHeight) {
          // Late Normal zone
          points = scoreValues.normal;
          zoneName = 'Late Normal';
        }

        if (points > 0) {
          setScore(prev => prev + points);
          setCombo(prev => prev + 1);
          
          // Show zone feedback
          setLastHitZone(zoneName);
          setLastHitPoints(points);
          console.log(`Hit: ${zoneName} - ${points} points!`);
          
          // Remove hit note
          setActiveNotes(prev => prev.filter(note => note.id !== hitNote.id));
          
          // Play sound
          if (audioContextRef.current) {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            
            oscillator.frequency.setValueAtTime(440 + (hitNote.instrument * 100), audioContextRef.current.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContextRef.current.currentTime + 0.1);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyIndex = keys.indexOf(e.key.toUpperCase());
      if (keyIndex === -1) return;

      setKeyStates(prev => {
        const newStates = [...prev];
        newStates[keyIndex] = false;
        return newStates;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, activeNotes, keys]);

  // Draw game
  useEffect(() => {
    if (!canvasRef.current || gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth, canvas.height);

    // Draw lanes
    const laneWidth = canvasWidth / 6;
    const { targetY, totalHeight, startY: arenaStartY } = getZonePositions();
    const arenaHeight = totalHeight;
    
    for (let i = 0; i < 6; i++) {
      // Lane background
      ctx.fillStyle = keyStates[i] ? '#ffffff' : '#333333';
      ctx.fillRect(i * laneWidth, arenaStartY, laneWidth, arenaHeight);
      
      // Lane borders
      ctx.strokeStyle = keyStates[i] ? '#00ff00' : '#666666';
      ctx.lineWidth = keyStates[i] ? 3 : 1;
      ctx.strokeRect(i * laneWidth, arenaStartY, laneWidth, arenaHeight);
      
      // Key indicator
      if (keyStates[i]) {
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(keys[i], i * laneWidth + laneWidth / 2, arenaStartY + 30);
        ctx.textAlign = 'left';
      }
    }

    // Draw precision zones
    // startY is already calculated above for lanes
    const startY = arenaStartY;
    
    // Normal zone (soft purple) - top
    ctx.fillStyle = 'rgba(147, 112, 219, 0.4)';
    ctx.fillRect(0, startY, canvasWidth, songArena.earlyNormalZoneHeight);
    
    // Good zone (bright blue) - above perfect
    ctx.fillStyle = 'rgba(64, 224, 208, 0.4)';
    ctx.fillRect(0, startY + songArena.earlyNormalZoneHeight, canvasWidth, songArena.earlyGoodZoneHeight);
    
    // Perfect zone (bright green) - center
    ctx.fillStyle = 'rgba(0, 255, 127, 0.4)';
    ctx.fillRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight, canvasWidth, songArena.perfectZoneHeight);
    
    // Good zone (bright blue) - below perfect
    ctx.fillStyle = 'rgba(64, 224, 208, 0.4)';
    ctx.fillRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight, canvasWidth, songArena.lateGoodZoneHeight);
    
    // Normal zone (soft purple) - bottom
    ctx.fillStyle = 'rgba(147, 112, 219, 0.4)';
    ctx.fillRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight, canvasWidth, songArena.lateNormalZoneHeight);
    
    // Zone borders
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Draw borders for all zones
    ctx.strokeRect(0, startY, canvasWidth, songArena.earlyNormalZoneHeight);
    ctx.strokeRect(0, startY + songArena.earlyNormalZoneHeight, canvasWidth, songArena.earlyGoodZoneHeight);
    ctx.strokeRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight, canvasWidth, songArena.perfectZoneHeight);
    ctx.strokeRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight, canvasWidth, songArena.lateGoodZoneHeight);
    ctx.strokeRect(0, startY + songArena.earlyNormalZoneHeight + songArena.earlyGoodZoneHeight + songArena.perfectZoneHeight + songArena.lateGoodZoneHeight, canvasWidth, songArena.lateNormalZoneHeight);
    
    // Target line (center)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(canvasWidth, targetY);
    ctx.stroke();

    // Draw notes
    activeNotes.forEach(note => {
      const x = note.position * laneWidth + laneWidth / 2;
      const y = note.y;
      
      // Note rectangle with rounded corners
      const noteWidth = 40;
      const noteHeight = 20;
      const cornerRadius = 8;
      
      ctx.fillStyle = noteColors[note.position];
      ctx.beginPath();
      ctx.roundRect(x - noteWidth / 2, y - noteHeight / 2, noteWidth, noteHeight, cornerRadius);
      ctx.fill();
      
      // Note border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw UI - moved to top center for better visibility
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvasWidth / 2, 40);
    ctx.fillText(`Combo: ${combo}`, canvasWidth / 2, 70);
    ctx.textAlign = 'left';
    
    // Show last hit feedback - moved to center
    if (lastHitZone && lastHitPoints > 0) {
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = lastHitZone === 'Perfect' ? '#00ff00' : lastHitZone.includes('Good') ? '#ffff00' : '#ff0000';
      ctx.fillText(`${lastHitZone} +${lastHitPoints}`, canvasWidth / 2, 120);
      ctx.textAlign = 'left';
    }

  }, [gameState, activeNotes, keyStates, score, combo, currentTime, songArena, lastHitZone, lastHitPoints, canvasWidth]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setCombo(0);
    setNotes([]);
    setActiveNotes([]);
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-purple-400">Rhythm Game</h1>
          <p className="text-xl mb-8 text-gray-300">Use S D F J K L keys to play!</p>
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'paused') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Game Paused</h2>
          <div className="space-x-4">
            <button
              onClick={resumeGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Resume
            </button>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex items-center justify-center">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={600}
        className="w-full h-[600px] block"
      />
      
      {/* Game Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={pauseGame}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Pause
        </button>
        <button
          onClick={resetGame}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Quit
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-400">
        <p>Press S D F J K L to hit notes</p>
        <p>Hit notes when they reach the white line</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Perfect: +100 points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded"></div>
            <span>Good: +50 points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span>Normal: +10 points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhythmGame;