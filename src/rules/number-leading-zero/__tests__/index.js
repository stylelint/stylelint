import { ruleTester } from "../../../testUtils"
import numberLeadingZero, { ruleName, messages } from ".."

const testNumberLeadingZero = ruleTester(numberLeadingZero, ruleName)

testNumberLeadingZero(true, tr => {
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

  tr.notOk(
    "a { line-height: .5; }",
    "unitless fractional value without leading zero",
    messages.expected
  )
  tr.notOk(
    "a { line-height: -.5; }",
    "negative unitless fractional value without leading zero",
    messages.expected
  )
  tr.notOk(
    "a { margin: .5px; }",
    "fractional value with units without leading zero",
    messages.expected
  )
  tr.notOk(
    "a { margin: 1px .5px; }",
    "fractional value without leading zero in the middle of a list",
    messages.expected
  )
  tr.notOk(
    "a { transform: translate(.4px, 2px); }",
    "fractional value without leading zero at the beginning  of a function",
    messages.expected
  )
  tr.notOk(
    "a { transform: translate(2px, .4px); }",
    "fractional value without leading zero in the middle of a function",
    messages.expected
  )
})

testNumberLeadingZero(false, tr => {
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
    "unitless fractional value with leading zero",
    messages.rejected
  )
  tr.notOk(
    "a { line-height: -0.5; }",
    "negative unitless fractional value with leading zero",
    messages.rejected
  )
  tr.notOk(
    "a { margin: 0.5px; }",
    "fractional value with units with leading zero",
    messages.rejected
  )
  tr.notOk(
    "a { margin: 1px 0.5px; }",
    "fractional value with leading zero in the middle of a list",
    messages.rejected
  )
  tr.notOk(
    "a { transform: translate(0.4px, 2px); }",
    "fractional value with leading zero at the beginning  of a function",
    messages.rejected
  )
  tr.notOk(
    "a { transform: translate(2px, 0.8px); }",
    "fractional value with leading zero in the middle of a function",
    messages.rejected
  )
})
