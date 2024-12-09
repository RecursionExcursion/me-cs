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

export const getGames = async (req: Request, res: Response) => {
  const games = await cfbrService.getAllGames(2024);
  return res.status(200).send([...games.entries()]);
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
    wins: 1,
    losses: 1,
    offense: 1,
    defense: 1,
    pointsAllowed: 1,
    pointsFor: 1,
    pollInertia: 1,
    strengthOfSchedule: 1,
  };

  const courtWeights: StatWeights = {
    wins: 4,
    losses: 4,
    offense: 3,
    defense: 3,
    pointsAllowed: 2,
    pointsFor: 2,
    pollInertia: 3,
    strengthOfSchedule: 4,
  };
  const ryanWeights: StatWeights = {
    wins: .9,
    losses: 1.3,
    offense: .5,
    defense: .5,
    pointsAllowed: .7,
    pointsFor: .7,
    pollInertia: .7,
    strengthOfSchedule: .7,
  };

  const rankings = await cfbrService.rankTeams(ryanWeights);

  res.status(200).send(rankings);
}

export const test = async (req: Request, res: Response) => {
  res.status(200).send(cache().load(2024));
};
