import {
  iterableRankingStatsPG,
  PerGameStats,
  StatWeights,
  totalWeightsToPerGame,
} from "../../../../types/stats";
import { Team } from "../../../../types/Team";
import { SeasonTeams } from "../../Season";
import { compareStats } from "../statComparitors";

export function algo1(weeks: SeasonTeams[], weights: StatWeights) {
  const rankMaps = createRankingMapArray(weeks);

  const weightedRankMap = weightRankMap(rankMaps, weights);

  const weightedWeeks = weightWeeks(weightedRankMap, weeks);

  const weightedRankedWeeks = rankWeightedTeams(weightedWeeks);

  return { rankMaps, weightedRankMap, weightedWeeks, weightedRankedWeeks };
}

/*
 * Array of Weeks.
 * Each week holds Array of stats
 * Each stat hold all teams sorted by stat
 */
type RankMapArray = Map<keyof PerGameStats, Team[]>[];

/**
 * @param weeks Map of all Teams
 * @returns RankMapArray
 **/

//Generate maps for each stat- map of ranking arrays, with RankableStat keys as key
function createRankingMapArray(weeks: SeasonTeams[]) {
  const rankingMapsArray: RankMapArray = [];

  weeks.map((week) => {
    const rankingMap = new Map<keyof PerGameStats, Team[]>();

    //Compare and sort teams based on stat
    iterableRankingStatsPG.forEach((stat) => {
      const rankedWeek = Array.from(week.values()).sort((a, b) => {
        return compareStats("pgStats", stat, a, b);
      });
      //TODO Consider deep cloning here
      rankingMap.set(stat, structuredClone(rankedWeek));
      // rankingMap.set(stat, rankedWeek);
    });

    rankingMapsArray.push(rankingMap);
  });

  return rankingMapsArray;
}

function weightRankMap(rankMapArray: RankMapArray, weights: StatWeights) {
  const pgWeights = totalWeightsToPerGame(weights);
  const weightedRankMap = structuredClone(rankMapArray);

  weightedRankMap.forEach((rankMap) => {
    Array.from(rankMap.entries()).forEach((e) => {
      const stat = e[0];
      const teams = e[1];

      let rankingIndex = 0;

      for (let i = 0; i < teams.length; ) {
        const currentTeam = teams[i];
        //Multiply statWeight by index in array (rank), first place gets 0 weight
        const statWeight = pgWeights[e[0]] * rankingIndex;

        if (!currentTeam.weight) currentTeam.weight = 0;

        currentTeam.weight += statWeight;
        i++;
        if (i < teams.length - 1) {
          const currentStat = currentTeam.stats.pgStats[stat];
          const nextStat = teams[i].stats.pgStats[stat];

          if (currentStat !== nextStat) {
            rankingIndex = i;
          }
        }
      }
    });
  });

  return weightedRankMap;
}

function weightWeeks(weightedRankMap: RankMapArray, weeks: SeasonTeams[]) {
  const weightedWeeks = structuredClone(weeks);

  weightedRankMap.forEach((wkStat, i) => {
    const weightedTeamMap = weightedWeeks[i];

    wkStat.forEach((stat) => {
      stat.forEach((team) => {
        const tm = weightedTeamMap.get(team.id);

        if (!tm) {
          //Should be no missing teams
          throw Error(`${team.school.abbreviation} not found in Season Teams`);
        }

        if (team.weight === undefined) {
          //Should not be undefined here
          throw Error(`${team.school.abbreviation} weight is undefined`);
        }

        if (tm.weight === undefined) {
          //May be undefined as this is OG data structure
          tm.weight = 0;
        }

        tm.weight += team.weight;
      });
    });
  });

  return weightedWeeks;
}

function rankWeightedTeams(weeks: SeasonTeams[]) {
  //Rank teams based on weighted stats
  //TODO  need to reflect tied weights in rank
  const weightedRankings: Team[][] = [];

  weeks.forEach((wk) => {
    const rankedTeams = Array.from(wk.values()).sort((a, b) => {
      const aWeight = a.weight ?? Number.MAX_SAFE_INTEGER;
      const bWeight = b.weight ?? Number.MAX_SAFE_INTEGER;
      return aWeight - bWeight;
    });
    weightedRankings.push(rankedTeams);
  });

  return weightedRankings;
}
