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
