import test from "node:test";
import assert from "node:assert";




import "./subtests/subtest.test"

test("should be 1", () => {
  assert.strictEqual(1, 1);
});
