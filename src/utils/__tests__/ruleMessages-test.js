import ruleMessages from "../ruleMessages"
import test from "tape"

test("ruleMessages with simple messages", t => {
  t.deepEqual(
    ruleMessages("foo", {
      good: "GOOD",
      bad: "BAD",
    }),
    {
      good: "GOOD (foo)",
      bad: "BAD (foo)",
    })
  t.end()
})

test("ruleMessages with message functions", t => {
  const fooOriginal = {
    good: x => `GOOD ${x}`,
    bad: (x, y, z) => `GOOD ${x} [${y} and ${z}]`,
  }
  const fooWithRuleName = ruleMessages("bar", fooOriginal)

  t.equal(fooWithRuleName.good("baz"), fooOriginal.good("baz") + " (bar)")
  t.equal(fooWithRuleName.bad("baz", 2, "hoohah"), fooOriginal.bad("baz", 2, "hoohah") + " (bar)")

  t.end()
})
