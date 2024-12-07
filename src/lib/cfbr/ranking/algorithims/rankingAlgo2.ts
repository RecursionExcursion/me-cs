import {
  iterableRankingStatsPG,
  PerGameStats,
  StatWeights,
  totalWeightsToPerGame,
} from "../../../../types/stats";
import { Team } from "../../../../types/Team";
import { SeasonTeams } from "../../Season";
import { compareStats } from "../statComparitors";

export function algo2(weeks: SeasonTeams[], weights: StatWeights) {
  const weekClone = structuredClone(weeks);

  const teamArr: Team[][] = [];

  weekClone.forEach((st, weekIndex) => {
    const rankMap = createRankingMap(st);
    const weightedRankMap = weightRankMap(rankMap, weights);
    const weightedWeeks = weightWeek(
      weightedRankMap,
      structuredClone(weekClone),
      weekIndex
    );
    const weightedAndRankedWeek = rankWeightedWeek(weightedWeeks);

    //Eval Poll inertia
    evalPI(weightedAndRankedWeek, weekClone, weekIndex, teamArr);
    // PI is now set

    //Calc and evel SS

    //Run thru again?

    teamArr.push(weightedAndRankedWeek);
  });

  return { teamArr };
}

type RankMap = Map<keyof PerGameStats, Team[]>;

function createRankingMap(week: SeasonTeams): RankMap {
  const rankingMap = new Map<keyof PerGameStats, Team[]>();

  //Compare and sort teams based on stat
  iterableRankingStatsPG.forEach((stat) => {
    const rankedWeek = Array.from(week.values()).sort((a, b) => {
      return compareStats("pgStats", stat, a, b);
    });
    //TODO Consider deep cloning here
    const weekClone = structuredClone(rankedWeek);
    //Rank stat clones?
    // setRankByWeight(weekClone);
    rankingMap.set(stat, weekClone);

    // rankingMap.set(stat, rankedWeek);
  });
  return rankingMap;
}

function weightRankMap(rankMap: RankMap, weights: StatWeights) {
  const pgWeights = totalWeightsToPerGame(weights);
  const weightedRankMap = structuredClone(rankMap);

  Array.from(weightedRankMap.entries()).forEach((e) => {
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

  return weightedRankMap;
}

function weightWeek(
  weightedRankMap: RankMap,
  weeks: SeasonTeams[],
  weekIndex: number
) {
  const weightedTeamMap = weeks[weekIndex];

  weightedRankMap.forEach((stat) => {
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
  return weightedTeamMap;
}

function rankWeightedWeek(week: SeasonTeams) {
  const teams = Array.from(week.values()).sort((a, b) => {
    const aWeight = a.weight ?? Number.MAX_SAFE_INTEGER;
    const bWeight = b.weight ?? Number.MAX_SAFE_INTEGER;
    return aWeight - bWeight;
  });

  setRankByWeight(teams);

  return teams;
}

function evalPI(
  rankedWeek: Team[],
  weeks: SeasonTeams[],
  weekIndex: number,
  teams: Team[][]
) {
  if (weekIndex === 0) {
    return;
  }

  const prevWeek = teams[teams.length - 1];

  prevWeek.forEach((pTeam) => {
    const currTeam = rankedWeek.find((rTeam) => rTeam.id === pTeam.id);

    if (currTeam === undefined) {
      throw Error(`${pTeam.school.abbreviation} could not be found`);
    }
    //TODO here is where the multiplier is added
    currTeam.stats.auxStats.pollInertia = pTeam.stats.auxStats.rank;
  });

  // const prevWeek = teams[weekIndex - 1];
}

function setRankByWeight(teams: Team[]) {
  for (let i = 0, rank = 1; i < teams.length; i++) {
    const currTeam = teams[i];

    if (i === 0) {
      currTeam.stats.auxStats.rank = rank;
      continue;
    }

    const prevTeam = teams[i - 1];

    if (prevTeam.weight !== currTeam.weight) {
      rank = i + 1;
    }
    currTeam.stats.auxStats.rank = rank;
  }

  return teams;
}
