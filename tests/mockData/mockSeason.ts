import { Season, SeasonGames, SeasonTeams } from "../../src/lib/cfbr/Season";
import { GameData } from "../../src/types/game";
import { Team } from "../../src/types/Team";
import { createEmptyGame } from "./mockGame";
import { createEmptySchool } from "./mockSchool";

const teamA = new Team(createEmptySchool({ id: 1, name: "A", abbr: "a" }));
const teamB = new Team(createEmptySchool({ id: 2, name: "B", abbr: "b" }));
const teamC = new Team(createEmptySchool({ id: 3, name: "C", abbr: "c" }));
const teamD = new Team(createEmptySchool({ id: 4, name: "D", abbr: "d" }));

export const mTeams = { teamA, teamB, teamC, teamD };

//T1 2-0 Off-200 Def-100 PF-11 PA-8
//T2 1-1 Off-100 Def-125 PF-6 PA-6
//T3 1-1 Off-125 Def-125 PF-7 PA-8
//T4 0-2 Off-50 Def-125 PF-3 PA-5
//Week0
//1v2
const g1 = createEmptyGame({
  ids: {
    gameId: 10,
    homeId: 1,
    awayId: 2,
  },
  stats: {
    week: 1,
    homeScore: 5,
    awayScore: 4,
    homeYards: 100,
    awayYards: 50,
  },
});
//3v4
const g2 = createEmptyGame({
  ids: {
    gameId: 11,
    homeId: 3,
    awayId: 4,
  },
  stats: {
    week: 1,
    homeScore: 3,
    awayScore: 2,
    homeYards: 75,
    awayYards: 25,
  },
});

//Week1
//1v3
const g3 = createEmptyGame({
  ids: {
    gameId: 12,
    homeId: 1,
    awayId: 3,
  },
  stats: {
    week: 2,
    homeScore: 6,
    awayScore: 4,
    homeYards: 100,
    awayYards: 50,
  },
});
//2v4
const g4 = createEmptyGame({
  ids: {
    gameId: 13,
    homeId: 2,
    awayId: 4,
  },
  stats: {
    week: 2,
    homeScore: 2,
    awayScore: 1,
    homeYards: 50,
    awayYards: 25,
  },
});

export const mGames = { g1, g2, g3, g4 };

const mockGames = [g1, g2, g3, g4];
const mockTeams = [teamA, teamB, teamC, teamD];

function createSeasonTeams(teams: Team[]): SeasonTeams {
  return new Map(teams.map((t) => [t.id, t]));
}

function createSeasonGames(gameData: GameData[]): SeasonGames {
  return new Map(gameData.map((g) => [g.id, g]));
}

export const MOCK_SEASON: Season = new Season(
  2024,
  createSeasonTeams(mockTeams),
  createSeasonGames(mockGames)
);
