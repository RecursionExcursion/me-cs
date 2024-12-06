import { cache } from "../../lib/cache/cache";
import { Season } from "../../lib/old/cfbr/Season";
import { StatWeights } from "../../types/stats";

const cfbrService = {
  async getAllTeams(year: 2024) {
    const season = await cache().get(year);

    return season.getTeams();
  },

  async rankTeams(weights: StatWeights) {
    const season = await Season.CreateSeason(2024);
    season.rankTeams(weights);
  },
};

// const seasonCache = new Map<number, Season>();

// async function getSeason(year: number): Promise<Season> {
//   if (!seasonCache.has(year)) {
//     console.log("No season found! Creating new season!");
//     seasonCache.set(year, await Season.CreateSeason(year));
//     console.log(`${year} season cached`);
//   }
//   console.log(`Retrieving ${2024} season`);
//   return seasonCache.get(year)!;
// }

export default cfbrService;
