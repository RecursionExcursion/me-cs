import { Team } from "../../../types/Team";

export function toTotalRankingString(teams: Team[]) {
  return teams.map((t, i) => {
    const stats = t.stats.totalStats;

    const rank = `(${i + 1})`;
    const abbr = t.school.abbreviation;
    const weight = `[${t.weight}]`;
    const wl = `${stats.wins}-${stats.losses}`;
    const off = `Off-${stats.offense}`;
    const def = `Def-${stats.defense}`;
    const pf = `PF-${stats.pointsFor}`;
    const pa = `PA-${stats.pointsAllowed}`;

    return [rank, abbr, weight, wl, off, def, pf, pa].join(" ");
  });
}
export function toPgRankingString(teams: Team[]) {
  return teams.map((t) => {
    const stats = t.stats.pgStats;

    const rank = `(${t.stats.auxStats.rank})`;
    const abbr = t.school.abbreviation;
    const weight = `[${t.weight}]`;
    const w = `W-${stats.winPG}`;
    const l = `L-${stats.lossPG}`;
    const off = `Off-${stats.offPG}`;
    const def = `Def-${stats.defPG}`;
    const pf = `PF-${stats.pfPG}`;
    const pa = `PA-${stats.paPG}`;

    return [rank, abbr, weight, w, l, off, def, pf, pa].join(" ");
  });
}
