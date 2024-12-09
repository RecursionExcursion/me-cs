import {
  AuxiliaryStats,
  iterableAuxStats,
  iterablePGStats,
  PerGameStats,
  PgStatWeights,
} from "../../../../types/stats";
import { Team } from "../../../../types/Team";
import { SeasonTeams } from "../../Season";
import { compareStats, StatType } from "../statComparitors";

export type RankMap = Map<keyof PerGameStats | keyof AuxiliaryStats, Team[]>;

export function createWeightedRankMap(
  seasonTeams: SeasonTeams,
  weights: PgStatWeights,
  evalAux: boolean
) {
  return weightRankMap(createRankingMap(seasonTeams, evalAux), weights);
}

function createRankingMap(week: SeasonTeams, evalAuxStats: boolean): RankMap {
  const rankingMap: RankMap = new Map();

  function sortStat(stat: string, statType: StatType) {
    const rankedWeek = Array.from(week.values()).sort((a, b) => {
      return compareStats(statType, stat, a, b);
    });
    //TODO Consider deep cloning here
    const weekClone = structuredClone(rankedWeek);
    return weekClone;
  }

  iterablePGStats.forEach((stat) => {
    rankingMap.set(stat, sortStat(stat, "pgStats"));
  });

  if (evalAuxStats) {
    iterableAuxStats.forEach((stat) => {
      rankingMap.set(stat, sortStat(stat, "auxStats"));
    });
  }

  return rankingMap;
}

function weightRankMap(rankMap: RankMap, pgWeights: PgStatWeights) {
  const weightedRankMap = structuredClone(rankMap);

  function getStats(stat: string, currTeam: Team, nextTeam: Team) {
    function isPGStat(stat: string): stat is keyof PerGameStats {
      return iterablePGStats.includes(stat as keyof PerGameStats);
    }

    function isAuxStat(stat: string): stat is keyof AuxiliaryStats {
      return iterableAuxStats.includes(stat as keyof AuxiliaryStats);
    }

    if (isPGStat(stat)) {
      return {
        currStat: currTeam.stats.pgStats[stat],
        nextStat: nextTeam.stats.pgStats[stat],
      };
    } else if (isAuxStat(stat)) {
      return {
        currentStat: currTeam.stats.auxStats[stat],
        nextStat: nextTeam.stats.auxStats[stat],
      };
    } else {
      throw Error(`Error mapping stat ${stat}`);
    }
  }

  Array.from(weightedRankMap.entries()).forEach((e) => {
    const stat = e[0];
    const teams = e[1];

    let rankingIndex = 1;

    for (let i = 0; i < teams.length; ) {
      const currentTeam = teams[i];
      //Multiply statWeight by index in array (rank), first place gets 0 weight
      // const statWeight = weightCalcs[stat](rankingIndex, pgWeights);
      //  pgWeights[e[0]] * rankingIndex;
      const statWeight = pgWeights[e[0]] * rankingIndex;

      if (!currentTeam.weight) currentTeam.weight = 0;

      currentTeam.weight += statWeight;
      i++;
      if (i < teams.length - 1) {
        const { currentStat, nextStat } = getStats(stat, currentTeam, teams[i]);

        if (currentStat !== nextStat) {
          rankingIndex = i + 1;
        }
      }
    }
  });

  return weightedRankMap;
}
