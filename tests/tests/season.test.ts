import test from "node:test";
import assert from "node:assert";
import { mGames, MOCK_SEASON, mTeams } from "../mockData/mockSeason";

test("Fetch season test", async (t) => {
  const season = MOCK_SEASON;

  await t.test("Team", async (r) => {
    const teamA = season.findTeamByName("A");
    await r.test("id", () => {
      assert.strictEqual(teamA?.id, mTeams.teamA.id);
    });
    await r.test("name", () => {
      assert.strictEqual(teamA?.school.school, mTeams.teamA.school.school);
    });
  });

  await t.test("Game", async (r) => {
    const game1 = season.findGameById(10);

    await r.test("ids", async (s) => {
      await s.test("gameId", () => {
        assert.strictEqual(game1?.id, mGames.g1.id);
      });
      await s.test("homeId", () => {
        assert.strictEqual(game1?.game.home_id, mGames.g1.game.home_id);
      });
      await s.test("awayId", () => {
        assert.strictEqual(game1?.game.away_id, mGames.g1.game.away_id);
      });
    });

    await r.test("points", () => {
      assert.strictEqual(game1?.game.away_points, mGames.g1.game.away_points);
      assert.strictEqual(game1?.game.home_points, mGames.g1.game.home_points);
    });
  });

  await t.test("Team Games", async () => {
    const teamB = season.findTeamByName("B");

    assert.strictEqual(teamB?.id, mTeams.teamB.id);
    if (!teamB) throw Error("TeamB cannot be undefined");
    assert.deepStrictEqual(teamB.schedule, [mGames.g1.id, mGames.g4.id]);
  });
});
