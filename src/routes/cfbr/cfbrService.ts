import { Season } from "../../lib/cfbr/Season";
import { StatWeights } from "../../types/stats";

const cfbrService = {
  async getAllTeams(year: number) {
    const season = await Season.CreateSeason(year);
    return season.getTeams();
  },

  async getTeam(teamName: string, year: number) {
    const season = await Season.CreateSeason(year);
    return season.findTeamByName(teamName);
  },

  async getTeamGames(teamName: string, year: number) {
    const team = await this.getTeam(teamName, year);

    if (!team) return [];

    return Promise.all(
      team.schedule.map(async (game) => await cfbrService.getGame(game, year))
    );
  },

  async getGame(gameId: number, year: number) {
    const season = await Season.CreateSeason(year);
    return season.findGameById(gameId);
  },

  async rankTeams(weights: StatWeights) {
    const season = await Season.CreateSeason(2024);
    return season.rankTeams(weights);
  },

  async getStats(year: number) {
    const season = await Season.CreateSeason(year);
    const weeks = season.compileStats();
    return weeks;
  },
};

export default cfbrService;
