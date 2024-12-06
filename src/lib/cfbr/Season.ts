import { GameData } from "../../types/game";
import { StatRanker } from "../old/cfbApi/StatRanker";
import { StatWeights } from "../../types/stats";
import { Team } from "../../types/Team";
import { generateSeasonData } from "./dataRetrievalService";
import { StatCompiler } from "./StatCompiler";

export type SeasonTeams = Map<number, Team>;
export type SeasonGames = Map<number, GameData>;
// export type CachableTeams = Map<number, CachableTeam>;

export class Season {
  #year: number;
  #teams: SeasonTeams;
  #games: SeasonGames;
  private weeks: SeasonTeams[];
  private rankedWeeks: Team[][];

  constructor(year: number, teams: SeasonTeams, games: SeasonGames) {
    this.#year = year;
    this.#teams = teams;
    this.#games = games;
    this.weeks = [];
    this.rankedWeeks = [];
  }

  public static async CreateSeason(year: number) {
    const { teamMap, gamesData } = await generateSeasonData(year);
    const season = new Season(year, teamMap, gamesData);
    return season;
  }

  public getTeams = () => this.#teams;
  public getGames = () => this.#games;
  public getYear = () => this.#year;
  public getWeeks = () => this.weeks;
  public getWeek = (week: number) => this.weeks[week - 1];
  public getRankedWeeks = () => this.rankedWeeks;
  public getRankedWeek = (week: number) => this.rankedWeeks[week - 1];
  public findTeamById = (id: number) => this.#teams.get(id);
  public findGameById = (id: number) => this.#games.get(id);
  public findTeamByName(search: string) {
    const evaluate = (s: string): boolean => {
      if (!s) return false;

      return s.toLowerCase() === search.toLowerCase();
    };

    return Array.from(this.#teams.values()).find((team) => {
      return (
        evaluate(team.school.abbreviation) ||
        evaluate(team.school.alt_name1) ||
        evaluate(team.school.alt_name2) ||
        evaluate(team.school.alt_name3)
      );
    });
  }

  public toJson() {
    return JSON.stringify({
      teams: Array.from(this.#teams.entries()),
      games: Array.from(this.#games.entries()),
    });
  }

  //TODO pull out of this object
  public rankTeams(weights: StatWeights) {
    this.compileStats();
    const ranker = new StatRanker(this.weeks, weights);
    ranker.rankSeason();
  }

  compileStats() {
    const compiler = new StatCompiler(this.#teams, this.#games);
    return compiler.compileStats();

    //   const completedGames = Array.from(this.#games.values()).filter(
    //   (g) => g.game.completed
    // );

    // this.weeks = [];

    // for (let i = 1; i <= 2; i++) {
    //   const weekGames = completedGames.filter((g) => g.game.week === i);
    //   compileWeekStats(this.#teams, weekGames);
    //   this.weeks.push(structuredClone(this.#teams));
    // }
  }
}
