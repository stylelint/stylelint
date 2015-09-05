import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(".foo { display: flex; }")
  tr.notOk(
    ".foo { display: -webkit-flex; }",
    {
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 17,
    }
  )
  tr.notOk(
    ".foo { color: pink; display: -webkit-flex; }",
    {
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 30,
    }
  )
  tr.notOk(
    ".foo { display: -webkit-box; }",
    {
      message: messages.rejected("-webkit-box"),
      line: 1,
      column: 17,
    }
  )

  tr.ok(".foo { background: linear-gradient(to top, #000, #fff); }")
  tr.notOk(
    ".foo { background: -webkit-linear-gradient(bottom, #000, #fff); }",
    {
      message: messages.rejected("-webkit-linear-gradient"),
      line: 1,
      column: 20,
    }
  )

  tr.ok(".foo { max-width: max-content; }")
  tr.notOk(
    ".foo { max-width: -moz-max-content; }",
    {
      message: messages.rejected("-moz-max-content"),
      line: 1,
      column: 19,
    }
  )

  tr.ok(".foo { -webkit-transform: translate(0, 0); }", "ignores property vendor prefixes")
})
