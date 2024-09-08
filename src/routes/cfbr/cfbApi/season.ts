import { GameData } from "../../../types/game";
import { CfbApiDataAccessor } from "./CfbApiDataFetcher";
import compileWeekStats from "./statCompiler";
import { Team } from "./Team";

export type SeasonTeams = Map<number, Team>;
export type SeasonGames = Map<number, GameData>;
type SeasonWeek = SeasonTeams[];

export class Season {
  private year: number;
  private teams: SeasonTeams;
  private games: SeasonGames;
  private weeks: SeasonWeek;

  private constructor(year: number, teams: SeasonTeams, games: SeasonGames) {
    this.year = year;
    this.teams = teams;
    this.games = games;
    this.weeks = [];
  }

  public static async CreateSeason(year: number) {
    const { teamMap, gamesData } = await CfbApiDataAccessor.generateSeasonData(
      year
    );
    const season = new Season(year, teamMap, gamesData);
    return season;
  }

  public getWeeks = () => this.weeks;
  public getWeek = (week: number) => this.weeks[week - 1];
  public findTeamById = (id: number) => this.teams.get(id);
  public findGameById = (id: number) => this.games.get(id);
  public findTeamByName(search: string) {
    const evaluate = (s: string): boolean => {
      if (!s) return false;

      return s.toLowerCase() === search.toLowerCase();
    };

    return Array.from(this.teams.values()).find((team) => {
      return (
        evaluate(team.school.abbreviation) ||
        evaluate(team.school.alt_name1) ||
        evaluate(team.school.alt_name2) ||
        evaluate(team.school.alt_name3)
      );
    });
  }

  public rankTeams() {
    this.compileStats();
  }

  private compileStats() {
    this.weeks = [];
    for (let i = 1; i <= 2; i++) {
      //TODO: Filtering each iteration, very inefficient, but may not really matter
      compileWeekStats(i, this.teams, this.games);
      this.weeks.push(structuredClone(this.teams));
    }
  }
}
