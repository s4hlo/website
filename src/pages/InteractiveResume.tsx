import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Code,
  Web,
  Cloud,
  Terminal,
  Psychology,
  Gamepad,
  Security,
  Speed,
  Architecture,
} from "@mui/icons-material";

interface Skill {
  name: string;
  level: number;
  icon?: React.ReactNode;
  description: string;
  tags: string[];
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const InteractiveResume: React.FC = () => {
  const [animatedSkills, setAnimatedSkills] = useState<Set<string>>(new Set());

  interface CareerGoal {
    title: string;
    period: string;
    color: string;
    goals: string[];
  }

  const skillCategories: SkillCategory[] = [
    {
      title: "Backend & APIs",
      icon: <Code />,
      color: "#60a5fa",
      skills: [
        {
          name: "NestJS",
          level: 95,
          description:
            "Framework Node.js para aplicações escaláveis e eficientes",
          tags: ["Node.js", "TypeScript", "Decorators", "Dependency Injection"],
        },
        {
          name: "TypeORM",
          level: 90,
          description: "ORM para TypeScript com suporte a múltiplos bancos",
          tags: ["Database", "Migrations", "Relations", "Query Builder"],
        },
        {
          name: "PostgreSQL",
          level: 88,
          description: "Banco de dados relacional avançado",
          tags: ["SQL", "Performance", "Indexing", "Stored Procedures"],
        },
        {
          name: "Authorization Systems",
          level: 92,
          description: "Sistemas de autenticação e autorização robustos",
          tags: ["JWT", "OAuth", "RBAC", "Security"],
        },
      ],
    },
    {
      title: "Frontend & Web",
      icon: <Web />,
      color: "#22d3ee",
      skills: [
        {
          name: "React",
          level: 95,
          description: "Biblioteca para interfaces de usuário interativas",
          tags: ["Hooks", "Context", "Performance", "TypeScript"],
        },
        {
          name: "TypeScript",
          level: 93,
          description: "Superset do JavaScript com tipagem estática",
          tags: ["Types", "Interfaces", "Generics", "Advanced Types"],
        },
        {
          name: "Modern Web",
          level: 90,
          description: "Tecnologias web modernas e PWA",
          tags: ["ES6+", "Web APIs", "Service Workers", "Performance"],
        },
      ],
    },
    {
      title: "Cloud & DevOps",
      icon: <Cloud />,
      color: "#f59e0b",
      skills: [
        {
          name: "AWS",
          level: 85,
          description: "Serviços em nuvem da Amazon",
          tags: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
        },
        {
          name: "Linux",
          level: 90,
          description: "Sistemas operacionais baseados em Unix",
          tags: ["Arch Linux", "Shell Scripting", "System Administration"],
        },
        {
          name: "Arch Linux",
          level: 88,
          description: "Distribuição Linux rolling release",
          tags: ["Pacman", "AUR", "Customization", "Performance"],
        },
      ],
    },
    {
      title: "Development Tools",
      icon: <Terminal />,
      color: "#10b981",
      skills: [
        {
          name: "Neovim",
          level: 92,
          description: "Editor de texto modal altamente customizável",
          tags: ["Lua", "Plugins", "LSP", "Telescope", "Treesitter"],
        },
        {
          name: "Git",
          level: 90,
          description: "Sistema de controle de versão distribuído",
          tags: ["Workflows", "Rebase", "Cherry-pick", "Git Hooks"],
        },
      ],
    },
    {
      title: "AI & Machine Learning",
      icon: <Psychology />,
      color: "#8b5cf6",
      skills: [
        {
          name: "Python",
          level: 88,
          description: "Linguagem para ciência de dados e ML",
          tags: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow"],
        },
        {
          name: "Machine Learning",
          level: 85,
          description: "Algoritmos e modelos de aprendizado de máquina",
          tags: [
            "Supervised Learning",
            "Neural Networks",
            "Data Preprocessing",
          ],
        },
        {
          name: "LLMs & AI",
          level: 80,
          description: "Large Language Models e inteligência artificial",
          tags: ["OpenAI API", "Prompt Engineering", "AI Integration"],
        },
      ],
    },
    {
      title: "Game Development",
      icon: <Gamepad />,
      color: "#ef4444",
      skills: [
        {
          name: "Unity",
          level: 75,
          description: "Engine de desenvolvimento de jogos",
          tags: ["C#", "3D Graphics", "Physics", "Animation"],
        },
        {
          name: "Godot",
          level: 70,
          description: "Engine de jogos open source",
          tags: ["GDScript", "2D/3D", "Cross-platform", "Lightweight"],
        },
      ],
    },
  ];

  const careerGoals: CareerGoal[] = [
    {
      title: "Short-Term Goals",
      period: "Next 6-12 months",
      color: "#60a5fa",
      goals: [
        "Master advanced TypeScript patterns and React optimization techniques",
        "Complete AWS Solutions Architect certification",
        "Contribute to 3+ open source projects",
      ],
    },
    {
      title: "Mid-Term Goals",
      period: "Next 1-2 years",
      color: "#22d3ee",
      goals: [
        "Lead development of a high-scale SaaS platform",
        "Build and deploy ML models in production",
        "Mentor junior developers and conduct tech talks",
      ],
    },
    {
      title: "Long-Term Goals",
      period: "Next 3-5 years",
      color: "#10b981",
      goals: [
        "Found a tech startup or become CTO at a growing company",
        "Publish research papers on AI/ML applications",
        "Build a sustainable tech education platform",
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
          setTimeout(() => {
            setAnimatedSkills((prev) => new Set([...prev, skill.name]));
          }, Math.random() * 1000);
        });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getSkillColor = (level: number) => {
    if (level >= 90) return "#10b981";
    if (level >= 80) return "#3b82f6";
    if (level >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getSkillLabel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}

      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Resume
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Full-stack developer with expertise in modern web technologies, cloud
          infrastructure, and cutting-edge AI/ML solutions
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Career Goals
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          My professional development roadmap and aspirations
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {careerGoals.map((goal, index) => (
          <Paper
            key={goal.title}
            sx={{
              p: 4,
              height: "100%",
              background: `linear-gradient(135deg, ${goal.color}10 0%, ${goal.color}05 100%)`,
              border: `1px solid ${goal.color}20`,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 25px ${goal.color}20`,
                borderColor: `${goal.color}40`,
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 600, color: goal.color, mb: 2 }}
              >
                {goal.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {goal.period}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {goal.goals.map((goalText, goalIndex) => (
                <Box
                  key={goalIndex}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: goal.color,
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {goalText}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Technical Skills
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Full-stack developer with expertise in modern web technologies, cloud
          infrastructure, and cutting-edge AI/ML solutions
        </Typography>
      </Box>

      {/* Skills Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          width: "100%",
        }}
      >
        {skillCategories.map((category) => (
          <Paper
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: `linear-gradient(135deg, ${category.color}10 0%, ${category.color}05 100%)`,
              // background: `linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.7) 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${category.color}20`,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 25px ${category.color}20`,
                borderColor: `${category.color}40`,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: `${category.color}20`,
                  color: category.color,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                {category.icon}
              </Avatar>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {category.title}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ height: "100%" }}>
              {category.skills.map((skill) => (
                <Box
                  key={skill.name}
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
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

                  <LinearProgress
                    variant="determinate"
                    value={animatedSkills.has(skill.name) ? skill.level : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getSkillColor(skill.level),
                        borderRadius: 4,
                        transition: "width 1.5s ease-in-out",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    {skill.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          color: "text.secondary",
                          fontSize: "0.7rem",
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
                      minHeight: "3em",
                      lineHeight: 1.4,
                    }}
                  >
                    {skill.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Experience Summary */}
      <Box sx={{ mt: 8 }}>
        <Paper
          sx={{
            p: 4,
            background:
              "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)",
            border: "1px solid rgba(96, 165, 250, 0.2)",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ textAlign: "center", mb: 3 }}
          >
            Why Choose Me?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Speed sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Performance First
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Otimização de performance, lazy loading e arquitetura escalável
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Security sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Security Expert
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sistemas de autenticação robustos e práticas de segurança
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Architecture
                sx={{ fontSize: 48, color: "success.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Clean Architecture
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Código limpo, padrões de design e arquitetura escalável
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InteractiveResume;
