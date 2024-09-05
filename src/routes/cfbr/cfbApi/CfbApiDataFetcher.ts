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
    const lastWeek = TeamBuilder.addGamesToTeams(games, teamMap);
    await TeamBuilder.addStats(teamMap, lastWeek, cfbRb);
   
    return teamMap;
  }
}
