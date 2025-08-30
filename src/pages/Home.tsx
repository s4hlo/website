import { Box, Typography, Container, Paper } from '@mui/material';
import {
  Code,
  Web,
  Cloud,
  Psychology,
  Gamepad,
  Security,
} from '@mui/icons-material';
import React from 'react';
import { colors } from '../theme';

const Home = () => {
  const features = [
    {
      icon: <Code />,
      title: 'Full-Stack Development',
      description:
        'Desenvolvimento completo de aplicações web com tecnologias modernas',
      color: colors.category.backend,
    },
    {
      icon: <Web />,
      title: 'Modern Web Technologies',
      description: 'React, TypeScript e PWA para experiências web excepcionais',
      color: colors.category.frontend,
    },
    {
      icon: <Cloud />,
      title: 'Cloud & DevOps',
      description:
        'Infraestrutura em nuvem e automação de processos de desenvolvimento',
      color: colors.category.cloud,
    },
    {
      icon: <Psychology />,
      title: 'AI & Machine Learning',
      description: 'Integração de IA e modelos de aprendizado de máquina',
      color: colors.category.ai,
    },
    {
      icon: <Gamepad />,
      title: 'Game Development',
      description: 'Desenvolvimento de jogos com Unity e Godot',
      color: colors.category.games,
    },
    {
      icon: <Security />,
      title: 'Security First',
      description: 'Sistemas seguros com autenticação e autorização robustos',
      color: colors.category.security,
    },
  ];

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
        {/* Header */}
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

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Box key={index}>
              <Paper
                className="hover-card"
                sx={{
                  height: '100%',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 40, color: 'white' },
                    })}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 600, color: feature.color, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Paper>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Vamos trabalhar juntos?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Estou sempre aberto a novos desafios e oportunidades de
              colaboração. Se você tem um projeto interessante ou quer discutir
              possibilidades, não hesite em entrar em contato.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
