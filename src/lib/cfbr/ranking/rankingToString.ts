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
    const pgStats = t.stats.pgStats;
    const auxStats = t.stats.auxStats;

    const rank = `(${t.stats.rank})`;
    const abbr = t.school.abbreviation;
    const weight = `[${t.weight}]`;
    const w = `W-${pgStats.winPG}`;
    const l = `L-${pgStats.lossPG}`;
    const off = `Off-${pgStats.offPG}`;
    const def = `Def-${pgStats.defPG}`;
    const pf = `PF-${pgStats.pfPG}`;
    const pa = `PA-${pgStats.paPG}`;
    const pi = `PI-${auxStats.pollInertia}`
    const ss = `SS-${auxStats.strengthOfSchedule}`

    return [rank, abbr, weight, w, l, off, def, pf, pa, pi, ss].join(" ");
  });
}
