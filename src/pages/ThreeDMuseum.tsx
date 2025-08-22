import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import ThreePageContainer from '../components/threejs/ThreePageContainer';
import { Player } from '../components/threejs/Player';
import { Ground } from '../components/threejs/Ground';
import { Cube, Cubes } from '../components/threejs/Cube';

const ThreeDMuseum: React.FC = () => {
  return (
    <ThreePageContainer>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Canvas
          camera={{ fov: 45 }}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }}
          shadows={true}
          gl={{ antialias: true }}
        >
          {/* Sky and Lighting */}
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.3} />
          <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
          
          {/* Physics World */}
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player />
            
            {/* Initial cube for building */}
            <Cube position={[0, 0.5, -10]} />
            <Cubes />
            
          </Physics>
          
          {/* First-person controls */}
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </ThreePageContainer>
  );
};

export default ThreeDMuseum;
