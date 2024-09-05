/* eslint-disable @typescript-eslint/no-explicit-any */
import { Game, GameStats } from "../../../types/game";
import { Team } from "../../../types/school";
import { CfbApiRequestBuilder } from "../cfbApi/cfbApiRequestBuilder";

export class TeamBuilder {
  public static mapToTeams(data: any) {
    const teamMap = new Map<number, Team>();
    data
      .map((team: any) => {
        return {
          id: team.id,
          school: team,
          schedule: [],
        };
      })
      .forEach((team: Team) => {
        teamMap.set(team.id, team);
      });
    return teamMap;
  }

  public static addGamesToTeams(games: Game[], teamMap: Map<number, Team>) {
    let latestCompletedWeek = 0;

    games.forEach((game: Game) => {
      const homeTeam = teamMap.get(game.home_id);
      const awayTeam = teamMap.get(game.away_id);

      if (game.completed) {
        latestCompletedWeek = Math.max(latestCompletedWeek, game.week);
      }

      const match = {
        id: game.id,
        game: game,
        gameStats: {} as GameStats,
      };

      homeTeam?.schedule.push(match);
      awayTeam?.schedule.push(match);
    });

    return latestCompletedWeek;
  }

  public static async addStats(
    teamMap: Map<number, Team>,
    latestWeek: number,
    rb: CfbApiRequestBuilder
  ) {
    for (let i = 1; i <= latestWeek; i++) {
      const statsRes = await rb.getStats(i);
      const stats = await statsRes.json();

      this.addStatsToGames(stats, teamMap);
    }
  }

  private static addStatsToGames(
    stats: GameStats[],
    teamMap: Map<number, Team>
  ) {
    stats.forEach((stat: GameStats) => {
      const gameId = stat.id;
      const homeTeam = teamMap.get(stat.teams[0].schoolId);
      const awayTeam = teamMap.get(stat.teams[1].schoolId);

      if (homeTeam) {
        const game = homeTeam.schedule.find((match) => match.id === gameId);
        if (game) {
          game.gameStats = stat;
        }
      }
      if (awayTeam) {
        const game = awayTeam.schedule.find((match) => match.id === gameId);
        if (game) {
          game.gameStats = stat;
        }
      }
    });
  }
}
