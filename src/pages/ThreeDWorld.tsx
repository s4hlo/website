import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Stack } from '@mui/material';
import { LocationOn, DirectionsRun, FlightTakeoff, Block } from '@mui/icons-material';
import World3D from '../components/threejs/World3D';
import ThreePageContainer from '../components/threejs/ThreePageContainer';

const ThreeDWorld: React.FC = () => {
  const [showStats, setShowStats] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 2, z: 5 });
  const [isMoving, setIsMoving] = useState(false);
  const [collisionStatus, setCollisionStatus] = useState({
    isColliding: false,
    isSliding: false,
    boundariesCount: 0,
    nearbyBoundaries: 0
  });

  // Listen for player position updates from the 3D world
  useEffect(() => {
    const handlePlayerPositionUpdate = (event: CustomEvent) => {
      const { position, moving, collision } = event.detail;
      setPlayerPosition({
        x: Math.round(position.x * 100) / 100,
        y: Math.round(position.y * 100) / 100,
        z: Math.round(position.z * 100) / 100
      });
      setIsMoving(moving || false);
      setCollisionStatus(collision || {
        isColliding: false,
        isSliding: false,
        boundariesCount: 0,
        nearbyBoundaries: 0
      });
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
            p: 4,
            maxWidth: 300,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 3,
            zIndex: 1000,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 25px rgba(139, 92, 246, 0.2)",
              borderColor: "rgba(139, 92, 246, 0.4)",
            },
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#f8fafc", 
              mb: 3, 
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            🎮 3D World Controls
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              • <strong style={{ color: "#f8fafc" }}>WASD</strong> - Move around
            </Typography>
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              • <strong style={{ color: "#f8fafc" }}>Mouse</strong> - Look around
            </Typography>
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              • <strong style={{ color: "#f8fafc" }}>Space</strong> - Jump
            </Typography>
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              • <strong style={{ color: "#f8fafc" }}>Click</strong> - Lock mouse
            </Typography>
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              • <strong style={{ color: "#f8fafc" }}>ESC</strong> - Unlock mouse
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowInstructions(false)}
            sx={{ 
              mt: 3, 
              borderColor: "rgba(148, 163, 184, 0.3)",
              color: "#cbd5e1",
              "&:hover": {
                borderColor: "rgba(139, 92, 246, 0.6)",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }
            }}
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
            p: 4,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(10px)",
            border: `2px solid ${isMoving ? 'rgba(16, 185, 129, 0.6)' : 'rgba(148, 163, 184, 0.2)'}`,
            borderRadius: 3,
            zIndex: 1000,
            minWidth: 280,
            transition: 'all 0.3s ease',
            boxShadow: isMoving ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
            "&:hover": {
              boxShadow: `0 8px 25px ${isMoving ? 'rgba(16, 185, 129, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
              borderColor: isMoving ? 'rgba(16, 185, 129, 0.8)' : 'rgba(139, 92, 246, 0.4)',
            },
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#f8fafc", 
              mb: 3, 
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
            Player Status
          </Typography>
          <Stack spacing={2}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                pt: 1, 
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                color: "#cbd5e1"
              }}
            >
              <strong style={{ color: "#f8fafc" }}>Position:</strong> ({playerPosition.x}, {playerPosition.y}, {playerPosition.z})
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                pt: 1, 
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                color: "#cbd5e1"
              }}
            >
              <strong style={{ color: "#f8fafc" }}>Status:</strong> {playerPosition.y > 2 ? 'In Air' : 'On Ground'}
              {playerPosition.y > 2 && <FlightTakeoff sx={{ ml: 1, verticalAlign: 'middle', fontSize: '1rem' }} />}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: isMoving ? 'bold' : 'normal',
                color: isMoving ? "#10b981" : "#cbd5e1"
              }}
            >
              <strong style={{ color: "#f8fafc" }}>Movement:</strong> {isMoving ? 'Moving' : 'Idle'}
              {isMoving && <DirectionsRun sx={{ ml: 1, verticalAlign: 'middle', fontSize: '1rem' }} />}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                pt: 1, 
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                fontWeight: collisionStatus.isColliding ? 'bold' : 'normal',
                color: collisionStatus.isColliding ? "#ef4444" : "#cbd5e1"
              }}
            >
              <strong style={{ color: "#f8fafc" }}>Collision:</strong> {collisionStatus.isColliding ? 'Blocked' : 'Clear'}
              {collisionStatus.isColliding && <Block sx={{ ml: 1, verticalAlign: 'middle', fontSize: '1rem' }} />}
            </Typography>
            {collisionStatus.isColliding && (
              <Typography 
                variant="body2" 
                color="warning.main"
                sx={{ fontWeight: 'bold' }}
              >
                <strong style={{ color: "#f8fafc" }}>Sliding:</strong> Along boundary
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              <strong style={{ color: "#f8fafc" }}>Boundaries:</strong> {collisionStatus.boundariesCount} total, {collisionStatus.nearbyBoundaries} nearby
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
          p: 3,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: 3,
          zIndex: 1000,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.2)",
            borderColor: "rgba(139, 92, 246, 0.4)",
          },
        }}
      >
        <Stack spacing={2}>
          <Button
            variant={showStats ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setShowStats(!showStats)}
            sx={{
              bgcolor: showStats ? "#8b5cf6" : "transparent",
              color: showStats ? "white" : "#cbd5e1",
              borderColor: "rgba(148, 163, 184, 0.3)",
              "&:hover": {
                bgcolor: showStats ? "#7c3aed" : "rgba(139, 92, 246, 0.1)",
                borderColor: "rgba(139, 92, 246, 0.6)",
              }
            }}
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowInstructions(!showInstructions)}
            sx={{
              borderColor: "rgba(148, 163, 184, 0.3)",
              color: "#cbd5e1",
              "&:hover": {
                borderColor: "rgba(139, 92, 246, 0.6)",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }
            }}
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
          p: 3,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: 3,
          zIndex: 1000,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.2)",
            borderColor: "rgba(139, 92, 246, 0.4)",
          },
        }}
      >
        <Typography variant="body2" sx={{ color: "#cbd5e1" }} textAlign="center">
          Welcome to the 3D World! Click anywhere to start exploring.
        </Typography>
      </Paper>
    </ThreePageContainer>
  );
};

export default ThreeDWorld; 