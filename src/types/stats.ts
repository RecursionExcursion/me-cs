export type TeamStats = {
  rank: number;
  games: number;
  totalStats: TotalStats;
  pgStats: PerGameStats;
  auxStats: AuxiliaryStats;
};

export type TotalStats = {
  wins: number;
  losses: number;
  offense: number;
  defense: number;
  pointsFor: number;
  pointsAllowed: number;
};

export type PerGameStats = {
  winPG: number;
  lossPG: number;
  offPG: number;
  defPG: number;
  pfPG: number;
  paPG: number;
};

export type AuxiliaryStats = {
  pollInertia: number;
  strengthOfSchedule: number;
};

export type StatWeights = TotalStats & AuxiliaryStats;
export type PgStatWeights = PerGameStats & AuxiliaryStats;

export const totalWeightsToPerGame = (weights: StatWeights): PgStatWeights => {
  return {
    offPG: weights.offense,
    defPG: weights.defense,
    pfPG: weights.pointsFor,
    paPG: weights.pointsAllowed,
    winPG: weights.wins,
    lossPG: weights.losses,
    pollInertia: weights.pollInertia,
    strengthOfSchedule: weights.strengthOfSchedule,
  };
};

export const iterableRankingStats: (keyof TotalStats)[] = [
  "offense",
  "defense",
  "pointsFor",
  "pointsAllowed",
  "wins",
  "losses",
];

export const iterablePGStats: (keyof PerGameStats)[] = [
  "offPG",
  "defPG",
  "paPG",
  "pfPG",
  "winPG",
  "lossPG",
];

export const iterableAuxStats: (keyof AuxiliaryStats)[] = [
  "pollInertia",
  "strengthOfSchedule",
];
