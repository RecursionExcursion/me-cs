import { Season, SeasonTeams } from "./Season";
import { iterableRankingStats, RankableStats, StatWeights } from "./stats";
import { Team } from "./Team";

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
        e[1].forEach((team, i) => {
          const statWeight = this.weights[e[0]];

          if (!team.weight) {
            team.weight = 0;
          }
          //Multiply statWeight by index in array (rank), first place gets 0 weight
          //Could make it 1 for a different take on the ranking system
          team.weight += statWeight * i;
        });
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

    logTeams(weightedRankings[0]);
  }

  private static compare(stat: keyof RankableStats, teamA: Team, teamB: Team) {
    switch (stat) {
      case "offense":
        return teamB.stats.offense - teamA.stats.offense;
      case "defense":
        return teamA.stats.defense - teamB.stats.defense;
      case "pointsFor":
        return teamB.stats.pointsFor - teamA.stats.pointsFor;
      case "pointsAllowed":
        return teamA.stats.pointsAllowed - teamB.stats.pointsAllowed;
      default:
        throw new Error(`Comparison for stat-${stat} not implemented`);
    }
  }
}

const logTeams = (teams: Team[]) => {
  teams.forEach((t, i) => {
    console.log(
      `(${i + 1}) ${t.school.abbreviation} ${t.weight} ${logStats(t)}`
    );
  });
};

const logStats = (team: Team) => {
  const statArr: string[] = [];
  Object.entries(team.stats).forEach((statEntry) => {
    statArr.push(`${statEntry[0]}(${statEntry[1]})`);
  });
  return statArr.join(" ");
};
