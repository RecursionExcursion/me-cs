import { GameData } from "../../types/game";
import { StatWeights } from "../../types/stats";
import { Team } from "../../types/Team";
import { generateSeasonData } from "./data/dataRetrievalService";
import { rankSeason } from "./ranking/StatRanker";
import { StatCompiler } from "./StatCompiler";

export type SeasonTeams = Map<number, Team>;
export type SeasonGames = Map<number, GameData>;

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

  static async CreateSeason(year: number) {
    const { teamMap, gamesData } = await generateSeasonData(year);
    const season = new Season(year, teamMap, gamesData);
    return season;
  }

  getTeams = () => this.#teams;
  getGames = () => this.#games;
  getYear = () => this.#year;
  getWeeks = () => this.weeks;
  getWeek = (week: number) => this.weeks[week - 1];
  getRankedWeeks = () => this.rankedWeeks;
  getRankedWeek = (week: number) => this.rankedWeeks[week - 1];
  findTeamById = (id: number) => this.#teams.get(id);
  findGameById = (id: number) => this.#games.get(id);
  findTeamByName(search: string) {
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

  rankTeams(weights: StatWeights) {
    return rankSeason(this.compileStats(), weights);
  }

  compileStats(stopWeek?: number) {
    const compiler = new StatCompiler(this.#teams, this.#games);
    return compiler.compileStats(stopWeek);
  }
}
