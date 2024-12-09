import { round } from "../../../util/helpers";
import { SeasonTeams } from "../../Season";
import { RankMap } from "./rankMap";

export function getWeightedWeeks(
  weightedRankMap: RankMap,
  weeks: SeasonTeams[],
  weekIndex: number
) {
  return sortByWeight(weightWeek(weightedRankMap, weeks, weekIndex));
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

      tm.stats.auxStats = team.stats.auxStats;

      tm.weight += team.weight;
      tm.weight = round(tm.weight, 2);
    });
  });
  return weightedTeamMap;
}

function sortByWeight(week: SeasonTeams) {
  const teams = Array.from(week.values()).sort((a, b) => {
    const aWeight = a.weight ?? Number.MAX_SAFE_INTEGER;
    const bWeight = b.weight ?? Number.MAX_SAFE_INTEGER;
    return aWeight - bWeight;
  });

  return teams;
}
