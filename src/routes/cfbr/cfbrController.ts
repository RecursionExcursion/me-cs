import { Request, Response } from "express";
import cfbrService from "./cfbrService";
import { cache } from "../../lib/cache/cache";

export const getTeams = async (req: Request, res: Response) => {
  const teams = await cfbrService.getAllTeams(2024);
  res.status(200).send({ teams: Array.from(teams.entries()) });
};

export const getTeam = async (req: Request, res: Response) => {
  const team = await cfbrService.getTeam("michigan", 2024);
  res.status(200).send(team);
};

export const getGame = async (req: Request, res: Response) => {
  const game = await cfbrService.getGame(401628566, 2024);
  res.status(200).send(game);
};

export const getStats = async (req: Request, res: Response) => {
  const weeks = await cfbrService.getStats(2024);
  const mappedWeeks = weeks.map((wk) => Array.from(wk.entries()));
  res.status(200).send(mappedWeeks);
};

// export async function getRankings(req: Request, res: Response) {
//   const placeholderWeights: StatWeights = {
//     offense: 1,
//     defense: 1,
//     pointsAllowed: 1,
//     pointsFor: 1,
//   };

//   await cfbrService.rankTeams(placeholderWeights);
// }

export const test = async (req: Request, res: Response) => {
  res.status(200).send(cache().load(2024));
};
