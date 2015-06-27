import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink\n! important; }", "newline before and space after")

  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color: pink!  important; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.expectedAfter(),
    "newline after"
  )

  tr.ok("a::before { content: \"!!!\" ! important; }", "ignores string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no space before or after")
  tr.ok("a { color: pink !important; }", "space before and none after")
  tr.ok("a { color: pink\n!important; }", "newline before and none after")

  tr.notOk(
    "a { color: pink! important; }",
    messages.rejectedAfter(),
    "space after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    messages.rejectedAfter(),
    "newline after"
  )
})
