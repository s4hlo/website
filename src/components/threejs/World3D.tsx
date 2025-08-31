import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, Environment } from '@react-three/drei';
import * as THREE from 'three';
import PlayerController from './PlayerController';
import MovementBoundary from './MovementBoundary';
import { colors } from '../../theme';

interface World3DProps {
  className?: string;
  statsVisible?: boolean;
}

const World3D: React.FC<World3DProps> = ({
  className,
  statsVisible = false,
}) => {
  return (
    <div
      className={className}
      style={{ width: '100%', height: 'calc(100vh - var(--navbar-height))' }}
    >
      <Canvas
        camera={{
          position: [0, 2, 5], // Lower height, closer to ground for FPS feel
          fov: 75, // Wider FOV for better FPS experience
          near: 0.1,
          far: 1000,
        }}
        style={{
          background: colors.playground.elements.sky_blue,
          outline: 'none',
          cursor: 'crosshair',
        }}
        gl={{
          antialias: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(colors.playground.elements.sky_blue);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // Configurar o renderer para sombras
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          
          // Ensure canvas can receive focus and events
          gl.domElement.tabIndex = 0;
          gl.domElement.style.outline = 'none';

          // Add click handler to focus canvas
          gl.domElement.addEventListener('click', () => {
            gl.domElement.focus();
          });
        }}
      >
        {statsVisible && <Stats />}

        {/* Sistema de iluminação avançado com sombras */}
        
        {/* Luz direcional principal com sombras */}
        <directionalLight
          position={[15, 20, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
        />
        
        {/* Luz de preenchimento (fill light) */}
        <directionalLight
          position={[-10, 10, -10]}
          intensity={0.4}
          color={colors.threeD.world.environment.ambient}
        />
        
        {/* Luz ambiente */}
        <ambientLight
          intensity={0.3}
          color={colors.threeD.world.environment.ambient}
        />
        
        {/* Ambiente para reflexões e iluminação global */}
        <Environment preset="sunset" background={false} resolution={256} />

        {/* Player Controller - MUST be first to handle input */}
        <PlayerController speed={5} jumpHeight={5} />

        {/* Chão com sombras */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[10000, 10000]} />
          <meshStandardMaterial
            color={colors.threeD.world.environment.ground}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Limite principal de movimento - polígono irregular */}
        <MovementBoundary
          points={[
            [-20, -20], // Canto inferior esquerdo
            [20, -20], // Canto inferior direito
            [20, -10], // Saliente inferior direito
            [10, -10], // Reentrância inferior direita
            [10, 0], // Saliente inferior direito interno
            [0, 0], // Centro (canto interno)
            [0, 10], // Saliente superior direito interno
            [10, 10], // Reentrância superior direita
            [10, 20], // Saliente superior direito
            [-10, 20], // Canto superior esquerdo
            [-10, 10], // Reentrância superior esquerda
            [-20, 10], // Saliente superior esquerdo
            [-20, -20], // Volta ao início
          ]}
          height={2}
          color={colors.playground.elements.bright_green}
          showDebug={false}
          showWalls={true}
          wallHeight={4}
        />
      </Canvas>
    </div>
  );
};

export default World3D;
