export const ROUTES = {
  HOME: '/',
  THREE_D: {
    MUSEUM: '/3d/museum',
    PLAYGROUND: '/3d/playground',
    CUBES: '/3d/cubes',
  },
  GITHUB: '/github',
  RESUME: '/resume',
  RHYTHM_GAME: '/rhythm-game',
} as const;

export type RoutePath =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | (typeof ROUTES.THREE_D)[keyof typeof ROUTES.THREE_D];
