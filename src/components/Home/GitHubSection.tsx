import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GitHub, Star } from '@mui/icons-material';
import GitHubContributions from '../GitHubContributions';
import { colors, colorUtils } from '../../theme';

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

const GitHubSection = () => {
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

  return (
    <Box sx={{ mb: 8 }}>

      {/* GitHub Contributions Component */}
      <GitHubContributions />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
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
                <Card>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GitHub
                        sx={{
                          mr: 1,
                          color: colors.category.cyan,
                          fontSize: 18,
                        }}
                      />
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          color: colors.category.cyan,
                          fontSize: '1rem',
                          flexGrow: 1,
                          fontFamily: 'monospace',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {repo.name}
                        <Chip
                          icon={
                            <Star
                              sx={{
                                fontSize: 14,
                                color: `${colors.github.star} !important`,
                                '& path': {
                                  fill: colors.github.star,
                                },
                              }}
                            />
                          }
                          label={repo.stargazers_count}
                          size="small"
                          variant="outlined"
                          sx={{
                            ml: 1,
                            borderColor: colorUtils.getBorderColor(
                              colors.github.star,
                              30,
                            ),
                            color: colors.github.star,
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: 20,
                            '& .MuiChip-label': {
                              px: 0.8,
                            },
                          }}
                        />
                      </Typography>
                      {repo.visibility === 'private' && (
                        <Chip
                          label="Private"
                          size="small"
                          sx={{
                            backgroundColor: colorUtils.getBorderColor(
                              colors.status.warning,
                              20,
                            ),
                            color: colors.status.warning,
                            fontWeight: 600,
                            fontSize: '0.6rem',
                            height: 18,
                            '& .MuiChip-label': {
                              px: 0.6,
                            },
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
                        minHeight: '2.8em',
                        maxHeight: '2.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.8rem',
                      }}
                    >
                      {repo.description || 'No description available'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.8,
                        minHeight: '2em',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {repo.language !== null ? (
                        <Chip
                          label={repo.language}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: colorUtils.getBorderColor(
                              colors.category.cyan,
                              30,
                            ),
                            color: colors.category.cyan,
                          }}
                        />
                      ) : (
                        <> &nbsp; </>
                      )}

                      <Button
                        component="a"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        startIcon={<GitHub />}
                        sx={{
                          backgroundColor: colors.category.cyan,
                          color: colors.pure.black,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: colors.category.blue,
                            transform: 'scale(1.02)',
                            boxShadow: `0 4px 16px ${colorUtils.getBorderColor(colors.category.blue, 30)}`,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        View Code
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default GitHubSection;
