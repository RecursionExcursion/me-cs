import { SeasonTeams } from "../Season";
import { StatWeights } from "../../../types/stats";
import { toPgRankingString } from "./rankingToString";
import { algo1 } from "./algorithims/rankingAlgo1";
import { algo2 } from "./algorithims/rankingAlgo2";

export function rankSeason(weeks: SeasonTeams[], weights: StatWeights) {
  //TODO Need to add strength of schedule and poll inertia
  const { weightedRankedWeeks } = algo1(weeks, weights);
  const { teamArr } = algo2(weeks, weights);
  return {
    // weightedRankings,
    // weeks: weeks.map((st) => Array.from(st.entries())),
    teamArr: teamArr,
    teamArrSTR: teamArr.map((wk) => toPgRankingString(wk)),
    weightedWeeks: weightedRankedWeeks,
    weightedWeeksSTR: weightedRankedWeeks.map((wk) => toPgRankingString(wk)),
    // weightedrankMap: weightedRankMap.map((mp) =>
    //   Array.from(mp.entries()).map((e) => [e[0], toPgRankingString(e[1])])
    // ),
  };
}
