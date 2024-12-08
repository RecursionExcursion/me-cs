import { Team } from "../../../../types/Team";
import { round } from "../../../util/helpers";
import { Season } from "../../Season";

export function setAuxStats(
  rankedWeek: Team[],
  teams: Team[][],
  weekIndex: number,
  season: Season
) {
  setPollIntertia(rankedWeek, teams, weekIndex);
  setStrengthOfSchedule(rankedWeek, season);
}

function setPollIntertia(
  rankedWeek: Team[],
  teams: Team[][],
  weekIndex: number
) {
  if (weekIndex === 0) {
    return;
  }

  const prevWeek = teams[teams.length - 1];

  prevWeek.forEach((pTeam) => {
    const currTeam = rankedWeek.find((rTeam) => rTeam.id === pTeam.id);

    if (currTeam === undefined) {
      throw Error(`${pTeam.school.abbreviation} could not be found`);
    }
    currTeam.stats.auxStats.pollInertia = pTeam.stats.rank;
  });
}

function setStrengthOfSchedule(rankedWeek: Team[], season: Season) {
  rankedWeek.forEach((team) => {
    //Calc oppoents W/L
    const numberOfGamesPlayed = team.stats.games;

    const playedGameIds = team.schedule.slice(0, numberOfGamesPlayed);

    let totalOppWins = 0;
    let totalOppRank = 0;

    playedGameIds.forEach((pgId) => {
      const game = season.findGameById(pgId);

      if (!game) {
        throw Error(`Game ${pgId} not found in Season`);
      }

      const awayId = game.game.away_id;
      const homeId = game.game.home_id;

      const oppId = homeId === team.id ? awayId : homeId;

      const oppTeam = rankedWeek.find((t) => t.id === oppId);

      if (oppTeam) {
        totalOppWins += oppTeam.stats.totalStats.wins;
        totalOppRank += oppTeam.stats.rank;
      } else {
        //Lower div school
        totalOppWins += 0;
        totalOppRank += rankedWeek.length;
      }
    });

    const ssRank = totalOppRank / numberOfGamesPlayed;
    const ssWins = totalOppWins / numberOfGamesPlayed;
    const adjustedWins = 1 - ssWins;
    const harmonicMean = (2 * ssRank * adjustedWins) / (ssRank + ssWins);
    team.stats.auxStats.strengthOfSchedule = round(harmonicMean, 2);
  });
}
