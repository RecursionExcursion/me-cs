import { Game, GameData, GameStats } from "../../../types/game";
import { School, Team } from "../../../types/Team";
import { CfbApiRequestExecutor } from "./CfbApiRequestExecutor";
import { SeasonGames, SeasonTeams } from "./Season";

export async function generateSeasonData(year: number) {
  const cfbRb = new CfbApiRequestExecutor(year);
  const gamesRes = await cfbRb.getGames();
  const teamsRes = await cfbRb.getTeams();

  const games = await gamesRes.json();
  const teams = await teamsRes.json();

  const teamMap = mapToTeams(teams);
  const gamesData = await mapToGameData(games, cfbRb);
  addGamesToTeamSchedules(teamMap, gamesData);

  return { teamMap, gamesData };
}

function mapToTeams(data: School[]): SeasonTeams {
  const teamMap = new Map<number, Team>();
  data
    .map((school: School) => new Team(school))
    .forEach((team: Team) => teamMap.set(team.id, team));
  return teamMap;
}
async function mapToGameData(
  gamesData: Game[],
  rb: CfbApiRequestExecutor
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

async function addGamesToTeamSchedules(teams: SeasonTeams, games: SeasonGames) {
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
