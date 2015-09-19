import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

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
    {
      message: messages.expected,
      line: 1,
      column: 17,
    },
    "unitless fractional value without leading zero"
  )
  tr.notOk(
    "a { line-height: -.5; }",
    {
      message: messages.expected,
      line: 1,
      column: 18,
    },
    "negative unitless fractional value without leading zero"
  )
  tr.notOk(
    "a { margin: .5px; }",
    {
      message: messages.expected,
      line: 1,
      column: 12,
    },
    "fractional value with units without leading zero"
  )
  tr.notOk(
    "a { margin: 1px .5px; }",
    {
      message: messages.expected,
      line: 1,
      column: 16,
    },
    "fractional value without leading zero in the middle of a list"
  )
  tr.notOk(
    "a { transform: translate(.4px, 2px); }",
    {
      message: messages.expected,
      line: 1,
      column: 25,
    },
    "fractional value without leading zero at the beginning  of a function"
  )
  tr.notOk(
    "a { transform: translate(2px, .4px); }",
    {
      message: messages.expected,
      line: 1,
      column: 30,
    },
    "fractional value without leading zero in the middle of a function"
  )
  tr.notOk("@media (min-width: .01em)", {
    message: messages.expected,
    line: 1,
    column: 19,
  }, "media feature")
})

testRule("never", tr => {
  warningFreeBasics(tr)

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
    {
      message: messages.rejected,
      line: 1,
      column: 18,
    },
    "unitless fractional value with leading zero"
  )
  tr.notOk(
    "a { line-height: -0.5; }",
    {
      message: messages.rejected,
      line: 1,
      column: 19,
    },
    "negative unitless fractional value with leading zero"
  )
  tr.notOk(
    "a { margin: 0.5px; }",
    {
      message: messages.rejected,
      line: 1,
      column: 13,
    },
    "fractional value with units with leading zero"
  )
  tr.notOk(
    "a { margin: 1px 0.5px; }",
    {
      message: messages.rejected,
      line: 1,
      column: 17,
    },
    "fractional value with leading zero in the middle of a list"
  )
  tr.notOk(
    "a { transform: translate(0.4px, 2px); }",
    {
      message: messages.rejected,
      line: 1,
      column: 26,
    },
    "fractional value with leading zero at the beginning  of a function"
  )
  tr.notOk(
    "a { transform: translate(2px, 0.8px); }",
    {
      message: messages.rejected,
      line: 1,
      column: 31,
    },
    "fractional value with leading zero in the middle of a function"
  )
})
