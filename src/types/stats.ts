export type TeamStats = {
  games: number;
  wins: number;
  losses: number;
  stats: RankableStats;
};

export type RankableStats = {
  offense: number;
  defense: number;
  pointsFor: number;
  pointsAllowed: number;
};

export type StatWeights = RankableStats;

export const iterableRankingStats: (keyof RankableStats)[] = [
  "offense",
  "defense",
  "pointsFor",
  "pointsAllowed",
];
