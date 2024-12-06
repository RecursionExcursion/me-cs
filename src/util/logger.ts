import { Team } from "../types/Team";

export const logTeams = (teams: Team[]) => {
  teams.forEach((t, i) => {
    console.log(
      `(${i + 1}) id(${t.id}) ${t.school.abbreviation} ${t.weight} ${logStats(
        t
      )}`
    );
  });
};

const logStats = (team: Team) => {
  const statArr: string[] = [];
  Object.entries(team.stats).forEach((statEntry) => {
    statArr.push(`${statEntry[0]}(${statEntry[1]})`);
  });
  return statArr.join(" ");
};
