import { Season } from "./cfbApi/Season";
import { StatWeights } from "./cfbApi/stats";

export const getAllTeams = async (weights: StatWeights) => {
  const season = await Season.CreateSeason(2024);
  season.rankTeams(weights);
};
