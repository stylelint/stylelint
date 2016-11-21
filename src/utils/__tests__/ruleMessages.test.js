import ruleMessages from "../ruleMessages"

it("ruleMessages with simple messages", () => {
  expect(ruleMessages("foo", {
    good: "GOOD",
    bad: "BAD",
  })).toEqual({
    good: "GOOD (foo)",
    bad: "BAD (foo)",
  })
})

it("ruleMessages with message functions", () => {
  const fooOriginal = {
    good: x => `GOOD ${x}`,
    bad: (x, y, z) => `GOOD ${x} [${y} and ${z}]`,
  }
  const fooWithRuleName = ruleMessages("bar", fooOriginal)

  expect(fooWithRuleName.good("baz")).toBe(fooOriginal.good("baz") + " (bar)")
  expect(fooWithRuleName.bad("baz", 2, "hoohah")).toBe(fooOriginal.bad("baz", 2, "hoohah") + " (bar)")
})
