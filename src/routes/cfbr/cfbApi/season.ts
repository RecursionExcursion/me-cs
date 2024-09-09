import { GameData } from "../../../types/game";
import { CfbApiDataAccessor } from "./CfbApiDataFetcher";
import compileWeekStats from "./statCompiler";
import { StatRanker } from "./StatRanker";
import { StatWeights } from "./stats";
import { Team } from "./Team";

export type SeasonTeams = Map<number, Team>;
export type SeasonGames = Map<number, GameData>;

export class Season {
  private year: number;
  private teams: SeasonTeams;
  private games: SeasonGames;
  private weeks: SeasonTeams[];
  private rankedWeeks: Team[][];

  private constructor(year: number, teams: SeasonTeams, games: SeasonGames) {
    this.year = year;
    this.teams = teams;
    this.games = games;
    this.weeks = [];
    this.rankedWeeks = [];
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
  public getRankedWeeks = () => this.rankedWeeks;
  public getRankedWeek = (week: number) => this.rankedWeeks[week - 1];
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

  public rankTeams(weights: StatWeights) {
    this.compileStats();
    const ranker = new StatRanker(this.weeks, weights);
    ranker.rankSeason();
  }

  private compileStats() {
    const completedGames = Array.from(this.games.values()).filter(
      (g) => g.game.completed
    );

    this.weeks = [];
    for (let i = 1; i <= 2; i++) {
      const weekGames = completedGames.filter((g) => g.game.week === i);
      compileWeekStats(this.teams, weekGames);
      this.weeks.push(structuredClone(this.teams));
    }
  }
}
