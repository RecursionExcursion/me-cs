import { PgStatWeights } from "../../../../types/stats";
import { Team } from "../../../../types/Team";
import { Season, SeasonTeams } from "../../Season";
import { createWeightedRankMap, RankMap } from "./rankMap";
import { setAuxStats } from "./setauxStats";
import { getWeightedWeeks } from "./weight";

export function algo2(
  weeks: SeasonTeams[],
  weights: PgStatWeights,
  season: Season
) {
  const weekClone = structuredClone(weeks);

  const teamArr: Team[][] = [];
  const rmps: RankMap[] = [];

  weekClone.forEach((st, weekIndex) => {
    const weightedRankMap = createWeightedRankMap(st, weights, false);

    const weightedWeeks = getWeightedWeeks(
      weightedRankMap,
      structuredClone(weekClone),
      weekIndex
    );
    //Rank teams without aux stats
    setRankByWeight(weightedWeeks);
    //Set aux stats based off last weeks rankings
    setAuxStats(weightedWeeks, teamArr, weekIndex, season);

    //WST back to ST map
    const newST: SeasonTeams = new Map(weightedWeeks.map((t) => [t.id, t]));

    //Run thru again
    const weightedRankMap2 = createWeightedRankMap(newST, weights, true);

    rmps.push(weightedRankMap2);

    const weightedWeeks2 = getWeightedWeeks(
      weightedRankMap2,
      structuredClone(weekClone),
      weekIndex
    );

    setRankByWeight(weightedWeeks2);

    teamArr.push(weightedWeeks2);
  });

  return { teamArr, rmps };
}

function setRankByWeight(teams: Team[]) {
  for (let i = 0, rank = 1; i < teams.length; i++) {
    const currTeam = teams[i];

    if (i === 0) {
      currTeam.stats.rank = rank;
      continue;
    }

    const prevTeam = teams[i - 1];

    if (prevTeam.weight !== currTeam.weight) {
      rank = i + 1;
    }
    currTeam.stats.rank = rank;
  }

  return teams;
}
