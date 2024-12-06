import { Request, Response } from "express";
import cfbrService from "./cfbrService";
import { cache } from "../../lib/cache/cache";

export const getTeams = async (req: Request, res: Response) => {
  const teams = await cfbrService.getAllTeams(2024);
  res.status(200).send({ teams: Array.from(teams.entries()) });
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
  cache();

  res.status(200).send("Test");
};
