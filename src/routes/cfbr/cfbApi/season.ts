import { GameData } from "../../../types/game";
import { Team } from "../../../types/school";
import { CfbApiDataFetcher } from "./CfbApiDataFetcher";

export type SeasonTeams = Map<number, Team>;
export type SeasonGames = Map<number, GameData>;

export class Season {
  year: number;
  teams: SeasonTeams;
  games: SeasonGames;

  private constructor(year: number, teams: SeasonTeams, games: SeasonGames) {
    this.year = year;
    this.teams = teams;
    this.games = games;

    console.log(teams.get(52));
  }

  public static async CreateSeason(year: number) {
    const { teamMap, gamesData } = await CfbApiDataFetcher.collectSeasonData(
      year
    );
    const season = new Season(year, teamMap, gamesData);
    return season;
  }

  /* Ready to start ranking, build accessor methods to search data */
}
