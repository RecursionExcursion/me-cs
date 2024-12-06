import { logTeams } from "../../../util/logger";
import { SeasonTeams } from "../../cfbr/Season";
import {
  iterableRankingStats,
  RankableStats,
  StatWeights,
} from "../../../types/stats";
import { Team } from "../../../types/Team";

export class StatRanker {
  private weeks: SeasonTeams[];
  private weights: StatWeights;

  constructor(weeks: SeasonTeams[], weights: StatWeights) {
    this.weeks = weeks;
    this.weights = weights;
  }

  public rankSeason() {
    //Generate maps for each stat- map of ranking arrays, with RankableStat keys as key
    const rankingMapsArray: Map<keyof RankableStats, Team[]>[] = [];

    this.weeks.map((week) => {
      const rankingMap = new Map<keyof RankableStats, Team[]>();

      //Compare and sort teams based on stat
      iterableRankingStats.forEach((stat) => {
        const rankedWeek = Array.from(week.values()).sort((a, b) => {
          return StatRanker.compare(stat, a, b);
        });
        rankingMap.set(stat, rankedWeek);
      });

      rankingMapsArray.push(rankingMap);
    });

    //add weights to stats
    //Sum weighted stats
    //TODO Need to handle tied stats
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
            if (currentTeam.stats.stats[stat] !== nextTeam.stats.stats[stat]) {
              rankingIndex = i;
            }
          }

          if (stat === "pointsAllowed") {
            console.log(
              `Weighted (${i}) ${currentTeam.school.abbreviation} PA-${currentTeam.stats.stats.pointsAllowed} as ${statWeight}`
            );
          }

          //Multiply statWeight by index in array (rank), first place gets 0 weight
          //Could make it 1 for a different take on the ranking system
        }
      });
    });

    //Rank teams based on weighted stats
    const weightedRankings: Team[][] = [];

    this.weeks.forEach((wk) => {
      const rankedTeams = Array.from(wk.values()).sort((a, b) => {
        const aWeight = a.weight ?? Number.MAX_SAFE_INTEGER;
        const bWeight = b.weight ?? Number.MAX_SAFE_INTEGER;
        return aWeight - bWeight;
      });
      weightedRankings.push(rankedTeams);
    });

    test(weightedRankings, rankingMapsArray);

    return { weightedRankings, rankingMapsArray };
  }

  private static compare(stat: keyof RankableStats, teamA: Team, teamB: Team) {
    switch (stat) {
      case "offense":
        return teamB.stats.stats.offense - teamA.stats.stats.offense;
      case "defense":
        return teamA.stats.stats.defense - teamB.stats.stats.defense;
      case "pointsFor":
        return teamB.stats.stats.pointsFor - teamA.stats.stats.pointsFor;
      case "pointsAllowed":
        return (
          teamA.stats.stats.pointsAllowed - teamB.stats.stats.pointsAllowed
        );
      default:
        throw new Error(`Comparison for stat-${stat} not implemented`);
    }
  }
}

const test = (
  weightedRankings: Team[][],
  rankingMapsArray: Map<keyof RankableStats, Team[]>[]
) => {
  logTeams(weightedRankings[0]);

  console.log(rankingMapsArray[0].get("offense")?.findIndex((t) => t.id === 8));
  console.log(rankingMapsArray[0].get("defense")?.findIndex((t) => t.id === 8));
  console.log(
    rankingMapsArray[0].get("pointsAllowed")?.findIndex((t) => t.id === 8)
  );
  console.log(
    rankingMapsArray[0].get("pointsFor")?.findIndex((t) => t.id === 8)
  );
};
