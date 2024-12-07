import { AuxiliaryStats, PerGameStats, TotalStats } from "../../../types/stats";
import { Team } from "../../../types/Team";

type StatType = "totalStats" | "pgStats" | "auxStats";

export function compareStats(
  statType: StatType,
  stat: string,
  teamA: Team,
  teamB: Team
) {
  const descStats: Record<StatType, string[]> = {
    totalStats: new Array<keyof TotalStats>(
      "defense",
      "pointsAllowed",
      "losses"
    ),
    pgStats: new Array<keyof PerGameStats>("defPG", "paPG", "lossPG"),
    auxStats: new Array<keyof AuxiliaryStats>(),
  };

  const aStats = teamA.stats[statType];
  const bStats = teamB.stats[statType];

  if (aStats === undefined || bStats === undefined) {
    throw new Error(`${statType} stats are undefined`);
  }

  const difference =
    bStats[stat as keyof typeof bStats] - aStats[stat as keyof typeof aStats];

  return descStats[statType].includes(stat as string)
    ? -difference
    : difference;
}
