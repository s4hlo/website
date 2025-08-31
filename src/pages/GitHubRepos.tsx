import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  CardActions,
  Button,
} from '@mui/material';
import { GitHub, Language, Star, CalendarToday } from '@mui/icons-material';
import GitHubContributions from '../components/GitHubContributions';
import { colors, colorUtils } from '../theme';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  visibility: string;
  updated_at: string;
  topics: string[];
}

const GitHubRepos: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/s4hlo/repos?sort=updated&per_page=100',
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch repositories',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: colors.gradients.main,
          backgroundAttachment: 'fixed',
          py: 4,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: colors.gradients.main,
          backgroundAttachment: 'fixed',
          py: 4,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.gradients.main,
        backgroundAttachment: 'fixed',
        py: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ mb: 4 }}
        >
          GitHub Repositories
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          @s4hlo
        </Typography>

        {/* GitHub Contributions Component */}
        <GitHubContributions />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            maxWidth: '100%',
          }}
        >
          {repos
            .filter(repo => repo.description !== null)
            .map(repo => (
              <Box key={repo.id}>
                <Card
                  sx={{
                    height: 320,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition:
                      'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    background: colors.gradients.card.primary,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colorUtils.getBorderColor(colors.primary.main)}`,
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GitHub sx={{ mr: 1, color: colors.category.cyan }} />
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: colors.category.cyan,
                          fontSize: '1.1rem',
                          flexGrow: 1,
                        }}
                      >
                        {repo.name}
                      </Typography>
                      {repo.visibility === 'private' && (
                        <Chip
                          label="Private"
                          size="small"
                          sx={{
                            backgroundColor: colorUtils.getBorderColor(
                              colors.status.warning,
                            ),
                            color: colors.status.warning,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.5,
                        minHeight: '3em',
                        maxHeight: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {repo.description || 'No description available'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 2,
                        minHeight: '2em',
                        alignItems: 'center',
                      }}
                    >
                      {repo.language ? (
                        <Chip
                          icon={<Language />}
                          label={repo.language}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: colorUtils.getBorderColor(
                              colors.pure.white,
                            ),
                            color: 'text.secondary',
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          Language not specified
                        </Typography>
                      )}
                      <Chip
                        icon={<Star />}
                        label={repo.stargazers_count}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: colorUtils.getBorderColor(
                            colors.pure.white,
                          ),
                          color: 'text.secondary',
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        mb: 2,
                        minHeight: '2.5em',
                        alignItems: 'flex-start',
                      }}
                    >
                      {repo.topics && repo.topics.length > 0 ? (
                        <>
                          {repo.topics.slice(0, 4).map(topic => (
                            <Chip
                              key={topic}
                              label={topic}
                              size="small"
                              sx={{
                                backgroundColor: colorUtils.getBorderColor(
                                  colors.category.cyan,
                                ),
                                color: colors.category.cyan,
                                fontSize: '0.7rem',
                              }}
                            />
                          ))}
                          {repo.topics.length > 4 && (
                            <Chip
                              label={`+${repo.topics.length - 4}`}
                              size="small"
                              sx={{
                                backgroundColor: colorUtils.getBorderColor(
                                  colors.pure.white,
                                ),
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          No topics
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(repo.updated_at)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component="a"
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<GitHub />}
                      sx={{
                        borderColor: colorUtils.getBorderColor(
                          colors.primary.main,
                        ),
                        color: colors.category.cyan,
                        '&:hover': {
                          borderColor: colors.category.cyan,
                          backgroundColor: colorUtils.getBorderColor(
                            colors.category.cyan,
                          ),
                        },
                      }}
                    >
                      Code
                    </Button>
                    {repo.homepage && (
                      <Button
                        component="a"
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="text"
                        size="small"
                        startIcon={<Language />}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: colors.category.cyan,
                          },
                        }}
                      >
                        Demo
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Box>
            ))}
        </Box>
      </Container>
    </Box>
  );
};

export default GitHubRepos;
