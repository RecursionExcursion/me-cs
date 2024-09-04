import { Game, GameStats } from "../../types/game";
import { Team } from "../../types/school";
import { CfbApiQueryManager } from "./cfbApi/cfbApiManager";

export const getAllTeams = async () => {
  const cfbQuery = new CfbApiQueryManager(2024);

  const gamesRes = await cfbQuery.getGames();
  const teamsRes = await cfbQuery.getTeams();

  const games = await gamesRes.json();
  const teams = await teamsRes.json();

  const teamMap = mapToTeams(teams);
  const lastWeek = addGamesToTeams(games, teamMap);

  for (let i = 1; i <= lastWeek; i++) {
    const statsRes = await cfbQuery.getStats(i);
    const stats = await statsRes.json();

    // console.log(stats);
    
    addStatsToGames(stats, teamMap);
  }

  const testTeam = teamMap.get(52);

  testTeam?.schedule.forEach((match) => {
    console.log(match);
  });
  console.log(testTeam?.schedule[0].gameStats.teams[0].stats);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToTeams(data: any) {
  const teamMap = new Map<number, Team>();
  data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((team: any) => {
      return {
        id: team.id,
        school: team,
        schedule: [],
      };
    })
    .forEach((team: Team) => {
      teamMap.set(team.id, team);
    });
  return teamMap;
}

function addGamesToTeams(games: Game[], teamMap: Map<number, Team>) {
  let latestCompletedWeek = 0;

  games.forEach((game: Game) => {
    const homeTeam = teamMap.get(game.home_id);
    const awayTeam = teamMap.get(game.away_id);

    if (game.completed) {
      latestCompletedWeek = Math.max(latestCompletedWeek, game.week);
    }

    const match = {
      id: game.id,
      game: game,
      gameStats: {} as GameStats,
    };

    homeTeam?.schedule.push(match);
    awayTeam?.schedule.push(match);
  });

  return latestCompletedWeek;
}

function addStatsToGames(stats: GameStats[], teamMap: Map<number, Team>) {
  stats.forEach((stat: GameStats) => {
    const gameId = stat.id;
    const homeTeam = teamMap.get(stat.teams[0].schoolId);
    const awayTeam = teamMap.get(stat.teams[1].schoolId);

    if (homeTeam) {
      const game = homeTeam.schedule.find((match) => match.id === gameId);
      if (game) {
        game.gameStats = stat;
      }
    }
    if (awayTeam) {
      const game = awayTeam.schedule.find((match) => match.id === gameId);
      if (game) {
        game.gameStats = stat;
      }
    }
  });
}
