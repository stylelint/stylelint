import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}", "no values")
  tr.ok("a { margin: 0; }", "plain zero")
  tr.ok("a { line-height: 2; }", "plain integer")
  tr.ok("a { margin: 2px; }", "integer with units")
  tr.ok("a { line-height: 0.5; }", "unitless fractional value with leading zero")
  tr.ok("a { line-height: -0.5; }", "negative unitless fractional value with leading zero")
  tr.ok("a { margin: 0.5px; }", "fractional value with `px` units with leading zero")
  tr.ok("a { margin: 0.5em; }", "fractional value with `em` units with leading zero")
  tr.ok("a { line-height: 1.5; }", "unitless fractional value greater than 1")
  tr.ok("a { margin: 1.5px; }", "fractional value greater than 1 with units")
  tr.ok(
    "a { line-height: 10.5; }",
    "unitless fractional value greater than 1 with a zero before the decimal"
  )
  tr.ok(
    "a { margin: 10.5px; }",
    "fractional value greater than 1 with a zero before the decimal and units"
  )
  tr.ok(
    "a { margin: 0.3em 0.123px 0.999999px; }",
    "multiple fractional values with leading zeros"
  )
  tr.ok(
    "a { transform: translate(0.4px, 0.8px); }",
    "multiple fractional values with leading zeros in a function"
  )
  tr.ok("@media (min-width: 0.01em)", "media feature")

  tr.notOk(
    "a { line-height: .5; }",
    messages.expected,
    "unitless fractional value without leading zero"
  )
  tr.notOk(
    "a { line-height: -.5; }",
    messages.expected,
    "negative unitless fractional value without leading zero"
  )
  tr.notOk(
    "a { margin: .5px; }",
    messages.expected,
    "fractional value with units without leading zero"
  )
  tr.notOk(
    "a { margin: 1px .5px; }",
    messages.expected,
    "fractional value without leading zero in the middle of a list"
  )
  tr.notOk(
    "a { transform: translate(.4px, 2px); }",
    messages.expected,
    "fractional value without leading zero at the beginning  of a function"
  )
  tr.notOk(
    "a { transform: translate(2px, .4px); }",
    messages.expected,
    "fractional value without leading zero in the middle of a function"
  )
  tr.notOk("@media (min-width: .01em)", messages.expected, "media feature")
})

testRule("never", tr => {
  tr.ok("a {}", "no values")
  tr.ok("a { margin: 0; }", "plain zero")
  tr.ok("a { line-height: 2; }", "plain integer")
  tr.ok("a { margin: 2px; }", "integer with units")
  tr.ok("a { line-height: .5; }", "unitless fractional value without leading zero")
  tr.ok("a { line-height: -.5; }", "negative unitless fractional value without leading zero")
  tr.ok("a { margin: .5px; }", "fractional value with `px` units without leading zero")
  tr.ok("a { margin: .5em; }", "fractional value with `em` units without leading zero")
  tr.ok("a { line-height: 1.5; }", "unitless fractional value greater than 1")
  tr.ok("a { margin: 1.5px; }", "fractional value greater than 1 with units")
  tr.ok(
    "a { line-height: 10.5; }",
    "unitless fractional value greater than 1 with a zero before the decimal"
  )
  tr.ok(
    "a { margin: 10.5px; }",
    "fractional value greater than 1 with a zero before the decimal and units"
  )
  tr.ok(
    "a { margin: .3em .123px .999999px; }",
    "multiple fractional values without leading zeros"
  )
  tr.ok(
    "a { transform: translate(.4px, .8px); }",
    "multiple fractional values without leading zeros in a function"
  )

  tr.notOk(
    "a { line-height: 0.5; }",
    messages.rejected,
    "unitless fractional value with leading zero"
  )
  tr.notOk(
    "a { line-height: -0.5; }",
    messages.rejected,
    "negative unitless fractional value with leading zero"
  )
  tr.notOk(
    "a { margin: 0.5px; }",
    messages.rejected,
    "fractional value with units with leading zero"
  )
  tr.notOk(
    "a { margin: 1px 0.5px; }",
    messages.rejected,
    "fractional value with leading zero in the middle of a list"
  )
  tr.notOk(
    "a { transform: translate(0.4px, 2px); }",
    messages.rejected,
    "fractional value with leading zero at the beginning  of a function"
  )
  tr.notOk(
    "a { transform: translate(2px, 0.8px); }",
    messages.rejected,
    "fractional value with leading zero in the middle of a function"
  )
})
