import assert from "node:assert";
import test from "node:test";
import { StatWeights } from "../../src/types/stats";
import { MOCK_SEASON, mTeams } from "../mockData/mockSeason";

const statWeights: StatWeights = {
  wins: 1,
  losses: 1,
  offense: 1,
  defense: 1,
  pointsAllowed: 1,
  pointsFor: 1,
  pollInertia: 1,
  strengthOfSchedule: 1,
};

test("Ranking Algo", async (t) => {
  const season = MOCK_SEASON;
  const { rankings, rnkmps } = season.rankTeams(statWeights);

  await t.test("Leader Test", async (r) => {
    await r.test("Week 1", () => {
      assert.strictEqual(rankings[0][0].id, mTeams.teamA.id);
    });

    await r.test("Week 2", () => {
      assert.strictEqual(rankings[1][0].id, mTeams.teamA.id);
    });
  });

  await t.test("Rank Map", async (r) => {
    await r.test("Off", () => {
      // const week1 = rnkmps[1];
      // const w1OffPg = week1.get("offPG");

      // if (!w1OffPg) throw Error("Cannot find week 1 offense per game rank map");

      // //Should have 125 & Weight of 2 * statWeight(1)
      // assert.strictEqual(w1OffPg[1].id, mTeams.teamC.id);
      // assert.strictEqual(w1OffPg[1].weight, 2 * statWeights.offense);

      // //Should have 100 & Weight of 3 * statWeight(1)
      // assert.strictEqual(w1OffPg[2].id, mTeams.teamB.id);
      // assert.strictEqual(w1OffPg[2].weight, 3 * statWeights.offense);
    });
  });
});
