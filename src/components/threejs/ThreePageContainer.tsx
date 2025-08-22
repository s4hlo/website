import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { useThreePageLayout } from '../../hooks/useThreePageLayout';

interface ThreePageContainerProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  background?: string;
  overflow?: 'hidden' | 'auto' | 'visible';
}

/**
 * Container padrão para todas as páginas ThreeJS
 * 
 * Características:
 * - Altura automática considerando o navbar
 * - Sem scroll desnecessário
 * - Layout consistente em todas as páginas
 * - Overflow configurável
 * 
 * Uso:
 * ```tsx
 * <ThreePageContainer>
 *   <Canvas>...</Canvas>
 * </ThreePageContainer>
 * ```
 */
const ThreePageContainer: React.FC<ThreePageContainerProps> = ({ 
  children, 
  background,
  overflow = 'hidden',
  ...boxProps 
}) => {
  const styles = useThreePageLayout(background);
  
  return (
    <Box
      {...boxProps}
      sx={{
        ...styles.container,
        overflow,
      }}
    >
      {children}
    </Box>
  );
};

export default ThreePageContainer; 