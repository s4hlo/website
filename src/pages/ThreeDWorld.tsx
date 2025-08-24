import React from 'react';
import ThreePageContainer from '../components/threejs/ThreePageContainer';
import World3D from '../components/threejs/World3D';

export default function ThreeDWorld() {
  return (
    <ThreePageContainer className="three-d-world-page">
      {(statsVisible) => (
        <World3D statsVisible={statsVisible} />
      )}
    </ThreePageContainer>
  );
} 