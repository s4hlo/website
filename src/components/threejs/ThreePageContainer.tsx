import React from 'react';
import { Box } from '@mui/material';
import { useThreePageLayout } from '../../hooks/useThreePageLayout';
import { useStatsToggle } from '../../hooks/useStatsToggle';

interface ThreePageContainerProps {
  children: React.ReactNode | ((statsVisible: boolean) => React.ReactNode);
  background?: string;
  overflow?: 'hidden' | 'auto' | 'visible';
  showStats?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Container padrão para todas as páginas ThreeJS
 *
 * Características:
 * - Altura automática considerando o navbar
 * - Sem scroll desnecessário
 * - Layout consistente em todas as páginas
 * - Overflow configurável
 * - Funcionalidade de toggle de stats com tecla P
 *
 * Uso:
 * ```tsx
 * <ThreePageContainer>
 *   <Canvas>...</Canvas>
 * </ThreePageContainer>
 *
 * // Ou com função para acessar o estado dos stats:
 * <ThreePageContainer>
 *   {(statsVisible) => (
 *     <Canvas>
 *       {statsVisible && <Stats />}
 *       ...
 *     </Canvas>
 *   )}
 * </ThreePageContainer>
 * ```
 */
const ThreePageContainer: React.FC<ThreePageContainerProps> = ({
  children,
  background,
  overflow = 'hidden',
  showStats = false,
  className,
  style,
}) => {
  const styles = useThreePageLayout(background);
  const { statsVisible } = useStatsToggle(showStats);

  return (
    <Box
      className={className}
      style={style}
      sx={{
        ...styles.container,
        overflow,
      }}
    >
      {typeof children === 'function' ? children(statsVisible) : children}
    </Box>
  );
};

export default ThreePageContainer;
