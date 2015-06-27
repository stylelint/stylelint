import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink !important; }", "space only before")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink !\nimportant; }", "space before and newline after")

  tr.notOk(
    "a { color: pink  !important; }",
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color: pink!important; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.expectedBefore(),
    "newline before"
  )

  tr.ok("a::before { content: \"!!!\" !important; }", "ignores string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces")
  tr.ok("a { color: pink! important; }", "no space before and after")
  tr.ok("a { color: pink!\nimportant; }", "no space before and newline after")

  tr.notOk(
    "a { color: pink !important; }",
    messages.rejectedBefore(),
    "space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    messages.rejectedBefore(),
    "newline before"
  )
})
