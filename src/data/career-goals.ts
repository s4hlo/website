export interface CareerGoal {
  title: string;
  period: string;
  color: string;
  goals: string[];
}

export const CAREER_GOALS_DATA = {
  title: 'Career Goals',
  subtitle: 'My professional development roadmap and aspirations',
  goals: [
    {
      title: 'Short-Term Goals',
      period: 'Next 6-12 months',
      color: 'blue',
      goals: [
        'Master advanced TypeScript patterns and React optimization techniques',
        'Complete AWS Solutions Architect certification',
        'Contribute to 3+ open source projects',
      ],
    },
    {
      title: 'Mid-Term Goals',
      period: 'Next 1-2 years',
      color: 'cyan',
      goals: [
        'Lead development of a high-scale SaaS platform',
        'Build and deploy ML models in production',
        'Mentor junior developers and conduct tech talks',
      ],
    },
    {
      title: 'Long-Term Goals',
      period: 'Next 3-5 years',
      color: 'dark_green',
      goals: [
        'Found a tech startup or become CTO at a growing company',
        'Publish research papers on AI/ML applications',
        'Build a sustainable tech education platform',
      ],
    },
  ] as CareerGoal[],
};
