import { CfbApiDataFetcher } from "./cfbApi/CfbApiDataFetcher";

export const getAllTeams = async () => {
  const teamMap = await CfbApiDataFetcher.collectSeasonData(2024);

  const testTeam = teamMap.get(52);

  testTeam?.schedule.forEach((match) => {
    console.log(match);
  });
  console.log(testTeam?.schedule[0].gameStats);
};
