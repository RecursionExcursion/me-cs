import { getLastWeekPlayed } from "../util/helpers";
import { CfbApiRequestExecutor } from "./CfbApiRequestExecutor";

export async function cfbApiRequests(year: number) {
  const cfbRb = new CfbApiRequestExecutor(year);
  const gamesRes = await cfbRb.getGames();
  const teamsRes = await cfbRb.getTeams();

  const games = await gamesRes.json();
  const teams = await teamsRes.json();

  const stats = [];

  for (let i = 1; i <= getLastWeekPlayed(games); i++) {
    const statsRes = await cfbRb.getStats(i);
    const statWk = await statsRes.json();
    stats.push(statWk);
  }

  return { games, teams, stats };
}
