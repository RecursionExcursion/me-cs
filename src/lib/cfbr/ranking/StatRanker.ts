import { SeasonTeams } from "../Season";
import {
  iterableRankingStatsPG,
  PerGameStats,
  StatWeights,
  totalWeightsToPerGame,
} from "../../../types/stats";
import { Team } from "../../../types/Team";
import { comparePerGame } from "./statComparitors";
import { toPgRankingString } from "./rankingToString";

export class StatRanker {
  private weeks: SeasonTeams[];
  private weights: PerGameStats;

  constructor(weeks: SeasonTeams[], weights: StatWeights) {
    this.weeks = weeks;
    this.weights = totalWeightsToPerGame(weights);
  }

  public rankSeason() {
    //Generate maps for each stat- map of ranking arrays, with RankableStat keys as key
    const rankingMapsArray: Map<keyof PerGameStats, Team[]>[] = [];

    this.weeks.map((week) => {
      const rankingMap = new Map<keyof PerGameStats, Team[]>();

      //Compare and sort teams based on stat
      iterableRankingStatsPG.forEach((stat) => {
        const rankedWeek = Array.from(week.values()).sort((a, b) => {
          return comparePerGame(stat, a, b);
        });

        rankingMap.set(stat, rankedWeek);
      });

      rankingMapsArray.push(rankingMap);
    });

    rankingMapsArray.forEach((rankMap) => {
      Array.from(rankMap.entries()).forEach((e) => {
        const stat = e[0];
        const teams = e[1];

        let rankingIndex = 0;

        for (let i = 0; i < teams.length; ) {
          const currentTeam = teams[i];
          const statWeight = this.weights[e[0]] * rankingIndex;

          if (!currentTeam.weight) currentTeam.weight = 0;

          currentTeam.weight += statWeight;
          i++;
          if (i < teams.length - 1) {
            const nextTeam = teams[i];

            const currentStat = currentTeam.stats.pgStats[stat];
            const nextStat = nextTeam.stats.pgStats[stat];

            if (currentStat !== nextStat) {
              rankingIndex = i;
            }
          }

          // if (stat === "pointsAllowed") {
          //   console.log(
          //     `Weighted (${i}) ${currentTeam.school.abbreviation} ${currentTeam.stats.stats.pointsAllowed} as ${statWeight}`
          //   );
          // }

          //Multiply statWeight by index in array (rank), first place gets 0 weight
          //Could make it 1 for a different take on the ranking system
        }
      });
    });

    //Rank teams based on weighted stats
    //TODO  need to reflect tied weights in rank
    const weightedRankings: Team[][] = [];

    this.weeks.forEach((wk) => {
      const rankedTeams = Array.from(wk.values()).sort((a, b) => {
        const aWeight = a.weight ?? Number.MAX_SAFE_INTEGER;
        const bWeight = b.weight ?? Number.MAX_SAFE_INTEGER;
        return aWeight - bWeight;
      });
      weightedRankings.push(rankedTeams);
    });

    return {
      weightedRankings,

      rankMapArr: rankingMapsArray.map((mp) =>
        Array.from(mp.entries()).map((e) => [e[0], toPgRankingString(e[1])])
      ),

      weeks: weightedRankings.map((wk) => toPgRankingString(wk)),
    };
  }
}
