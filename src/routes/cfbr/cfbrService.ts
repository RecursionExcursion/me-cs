import { Season } from "./cfbApi/Season";

export const getAllTeams = async () => {
  const season = await Season.CreateSeason(2024);
  season.rankTeams();
  const testTeam = season.findTeamByName("mich");
  console.log(testTeam);
  console.log(season.getWeek(1).get(130));
  console.log(season.getWeek(2).get(130));
};
