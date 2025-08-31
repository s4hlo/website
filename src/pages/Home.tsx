import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { colors } from '../theme';
import ExpertiseSection from '../components/Home/ExpertiseSection';
import CareerGoalsSection from '../components/Home/CareerGoalsSection';
import SkillsSection from '../components/Home/SkillsSection';
import WhyChooseMeSection from '../components/Home/WhyChooseMeSection';
import GitHubSection from '../components/Home/GitHubSection';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.gradients.main,
        backgroundAttachment: 'fixed',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: colors.gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '3rem', md: '4.5rem' },
            }}
          >
            S4hlo
          </Typography>
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            Full-stack developer com expertise em tecnologias web modernas,
            infraestrutura em nuvem e soluções de IA/ML
          </Typography>
        </Box>

        {/* Expertise Section */}
        <ExpertiseSection />

        {/* Career Goals Section */}
        <CareerGoalsSection />

        {/* Technical Skills Section */}
        <SkillsSection />

        {/* GitHub Section */}
        <GitHubSection />

        {/* Why Choose Me Section */}
        <WhyChooseMeSection />
      </Container>
    </Box>
  );
};

export default Home;
