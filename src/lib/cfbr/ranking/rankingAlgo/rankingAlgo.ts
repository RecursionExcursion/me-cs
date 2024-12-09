import { PgStatWeights } from "../../../../types/stats";
import { Team } from "../../../../types/Team";
import { Season, SeasonTeams } from "../../Season";
import { createWeightedRankMap, RankMap } from "./rankMap";
import { setAuxStats } from "./setAuxStats";
import { getWeightedWeeks } from "./weight";

/* Ranking Algorithim
 * Compiles feilds into seperate maps (Rank Maps) for each week.
 * Theses maps are sorted based on the stat.
 * Def stats are inc, Off stats are dec.
 * Poll Intertia and Schedule strength are inc.
 */

export function rankingAlgo(
  weeks: SeasonTeams[],
  weights: PgStatWeights,
  season: Season
) {
  const weekClone = structuredClone(weeks);

  const teams: Team[][] = [];
  const OgRnkMps: RankMap[] = [];
  const rnkmps: RankMap[] = [];

  weekClone.forEach((st, weekIndex) => {
    setAuxStats([...st.values()], teams, weekIndex, season);

    const weightedRankMap = createWeightedRankMap(st, weights, true);

    OgRnkMps.push(weightedRankMap);

    const weightedWeeks = getWeightedWeeks(
      weightedRankMap,
      structuredClone(weekClone),
      weekIndex
    );

    setRankByWeight(weightedWeeks);

    teams.push(weightedWeeks);
  });

  return { rankings: teams, rnkmps, OgRnkMps };
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
