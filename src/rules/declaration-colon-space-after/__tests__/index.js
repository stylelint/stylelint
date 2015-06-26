import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink }", "space only after")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color\n: pink }", "newline before and space after")

  tr.notOk(
    "a { color :pink; }",
    messages.expectedAfter(),
    "no space after"
  )
  tr.notOk(
    "a { color :  pink; }",
    messages.expectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    messages.expectedAfter(),
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    messages.expectedAfter(),
    "newline after"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color :pink }", "space before and no space after")
  tr.ok("a { color\n:pink }", "newline before and no space after")

  tr.notOk(
    "a { color : pink; }",
    messages.rejectedAfter(),
    "space after"
  )
  tr.notOk(
    "a { color:  pink; }",
    messages.rejectedAfter(),
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    messages.rejectedAfter(),
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    messages.rejectedAfter(),
    "newline after"
  )
})
