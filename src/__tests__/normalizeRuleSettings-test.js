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
    normalizeRuleSettings([ 2, { warn: true } ]),
    [ 2, { warn: true } ],
    "arrayed number with secondary options returns same"
  )
  t.deepEqual(normalizeRuleSettings("always", "foo"), ["always"],
    "solo string returns arrayed string")
  t.deepEqual(normalizeRuleSettings(["always"], "foo"), ["always"],
    "arrayed string returns arrayed string")
  t.deepEqual(
    normalizeRuleSettings([ "always", { warn: true } ], "foo"),
    [ "always", { warn: true } ],
    "arrayed string with secondary options returns same"
  )
  t.deepEqual(normalizeRuleSettings(true, "foo"), [true],
    "solo boolean returns arrayed boolean")
  t.deepEqual(normalizeRuleSettings([false], "foo"), [false],
    "arrayed boolean returns arrayed boolean if rule is not special")
  t.deepEqual(
    normalizeRuleSettings([ true, { warn: true } ]),
    [ true, { warn: true } ],
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
    normalizeRuleSettings([ [ "calc", "rgba" ], { warn: true } ], "function-whitelist"),
    [ [ "calc", "rgba" ], { warn: true } ],
    "nested primary option array returns same"
  )
  t.deepEqual(
    normalizeRuleSettings([ "alphabetical", { warn: true } ], "rule-properties-order"),
    [ "alphabetical", { warn: true } ],
    "string as first primary option returns same"
  )
  t.end()
})
