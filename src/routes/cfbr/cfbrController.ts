import { Request, Response } from "express";
import cfbrService from "./cfbrService";
import { cache } from "../../lib/cache/cachingService";
import { StatWeights } from "../../types/stats";

export const getTeams = async (req: Request, res: Response) => {
  const teams = await cfbrService.getAllTeams(2024);
  res.status(200).send({ teams: Array.from(teams.entries()) });
};

export const getTeam = async (req: Request, res: Response) => {
  const team = await cfbrService.getTeam("michigan", 2024);
  res.status(200).send(team);
};

export const getGame = async (req: Request, res: Response) => {
  const id = 401634305;
  const game = await cfbrService.getGame(id, 2024);
  res.status(200).send(game);
};

export const getTeamGames = async (req: Request, res: Response) => {
  const team = "Miami";
  const year = 2024;

  const games = await cfbrService.getTeamGames(team, year);

  res.status(200).send(games);
};

export const getStats = async (req: Request, res: Response) => {
  const weeks = await cfbrService.getStats(2024);
  const mappedWeeks = weeks.map((wk) => Array.from(wk.entries()));
  res.status(200).send(mappedWeeks);
};

export async function getRankings(req: Request, res: Response) {
  const placeholderWeights: StatWeights = {
    wins: 6,
    losses: 6,
    offense: 2,
    defense: 2,
    pointsAllowed: 3,
    pointsFor: 3,
  };

  const rankings = await cfbrService.rankTeams(placeholderWeights);

  res.status(200).send(rankings);
}

export const test = async (req: Request, res: Response) => {
  res.status(200).send(cache().load(2024));
};
