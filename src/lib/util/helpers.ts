import { Game } from "../../types/game";

export function getLastWeekPlayed(games: Game[]) {
  let latestCompletedWeek = 0;
  games.forEach((game: Game) => {
    if (game.completed) {
      latestCompletedWeek = Math.max(latestCompletedWeek, game.week);
    }
  });

  return latestCompletedWeek;
}

export const round = (val: number, digits: number) =>
  parseFloat(val.toFixed(digits));
