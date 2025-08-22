import React from 'react';
import MovementBoundary from './MovementBoundary';

const MovementBoundaryExample: React.FC = () => {
  return (
    <group>
      {/* Exemplo 1: Área retangular simples */}
      <MovementBoundary 
        points={[
          [-5, -5], [5, -5], [5, 5], [-5, 5]
        ]}
        height={2}
        color="#FF0000"
        showDebug={true}
      />
      
      {/* Exemplo 2: Área triangular */}
      <MovementBoundary 
        points={[
          [0, 0], [3, 0], [1.5, 3]
        ]}
        height={2}
        color="#00FF00"
        showDebug={true}
      />
      
      {/* Exemplo 3: Área em forma de L */}
      <MovementBoundary 
        points={[
          [-3, -3], [3, -3], [3, -1], [1, -1], [1, 3], [-3, 3]
        ]}
        height={2}
        color="#0000FF"
        showDebug={true}
      />
      
      {/* Exemplo 4: Área circular aproximada (octágono) */}
      <MovementBoundary 
        points={[
          [0, 4], [2.83, 2.83], [4, 0], [2.83, -2.83], 
          [0, -4], [-2.83, -2.83], [-4, 0], [-2.83, 2.83]
        ]}
        height={2}
        color="#FF00FF"
        showDebug={true}
      />
    </group>
  );
};

export default MovementBoundaryExample; 