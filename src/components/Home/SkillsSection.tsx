import { Box, Typography, Paper, Chip, Stack, Avatar } from '@mui/material';
import {
  Code,
  Web,
  Cloud,
  Psychology,
  Gamepad,
  Terminal,
} from '@mui/icons-material';
import { colors, colorUtils } from '../../theme';
import { SKILLS_DATA } from '../../data/skills';
import { WebsiteChipLink } from '../WebsiteChipLink';

const SkillsSection = () => {
  const iconMap = {
    Code: <Code />,
    Web: <Web />,
    Cloud: <Cloud />,
    Psychology: <Psychology />,
    Gamepad: <Gamepad />,
    Terminal: <Terminal />,
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return colors.status.success;
    if (level >= 80) return colors.primary.main;
    if (level >= 70) return colors.status.warning;
    return colors.status.error;
  };

  const getSkillLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}
      >
        {SKILLS_DATA.title}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}
      >
        {SKILLS_DATA.subtitle}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
          width: '100%',
        }}
      >
        {SKILLS_DATA.categories.map(category => (
          <Paper
            key={category.title}
            className="hover-card"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: colorUtils.getGradient(category.color),
              border: `1px solid ${category.color}20`,
              '&:hover': {
                boxShadow: `0 8px 25px ${category.color}20`,
                borderColor: `${category.color}40`,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: `${category.color}20`,
                  color: category.color,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                {iconMap[category.icon as keyof typeof iconMap]}
              </Avatar>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {category.title}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ height: '100%' }}>
              {category.skills.map(skill => (
                <Box
                  key={skill.name}
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {skill.name}
                    </Typography>
                    <Chip
                      label={getSkillLabel(skill.level)}
                      size="small"
                      sx={{
                        bgcolor: `${getSkillColor(skill.level)}20`,
                        color: getSkillColor(skill.level),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    {skill.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: colorUtils.getBorderColor(
                            colors.pure.white,
                          ),
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      mb: 1,
                      flex: 1,
                      minHeight: '3em',
                      lineHeight: 1.4,
                    }}
                  >
                    {skill.description}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Seção de Ferramentas */}
            {category.tools && category.tools.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  pt: 3,
                  borderTop: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 20)}`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {category.tools.map(tool => (
                    <WebsiteChipLink key={tool.name} tool={tool} />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default SkillsSection;
