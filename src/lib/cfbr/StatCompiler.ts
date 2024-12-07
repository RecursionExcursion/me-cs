import { GameData } from "../../types/game";
import { PerGameStats, TeamStats } from "../../types/stats";
import { round } from "../util/helpers";
import { SeasonGames, SeasonTeams } from "./Season";

const PG_DECIMAL_PLACES = 2;

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

  public compileStats(stopWeek?: number) {
    if (!stopWeek) {
      //IIFE
      stopWeek = (() =>
        this.#completeGames
          .map((cg) => cg.game.week)
          .reduce((max, wk) => Math.max(max, wk), 0))();
    }

    const weeks: SeasonTeams[] = [];
    for (let i = 1; i <= stopWeek; i++) {
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
        totalStats: {
          offense: Number.parseInt(homeYards),
          defense: Number.parseInt(awayYards),
          pointsFor: gameData.game.home_points,
          pointsAllowed: gameData.game.away_points,
        },
      } as CollectedTeamStats;

      const awayTeam = {
        teamId: gameData.game.away_id,
        totalStats: {
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

      if (
        collectedStats.totalStats.pointsFor >
        collectedStats.totalStats.pointsAllowed
      ) {
        mapTeam.stats.totalStats.wins++;
      } else {
        mapTeam.stats.totalStats.losses++;
      }

      //Total Stats
      mapTeam.stats.totalStats.offense += collectedStats.totalStats.offense;
      mapTeam.stats.totalStats.defense += collectedStats.totalStats.defense;
      mapTeam.stats.totalStats.pointsFor += collectedStats.totalStats.pointsFor;
      mapTeam.stats.totalStats.pointsAllowed +=
        collectedStats.totalStats.pointsAllowed;

      //Per Game Stats
      const gamesPlayed = mapTeam.stats.games;
      mapTeam.stats.pgStats = {
        winPG: mapTeam.stats.totalStats.wins / gamesPlayed,
        lossPG: mapTeam.stats.totalStats.losses / gamesPlayed,
        offPG: mapTeam.stats.totalStats.offense / gamesPlayed,
        defPG: mapTeam.stats.totalStats.defense / gamesPlayed,
        pfPG: mapTeam.stats.totalStats.pointsFor / gamesPlayed,
        paPG: mapTeam.stats.totalStats.pointsAllowed / gamesPlayed,
      };

      Object.keys(mapTeam.stats.pgStats).forEach((key) => {
        const typedKey = key as keyof PerGameStats;
        mapTeam.stats.pgStats[typedKey] = round(
          mapTeam.stats.pgStats[typedKey],
          PG_DECIMAL_PLACES
        );
      });
    }
  }
}
