import React from "react";
import { Box, Typography, Paper, Slider, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// ===== TIPOS PARA O OVERLAY =====
export interface PhysicsConfigState {
  mouse_follower_size: number;
  center_attraction_force: number;
  sphere_bounceness: number;
}

// ===== COMPONENTE DE OVERLAY DE CONFIGURAÇÃO =====
const PhysicsConfigOverlay: React.FC<{
  config: PhysicsConfigState;
  onConfigChange: (newConfig: PhysicsConfigState) => void;
  onApply: (key: keyof PhysicsConfigState, value: number) => void;
}> = ({ config, onConfigChange, onApply }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1000,
        width: 300,
      }}
    >
      <Paper
        key={"physics-config"}
        sx={{
          mt: 2,
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
          ⚙️ Physics Configuration
        </Typography>

        {/* Mouse Follower Size */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              🎯 Mouse Follower Size
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#f8fafc", fontWeight: "bold" }}
            >
              {config.mouse_follower_size.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Slider
              value={config.mouse_follower_size}
              onChange={(_, value) =>
                onConfigChange({
                  ...config,
                  mouse_follower_size: value as number,
                })
              }
              min={0.1}
              max={5}
              step={0.1}
              sx={{
                flex: 1,
                color: "#8b5cf6",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#8b5cf6",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#8b5cf6",
                },
              }}
            />
            <IconButton
              onClick={() =>
                onApply("mouse_follower_size", config.mouse_follower_size)
              }
              sx={{
                bgcolor: "#8b5cf6",
                color: "white",
                "&:hover": { bgcolor: "#7c3aed" },
                width: 36,
                height: 36,
              }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Center Attraction Force */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              🧲 Center Attraction Force
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#f8fafc", fontWeight: "bold" }}
            >
              {config.center_attraction_force.toFixed(3)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Slider
              value={config.center_attraction_force}
              onChange={(_, value) =>
                onConfigChange({
                  ...config,
                  center_attraction_force: value as number,
                })
              }
              min={0}
              max={0.1}
              step={0.001}
              sx={{
                flex: 1,
                color: "#10b981",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#10b981",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#10b981",
                },
              }}
            />
            <IconButton
              onClick={() =>
                onApply(
                  "center_attraction_force",
                  config.center_attraction_force
                )
              }
              sx={{
                bgcolor: "#10b981",
                color: "white",
                "&:hover": { bgcolor: "#059669" },
                width: 36,
                height: 36,
              }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Sphere Bounceness */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              🏀 Sphere Bounceness
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#f8fafc", fontWeight: "bold" }}
            >
              {config.sphere_bounceness.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Slider
              value={config.sphere_bounceness}
              onChange={(_, value) =>
                onConfigChange({
                  ...config,
                  sphere_bounceness: value as number,
                })
              }
              min={0}
              max={1}
              step={0.01}
              sx={{
                flex: 1,
                color: "#f59e0b",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#f59e0b",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#f59e0b",
                },
              }}
            />
            <IconButton
              onClick={() =>
                onApply("sphere_bounceness", config.sphere_bounceness)
              }
              sx={{
                bgcolor: "#f59e0b",
                color: "white",
                "&:hover": { bgcolor: "#d97706" },
                width: 36,
                height: 36,
              }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PhysicsConfigOverlay;
