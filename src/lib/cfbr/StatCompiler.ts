import { GameData } from "../../types/game";
import { TeamStats } from "../../types/stats";
import { SeasonGames, SeasonTeams } from "./Season";

export type CollectedTeamStats = TeamStats & {
  teamId: number;
};

export class StatCompiler {
  #teams: SeasonTeams;
  #completeGames: GameData[];

  constructor(teams: SeasonTeams, games: SeasonGames) {
    this.#teams = structuredClone(teams);

    const completedGames = Array.from(games.values()).filter(
      (g) => g.game.completed
    );

    this.#completeGames = structuredClone(completedGames);
  }

  public compileStats() {
    const weeks: SeasonTeams[] = [];
    for (let i = 1; i <= 4; i++) {
      weeks.push(this.#compileWeek(i));
    }
    return weeks;
  }

  #compileWeek(week: number) {
    const weekGames = this.#completeGames.filter((g) => g.game.week === week);

    weekGames.forEach((game) => {
      const stats = compileGameStats(game);
      if (!stats) {
        console.log(`No stats found for ${game.id}`);
        return;
      }

      const { homeTeam, awayTeam } = stats;

      addStats(this.#teams, homeTeam);
      addStats(this.#teams, awayTeam);
    });

    return structuredClone(this.#teams);

    function compileGameStats(gameData: GameData) {
      if (!gameData.game.completed) return;

      const homeYards = getStat(gameData.game.home_id, "totalYards", gameData);
      const awayYards = getStat(gameData.game.away_id, "totalYards", gameData);

      if (!homeYards || !awayYards) {
        console.log("No stats found for game", gameData.game.id);
      }

      const homeTeam = {
        teamId: gameData.game.home_id,
        stats: {
          offense: Number.parseInt(homeYards),
          defense: Number.parseInt(awayYards),
          pointsFor: gameData.game.home_points,
          pointsAllowed: gameData.game.away_points,
        },
      } as CollectedTeamStats;

      const awayTeam = {
        teamId: gameData.game.away_id,
        stats: {
          offense: Number.parseInt(awayYards),
          defense: Number.parseInt(homeYards),
          pointsFor: gameData.game.away_points,
          pointsAllowed: gameData.game.home_points,
        },
      } as CollectedTeamStats;

      return { homeTeam, awayTeam };
    }

    function getStat(teamId: number, category: string, gameData: GameData) {
      const team = gameData.gameStats?.teams.find(
        (team) => team.schoolId === teamId
      );
      return (
        team?.stats.find((stat) => stat.category === category)?.stat || "0"
      );
    }

    function addStats(teams: SeasonTeams, collectedStats: CollectedTeamStats) {
      const mapTeam = teams.get(collectedStats.teamId);
      if (!mapTeam) return;

      mapTeam.stats.games++;

      if (collectedStats.stats.pointsFor > collectedStats.stats.pointsAllowed) {
        mapTeam.stats.wins++;
      } else {
        mapTeam.stats.losses++;
      }

      mapTeam.stats.stats.offense += collectedStats.stats.offense;
      mapTeam.stats.stats.defense += collectedStats.stats.defense;
      mapTeam.stats.stats.pointsFor += collectedStats.stats.pointsFor;
      mapTeam.stats.stats.pointsAllowed += collectedStats.stats.pointsAllowed;
    }
  }
}
