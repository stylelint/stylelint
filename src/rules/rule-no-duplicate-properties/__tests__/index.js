import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; background: orange; }")
  tr.ok("a { color: pink; { &:hover { color: orange; } } }", "spec nested")
  tr.ok("a { color: pink; @media { color: orange; } }", "nested")
  tr.ok("a { color: pink; @media { color: orange; &::before { color: black; } } }", "double nested")

  tr.notOk("a { color: pink; color: orange }", messages.rejected("color"))
  tr.notOk("a { color: pink; background: orange; color: orange }", messages.rejected("color"))
  tr.notOk("a { color: pink; background: orange; background: pink; }", messages.rejected("background"))
  tr.notOk(
    "a { color: pink; { &:hover { color: orange; color: black; } } }",
    messages.rejected("color"),
    "spec nested"
  )
  tr.notOk(
    "a { color: pink; @media { color: orange; color: black; } }",
    messages.rejected("color"),
    "nested"
  )
  tr.notOk(
    "a { color: pink; @media { color: orange; &::before { color: black; color: white; } } }",
    messages.rejected("color"),
    "double nested"
  )
  tr.notOk(
    "a { color: pink; @media { color: orange; .foo { color: black; color: white; } } }",
    messages.rejected("color"),
    "double nested again"
  )
})
