import { Box, Tooltip } from '@mui/material';
import { colors, colorUtils } from '../theme';
import type { Tool } from '../data/skills';
import * as SiIcons from 'react-icons/si';
import { VscFilePdf } from 'react-icons/vsc';

export const WebsiteChipLink = ({ tool }: { tool: Tool }) => {

  const getToolIcon = (tool: Tool) => {
    if (tool.deviconSrc) {
      return (
        <img
          src={tool.deviconSrc}
          alt={tool.name}
          style={{
            width: '35px',
            height: '35px',
          }}
        />
      );
    }

    const color = tool.color ? tool.color : colors.pure.black;
    if (tool.icon === 'VscFilePdf') {
      return <VscFilePdf size={35} style={{ color: color }} />;
    }

    const IconComponent = (SiIcons as any)[tool.icon as keyof typeof SiIcons];
    if (IconComponent) {
      return <IconComponent size={35} style={{ color: color }} />;
    }
    return null;
  };

  return (
    <Tooltip key={tool.name} title={tool.name} placement="top" arrow>
      <Box
        component={tool.url ? 'a' : 'div'}
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          transition: 'all 0.2s ease',
          cursor: tool.url ? 'pointer' : 'default',
          textDecoration: 'none',
          '&:hover': {
            background: colorUtils.getBorderColor(colors.pure.white, 5),
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
            width: 60,
            borderRadius: '50%',
            background: colorUtils.getBorderColor(colors.pure.white, 25),
            border: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 25)}`,
            mb: 1,
            boxShadow: `0 2px 8px ${colorUtils.getBorderColor(colors.pure.black, 30)}`,
            color: tool.color || colors.pure.black,
          }}
        >
          {getToolIcon(tool)}
        </Box>
      </Box>
    </Tooltip>
  );
};
