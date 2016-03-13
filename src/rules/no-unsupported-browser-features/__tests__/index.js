import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// These are just enough to ensure that the integration with doiuse
// is working as expected: but that tool has its own tests.
// The tests below are mostly copied from doiuse.
//
testRule(true, tr => {
  warningFreeBasics(tr)
})

testRule(true, { browsers: "last 2 versions" },tr => {
  warningFreeBasics(tr)
  tr.ok("a { opacity: 1; }")
  tr.ok("a { outline: none; }")
  tr.ok("a { background: linear-gradient(black, white); }")
})

testRule(true, { browsers: "ie >= 7, safari >= 6" }, tr => {
  warningFreeBasics(tr)

  tr.notOk("a { opacity: 1; }", {
    message: messages.rejected("CSS3 Opacity not supported by: IE (7,8)"),
    line: 1,
    column: 5,
  }, "opacity")
  tr.notOk("a { outline: none; }", {
    message: messages.rejected("CSS outline not supported by: IE (7)"),
    line: 1,
    column: 5,
  }, "outline")
})

testRule(true, { browsers: "ie >= 7, safari >= 6", ignore: "outline" }, tr => {
  warningFreeBasics(tr)
  tr.ok("a { outline: none; }")

  tr.notOk("a { opacity: 1; }", {
    message: messages.rejected("CSS3 Opacity not supported by: IE (7,8)"),
    line: 1,
    column: 5,
  }, "opacity")
})

testRule(true, { browsers: "ie >= 9" }, tr => {
  warningFreeBasics(tr)
  tr.ok("a { opacity: 1; }")
  tr.ok("a { outline: none; }")

  tr.notOk("a { background: linear-gradient(black, white); }", {
    message: messages.rejected("CSS Gradients not supported by: IE (9)"),
    line: 1,
    column: 5,
  }, "gradient")
})
