import { Game, GameData, GameStats } from "../../../types/game";
import { School, Team } from "../../../types/Team";
import { cache } from "../../cache/cachingService";
import { getLastWeekPlayed } from "../../util/helpers";
import { fetchSeasonData } from "./fetchSeasonData";
import { SeasonGames, SeasonTeams } from "../Season";

export async function generateSeasonData(year: number) {
  //TODO Inject caching logic
  const c = cache();

  let games, teams, stats;

  if (c.check(year)) {
    //Cache has data
    ({ teams, games, stats } = c.load(year));
  } else {
    //Cache has no data
    ({ games, teams, stats } = await fetchSeasonData(year));

    c.save(
      {
        games,
        teams,
        stats,
      },
      year.toString()
    );
  }

  const teamMap = mapToTeams(teams);
  const gamesData = await mapToGameData(games, stats as GameStats[][]);
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
  statsByWeek: GameStats[][]
): Promise<SeasonGames> {
  const seasonGames = new Map<number, GameData>();

  const latestCompletedWeek = getLastWeekPlayed(gamesData);

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

    if (homeTeam) homeTeam.schedule.push(key);
    if (awayTeam) awayTeam.schedule.push(key);
  }
}
