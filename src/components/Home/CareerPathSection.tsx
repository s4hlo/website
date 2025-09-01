import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { School, Work } from '@mui/icons-material';
import { colors, colorUtils } from '../../theme';
import { CAREER_PATH_DATA, CareerItem } from '../../data/career-path';

const CareerPathSection = () => {
  const renderCareerItem = (item: CareerItem, index: number) => (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2.5,
        borderRadius: 3,
        background: colorUtils.getBorderColor(colors.pure.white, 8),
        border: `1px solid ${colorUtils.getBorderColor(colors.pure.white, 15)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: colorUtils.getBorderColor(colors.pure.white, 12),
          borderColor: colorUtils.getBorderColor(colors.pure.white, 25),
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor:
            item.type === 'academic'
              ? colors.category.violet
              : colors.category.blue,
          color: colors.pure.white,
          width: 48,
          height: 48,
          flexShrink: 0,
        }}
      >
        {item.type === 'academic' ? <School /> : <Work />}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.pure.white,
              fontSize: '1rem',
            }}
          >
            {item.title}
          </Typography>
          <Chip
            label={item.period}
            size="small"
            sx={{
              backgroundColor: colorUtils.getBorderColor(
                item.type === 'academic'
                  ? colors.category.violet
                  : colors.category.blue,
                20,
              ),
              color:
                item.type === 'academic'
                  ? colors.category.violet
                  : colors.category.blue,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            fontSize: '0.85rem',
          }}
        >
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {item.tags.map((tag, tagIndex) => (
            <Chip key={tagIndex} label={tag} size="small" />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderStepper = (
    items: CareerItem[],
    type: 'academic' | 'professional',
  ) => (
    <Stepper
      orientation="vertical"
      sx={{
        '& .MuiStepConnector-line': {
          borderColor: colorUtils.getBorderColor(
            type === 'academic' ? colors.category.violet : colors.category.blue,
            30,
          ),
        },
        '& .MuiStepLabel-iconContainer': {
          '& .MuiStepIcon-root': {
            color:
              type === 'academic'
                ? colors.category.violet
                : colors.category.blue,
            '&.Mui-active': {
              color:
                type === 'academic'
                  ? colors.category.violet
                  : colors.category.blue,
            },
            '&.Mui-completed': {
              color:
                type === 'academic'
                  ? colors.category.violet
                  : colors.category.blue,
            },
          },
        },
        '& .MuiStepLabel-label': {
          color: colors.pure.white,
          fontWeight: 600,
          fontSize: '1.1rem',
        },
      }}
    >
      {items.map((item, index) => (
        <Step key={index} active={true} completed={false}>
          <StepLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.pure.white, fontWeight: 600 }}
              >
                {item.title}
              </Typography>
              <Chip
                label={item.period}
                size="small"
                sx={{
                  backgroundColor: colorUtils.getBorderColor(
                    type === 'academic'
                      ? colors.category.violet
                      : colors.category.blue,
                  ),
                  color:
                    type === 'academic'
                      ? colors.category.violet
                      : colors.category.blue,
                }}
              />
            </Box>
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  lineHeight: 1.5,
                  fontSize: '0.9rem',
                }}
              >
                {item.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {item.tags.map((tag, tagIndex) => (
                  <Chip key={tagIndex} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );

  return (
    <Box sx={{ mb: 8 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: 6,
        }}
      >
        {/* Carreira Acadêmica */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <School
              sx={{ mr: 2, color: colors.category.violet, fontSize: 28 }}
            />
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                color: colors.category.violet,
              }}
            >
              Formação Acadêmica
            </Typography>
          </Box>
          {renderStepper(CAREER_PATH_DATA.academic, 'academic')}
        </Box>

        {/* Carreira Profissional */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Work sx={{ mr: 2, color: colors.category.blue, fontSize: 28 }} />
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                color: colors.category.blue,
              }}
            >
              Experiência Profissional
            </Typography>
          </Box>
          {renderStepper(CAREER_PATH_DATA.professional, 'professional')}
        </Box>
      </Box>
    </Box>
  );
};

export default CareerPathSection;
