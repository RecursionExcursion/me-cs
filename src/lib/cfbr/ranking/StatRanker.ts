import { Season, SeasonTeams } from "../Season";
import { StatWeights, totalWeightsToPerGame } from "../../../types/stats";
import { toPgRankingString } from "./rankingToString";
import { rankingAlgo } from "./rankingAlgo/rankingAlgo";

export function rankSeason(
  weeks: SeasonTeams[],
  weights: StatWeights,
  season: Season
) {
  const { rankings, rnkmps, OgRnkMps } = rankingAlgo(
    weeks,
    totalWeightsToPerGame(weights),
    season
  );
  return {
    // weightedRankings,
    // weeks: weeks.map((st) => Array.from(st.entries())),
    // rmps: rmps.map(wk=>[...wk.entries()]),
    rankings,
    teamArrSTR: rankings.map((wk) => toPgRankingString(wk)),
    rnkmps,
    rnkmpsSRT: rnkmps.map((rm) => [...rm.entries()]),
    OgrmpsBr: OgRnkMps.map((rm) => [...rm.entries()]),
    // weightedWeeks: weightedRankedWeeks,
    // weightedWeeksSTR: weightedRankedWeeks.map((wk) => toPgRankingString(wk)),
  };
}
