import { GameData } from "../../../types/game";
import { SeasonGames, SeasonTeams } from "./Season";

type CollectedTeamStats = {
  teamId: number;
  offense: number;
  defense: number;
  pointsFor: number;
  pointsAllowed: number;
};

export default function compileWeekStats(
  week: number,
  teams: SeasonTeams,
  games: SeasonGames
) {
  const weekGames = Array.from(games.values()).filter(
    (g) => g.game.week === week
  );

  weekGames.forEach((wg) => {
    const stats = compileGameStats(wg);
    if (!stats) {
      console.log(`No stats found for ${wg.id}`);
      return;
    }

    const { homeTeam, awayTeam } = stats;

    addStats(teams, homeTeam);
    addStats(teams, awayTeam);
  });
}

function compileGameStats(gameData: GameData) {
  if (!gameData.game.completed) return;

  const homeYards = getStat(gameData.game.home_id, "totalYards", gameData);
  const awayYards = getStat(gameData.game.away_id, "totalYards", gameData);

  if (!homeYards || !awayYards) {
    console.log("No stats found for game", gameData.game.id);
  }

  const homeTeam = {
    teamId: gameData.game.home_id,
    offense: Number.parseInt(homeYards),
    defense: Number.parseInt(awayYards),
    pointsFor: gameData.game.home_points,
    pointsAllowed: gameData.game.away_points,
  } as CollectedTeamStats;

  const awayTeam = {
    teamId: gameData.game.away_id,
    offense: Number.parseInt(awayYards),
    defense: Number.parseInt(homeYards),
    pointsFor: gameData.game.away_points,
    pointsAllowed: gameData.game.home_points,
  } as CollectedTeamStats;

  return { homeTeam, awayTeam };
}

function getStat(teamId: number, category: string, gameData: GameData) {
  const team = gameData.gameStats?.teams.find(
    (team) => team.schoolId === teamId
  );
  return team?.stats.find((stat) => stat.category === category)?.stat || "0";
}

function addStats(teams: SeasonTeams, stats: CollectedTeamStats) {
  const mapTeam = teams.get(stats.teamId);
  if (!mapTeam) return;

  mapTeam.stats.totalOffense += stats.offense;
  mapTeam.stats.totalDefense += stats.defense;
  mapTeam.stats.pointsFor += stats.pointsFor;
  mapTeam.stats.pointsAllowed += stats.pointsAllowed;
}
