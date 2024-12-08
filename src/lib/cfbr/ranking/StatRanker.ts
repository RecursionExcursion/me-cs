import { Season, SeasonTeams } from "../Season";
import { StatWeights, totalWeightsToPerGame } from "../../../types/stats";
import { toPgRankingString } from "./rankingToString";
import { algo2 } from "./rankingAlgo/rankingAlgo";

export function rankSeason(
  weeks: SeasonTeams[],
  weights: StatWeights,
  season: Season
) {
  const { teamArr } = algo2(weeks, totalWeightsToPerGame(weights), season);
  return {
    // weightedRankings,
    // weeks: weeks.map((st) => Array.from(st.entries())),
    // rmps: rmps.map(wk=>[...wk.entries()]),
    teamArr: teamArr,
    teamArrSTR: teamArr.map((wk) => toPgRankingString(wk)),
    // weightedWeeks: weightedRankedWeeks,
    // weightedWeeksSTR: weightedRankedWeeks.map((wk) => toPgRankingString(wk)),
  };
}
