import { useMemo } from 'react';
import { colors } from '../theme';

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

export const useThreePageLayout = (
  background?: string,
): ThreePageLayoutStyles => {
  return useMemo(
    () => ({
      container: {
        height: '100vh',
        width: '100%',
        position: 'relative' as const,
        overflow: 'hidden',
      },
      canvas: {
        background: background || colors.gradients.secondary,
      },
    }),
    [background],
  );
};
