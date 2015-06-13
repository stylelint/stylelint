import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a { top: 0; }", "unitless zero")
  tr.ok("a { top: 10px; }", "zero at end of non-zero value")
  tr.ok("a { top: 100.00px; }", "zero at end of non-zero value after decimal")
  tr.ok("a { top: 100.010px; }")
  tr.ok("a { top: 0.10em; }", "zero at end of non-zero factional value after decimal")
  tr.ok("a { top: .1em; }", "no leading zero factional value")
  tr.ok("a { top: 0.01em; }", "leading zero factional value")
  tr.ok("a { padding: 1px 0 2px 3px; }", "unitless zero in list")
  tr.ok("a { padding: 1px 1px 2px 0; }", "unitless zero in list")
  tr.ok("a { color: pink; }", "no zero")
  tr.ok("a { color: #0ac0ac; }", "hex color value")
  tr.ok("a::before { content: \"0px 0em 0cm\"; }", "zero with units within a string")
  tr.ok("a { color: color(rgb(0,0,0) lightness(50%)); }", "zero in functions")
  tr.ok("a { color: color(rgb(0,0,0) lightness(0%)); }", "% is ok")
  tr.ok("a { transition-delay: 0s; }", "dimension unit is ok")

  tr.notOk("a { top: 0px; }", messages.rejected)
  tr.notOk("a { top: 0.000px; }", messages.rejected)
  tr.notOk("a { padding: 0px 1px 2px 3px; }", messages.rejected)
  tr.notOk("a { padding: 1px 0vmax 2px 3px; }", messages.rejected)
  tr.notOk("a { padding: 1px 2px 0rem 3px; }", messages.rejected)
  tr.notOk("a { padding: 1px 2px 3px 0em; }", messages.rejected)
  tr.notOk("a { padding: calc(1in + 0in * 2)); }", messages.rejected)
})
