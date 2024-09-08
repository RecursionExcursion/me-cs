import { Game, GameData, GameStats } from "../../../types/game";
import { CfbApiRequestBuilder } from "./CfbApiRequestBuilder";
import { SeasonGames, SeasonTeams } from "./Season";
import { School, Team } from "./Team";

export class CfbApiDataAccessor {
  public static async generateSeasonData(year: number) {
    const cfbRb = new CfbApiRequestBuilder(year);

    const gamesRes = await cfbRb.getGames();
    const teamsRes = await cfbRb.getTeams();

    const games = await gamesRes.json();
    const teams = await teamsRes.json();

    const teamMap = this.mapToTeams(teams);
    const gamesData = await this.mapToGameData(games, cfbRb);
    this.addGamesToTeamSchedules(teamMap, gamesData);

    return { teamMap, gamesData };
  }

  private static mapToTeams(data: School[]): SeasonTeams {
    const teamMap = new Map<number, Team>();
    data
      .map((school: School) => new Team(school))
      .forEach((team: Team) => teamMap.set(team.id, team));
    return teamMap;
  }

  private static async mapToGameData(
    gamesData: Game[],
    rb: CfbApiRequestBuilder
  ): Promise<SeasonGames> {
    const seasonGames = new Map<number, GameData>();

    let latestCompletedWeek = 0;
    gamesData.forEach((game: Game) => {
      if (game.completed) {
        latestCompletedWeek = Math.max(latestCompletedWeek, game.week);
      }
    });

    const statsByWeek: GameStats[][] = [];

    for (let i = 1; i <= latestCompletedWeek; i++) {
      const statsRes = await rb.getStats(i);
      const stats = await statsRes.json();
      statsByWeek.push(stats);
    }

    gamesData
      .map((game: Game) => {
        let gameStat: GameStats | undefined = undefined;

        if (latestCompletedWeek >= game.week) {
          gameStat = statsByWeek[game.week - 1].find(
            (stat) => stat.id === game.id
          );
        }

        const data: GameData = {
          id: game.id,
          game: game,
          gameStats: gameStat,
        };
        return data;
      })
      .forEach((gameData: GameData) => {
        seasonGames.set(gameData.id, gameData);
      });
    return seasonGames;
  }

  private static async addGamesToTeamSchedules(
    teams: SeasonTeams,
    games: SeasonGames
  ) {
    for (const [key, val] of games.entries()) {
      const game = val.game;
      const homeTeam = teams.get(game.home_id);
      const awayTeam = teams.get(game.away_id);

      if (homeTeam && awayTeam) {
        homeTeam.schedule.push(key);
        awayTeam.schedule.push(key);
      }
    }
  }
}
