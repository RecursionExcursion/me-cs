import { PerGameStats, TotalStats } from "../../../types/stats";
import { Team } from "../../../types/Team";

export function compareTotal(stat: keyof TotalStats, teamA: Team, teamB: Team) {
  const aStats = teamA.stats.totalStats;
  const bStats = teamB.stats.totalStats;

  const statComparisonMap = new Map<keyof TotalStats, () => number>([
    ["offense", () => bStats.offense - aStats.offense],
    ["pointsFor", () => bStats.pointsFor - aStats.pointsFor],
    ["wins", () => bStats.wins - aStats.wins],
    //Eval flips
    ["defense", () => aStats.defense - bStats.defense],
    ["pointsAllowed", () => aStats.pointsAllowed - bStats.pointsAllowed],
    ["losses", () => aStats.losses - bStats.losses],
  ]);

  const comp = statComparisonMap.get(stat);
  if (!comp) throw Error(`Comparison for stat-${stat} not implemented`);
  return comp();
}

export function comparePerGame(
  stat: keyof PerGameStats,
  teamA: Team,
  teamB: Team
) {
  const aStats = teamA.stats.pgStats;
  const bStats = teamB.stats.pgStats;

  const statComparisonMap = new Map<keyof PerGameStats, () => number>([
    ["offPG", () => bStats.offPG - aStats.offPG],
    ["pfPG", () => bStats.pfPG - aStats.pfPG],
    ["winPG", () => bStats.winPG - aStats.winPG],
    //Eval flips
    ["defPG", () => aStats.defPG - bStats.defPG],
    ["paPG", () => aStats.paPG - bStats.paPG],
    ["lossPG", () => aStats.lossPG - bStats.lossPG],
  ]);

  const comp = statComparisonMap.get(stat);
  if (!comp) throw Error(`Comparison for stat-${stat} not implemented`);
  return comp();
}
