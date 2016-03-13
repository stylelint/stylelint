import normalizeRuleSettings from "../normalizeRuleSettings"
import test from "tape"

test("rules whose primary option IS NOT an array", t => {
  t.deepEqual(normalizeRuleSettings(null, "foo"), [null],
    "solo null returns arrayed null")
  t.deepEqual(normalizeRuleSettings(2, "foo"), [2],
    "solo number returns arrayed number")
  t.deepEqual(normalizeRuleSettings([2], "foo"), [2],
    "arrayed number returns arrayed number if rule is not special")
  t.deepEqual(
    normalizeRuleSettings([ 2, { "severity": "warning" } ]),
    [ 2, { "severity": "warning" } ],
    "arrayed number with secondary options returns same"
  )
  t.deepEqual(normalizeRuleSettings("always", "foo"), ["always"],
    "solo string returns arrayed string")
  t.deepEqual(normalizeRuleSettings(["always"], "foo"), ["always"],
    "arrayed string returns arrayed string")
  t.deepEqual(
    normalizeRuleSettings([ "always", { "severity": "warning" } ], "foo"),
    [ "always", { "severity": "warning" } ],
    "arrayed string with secondary options returns same"
  )
  t.deepEqual(normalizeRuleSettings(true, "foo"), [true],
    "solo boolean returns arrayed boolean")
  t.deepEqual(normalizeRuleSettings([false], "foo"), [false],
    "arrayed boolean returns arrayed boolean if rule is not special")
  t.deepEqual(
    normalizeRuleSettings([ true, { "severity": "warning" } ]),
    [ true, { "severity": "warning" } ],
    "arrayed boolean with secondary options returns same"
  )
  t.end()
})

test("rules whose primary option CAN BE an array", t => {
  t.deepEqual(
    normalizeRuleSettings([ "calc", "rgba" ], "function-whitelist"),
    [[ "calc", "rgba" ]],
    "solo primary option array is nested within an array"
  )
  t.deepEqual(
    normalizeRuleSettings([ [ "calc", "rgba" ], { "severity": "warning" } ], "function-whitelist"),
    [ [ "calc", "rgba" ], { "severity": "warning" } ],
    "nested primary option array returns same"
  )
  t.deepEqual(
    normalizeRuleSettings([ "alphabetical", { "severity": "warning" } ], "declaration-block-properties-order"),
    [ "alphabetical", { "severity": "warning" } ],
    "string as first primary option returns same"
  )
  t.deepEqual(
    normalizeRuleSettings([ { foo: 1 }, { foo: 2 } ], "declaration-block-properties-order"),
    [[ { foo: 1 }, { foo: 2 } ]],
    "primary option array with length of 2"
  )
  t.deepEqual(
    normalizeRuleSettings([ [ { foo: 1 }, { foo: 2 } ], { "severity": "warning" } ], "declaration-block-properties-order"),
    [ [ { foo: 1 }, { foo: 2 } ], { "severity": "warning" } ],
    "primary option array with length of 2 and secondary options"
  )
  t.end()
})
