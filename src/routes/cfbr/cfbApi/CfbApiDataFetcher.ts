import { TeamBuilder } from "../builders/teamBuilder";
import { CfbApiRequestBuilder } from "./cfbApiRequestBuilder";

export class CfbApiDataFetcher {
  public static async collectSeasonData(year: number) {
    const cfbRb = new CfbApiRequestBuilder(year);

    const gamesRes = await cfbRb.getGames();
    const teamsRes = await cfbRb.getTeams();

    const games = await gamesRes.json();
    const teams = await teamsRes.json();

    const teamMap = TeamBuilder.mapToTeams(teams);
    const gamesData = await TeamBuilder.mapToGameData(games, cfbRb);
    TeamBuilder.addGamesToTeamSchedules(teamMap, gamesData);

    return { teamMap, gamesData };
  }
}
