import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { LocationOn, DirectionsRun, FlightTakeoff } from '@mui/icons-material';
import World3D from '../components/threejs/World3D';
import ThreePageContainer from '../components/threejs/ThreePageContainer';

const ThreeDWorld: React.FC = () => {
  const [showStats, setShowStats] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 2, z: 5 });
  const [isMoving, setIsMoving] = useState(false);

  // Listen for player position updates from the 3D world
  useEffect(() => {
    const handlePlayerPositionUpdate = (event: CustomEvent) => {
      const { position, moving } = event.detail;
      setPlayerPosition({
        x: Math.round(position.x * 100) / 100,
        y: Math.round(position.y * 100) / 100,
        z: Math.round(position.z * 100) / 100
      });
      setIsMoving(moving || false);
    };

    window.addEventListener('playerPositionUpdate', handlePlayerPositionUpdate as EventListener);
    return () => {
      window.removeEventListener('playerPositionUpdate', handlePlayerPositionUpdate as EventListener);
    };
  }, []);

  return (
    <ThreePageContainer className="three-d-world-page">
      {/* 3D World Canvas */}
      <World3D showStats={showStats} />
      
      {/* Instructions Overlay */}
      {showInstructions && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100px',
            left: '20px',
            p: 3,
            maxWidth: 300,
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000,
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            3D World Controls
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • <strong>WASD</strong> - Move around
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Mouse</strong> - Look around
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Space</strong> - Jump
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Click</strong> - Lock mouse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>ESC</strong> - Unlock mouse
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowInstructions(false)}
            sx={{ mt: 2 }}
          >
            Hide Instructions
          </Button>
        </Paper>
      )}

      {/* Performance Monitor */}
      {showStats && (
        <Paper
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            p: 2,
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${isMoving ? 'rgba(76, 175, 80, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
            zIndex: 1000,
            minWidth: 200,
            transition: 'border-color 0.3s ease',
            boxShadow: isMoving ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
            Player Position
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>X:</strong> {playerPosition.x}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Y:</strong> {playerPosition.y}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Z:</strong> {playerPosition.z}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1, 
                pt: 1, 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
              }}
            >
              <strong>Status:</strong> {playerPosition.y > 2 ? 'In Air' : 'On Ground'}
              {playerPosition.y > 2 && <FlightTakeoff sx={{ ml: 1, verticalAlign: 'middle', fontSize: '1rem' }} />}
            </Typography>
            <Typography 
              variant="body2" 
              color={isMoving ? "success.main" : "text.secondary"}
              sx={{ fontWeight: isMoving ? 'bold' : 'normal' }}
            >
              <strong>Movement:</strong> {isMoving ? 'Moving' : 'Idle'}
              {isMoving && <DirectionsRun sx={{ ml: 1, verticalAlign: 'middle', fontSize: '1rem' }} />}
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* Control Panel */}
      <Paper
        sx={{
          position: 'absolute',
          top: '300px',
          right: '20px',
          p: 2,
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
        }}
      >
        <Stack spacing={1}>
          <Button
            variant={showStats ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </Button>
        </Stack>
      </Paper>

      {/* Welcome Message */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          p: 2,
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Welcome to the 3D World! Click anywhere to start exploring.
        </Typography>
      </Paper>
    </ThreePageContainer>
  );
};

export default ThreeDWorld; 