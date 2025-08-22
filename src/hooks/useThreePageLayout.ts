import { useMemo } from 'react';

export interface ThreePageLayoutStyles {
  container: {
    height: string;
    width: string;
    position: 'relative';
    overflow: 'hidden';
  };
  canvas: {
    background?: string;
  };
}

export const useThreePageLayout = (background?: string): ThreePageLayoutStyles => {
  return useMemo(() => ({
    container: {
      height: 'calc(100vh - var(--navbar-height))',
      width: '100%',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    canvas: {
      background: background || 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    },
  }), [background]);
}; 