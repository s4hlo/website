import { Box, Typography, Container } from '@mui/material';
import { 
  Star, 
  Build, 
  GitHub, 
  ContactMail, 
  ThumbUp, 
  Flag, 
  Timeline 
} from '@mui/icons-material';
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
import SectionHeader from '../components/Home/SectionHeader';

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
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <TextType
            text="Hi, I'm Rafael Magno!"
            typingSpeed={150}
            as="h1"
            className="subtitle-gradient"
          />
          <GradientText
            colors={[
              colors.primary.main,
              colors.secondary.main,
              colors.primary.main,
            ]}
            animationSpeed={1}
            showBorder={false}
            className="main-title"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Typography>
        </Box>
        <SectionHeader
          icon={<Star />}
          title="Expertise"
          subtitle="Áreas de especialização e competências técnicas"
          iconColor={colors.category.orange}
        />
        <ExpertiseSection />

        <SectionHeader
          icon={<Timeline />}
          title="Carreira"
          subtitle="Trajetória acadêmica e profissional em desenvolvimento de software"
          iconColor={colors.category.cyan}
        />
        <CareerPathSection />

        <SectionHeader
          icon={<Flag />}
          title="Objetivos de Carreira"
          subtitle="Metas e planos para o futuro profissional"
          iconColor={colors.category.orange}
        />
        <CareerGoalsSection />

        <SectionHeader
          icon={<Build />}
          title="Habilidades"
          subtitle="Competências técnicas e ferramentas de desenvolvimento"
          iconColor={colors.category.green}
        />
        <SkillsSection />

        <SectionHeader
          icon={<GitHub />}
          title="GitHub Repositories"
          subtitle="Projetos e contribuições no GitHub @s4hlo"
          iconColor={colors.category.cyan}
        />
        <GitHubSection />

        <SectionHeader
          icon={<ThumbUp />}
          title="Why Choose Me?"
          subtitle="Diferenciais que me destacam como desenvolvedor"
          iconColor={colors.category.green}
        />
        <WhyChooseMeSection />

        <SectionHeader
          icon={<ContactMail />}
          title="Conecte-se Comigo"
          subtitle="Encontre-me em diferentes plataformas e redes sociais"
          iconColor={colors.category.magenta}
        />
        <ContactsSection />
      </Container>
    </Box>
  );
};

export default Home;
