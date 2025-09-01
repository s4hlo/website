import { Box, Typography, Container } from '@mui/material';
import { colors } from '../theme';
import ExpertiseSection from '../components/Home/ExpertiseSection';
import CareerGoalsSection from '../components/Home/CareerGoalsSection';
import SkillsSection from '../components/Home/SkillsSection';
import WhyChooseMeSection from '../components/Home/WhyChooseMeSection';
import GitHubSection from '../components/Home/GitHubSection';
import ContactsSection from '../components/Home/ContactsSection';
import CareerPathSection from '../components/Home/CareerPathSection';
import TextType from '../blocks/TextAnimations/TextType/TextType';
import GradientText from '../blocks/TextAnimations/GradientText/GradientText';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.gradients.main,
        backgroundAttachment: 'fixed',
        pt: 12,
        pb: 4,
      }}
    >
      <i></i>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <TextType text="Hi, I'm Rafael Magno!" typingSpeed={150} />
          <GradientText
            colors={['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']}
            animationSpeed={3}
            showBorder={false}
            tag="h1"
            className="custom-class"
          >
            Full-stack developer com expertise em tecnologias web modernas, infraestrutura em nuvem e soluções de IA/ML
          </GradientText>
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
        <ExpertiseSection />
        <CareerPathSection />
        <CareerGoalsSection />
        <SkillsSection />
        <GitHubSection />
        <WhyChooseMeSection />
        <ContactsSection />
      </Container>
    </Box>
  );
};

export default Home;
