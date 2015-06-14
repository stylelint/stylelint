import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")

  tr.ok(".foo { display: flex; }")
  tr.notOk(".foo { display: -webkit-flex; }",
    messages.rejected("-webkit-flex"))
  tr.notOk(".foo { color: pink; display: -webkit-flex; }",
    messages.rejected("-webkit-flex"))
  tr.notOk(".foo { display: -webkit-box; }",
    messages.rejected("-webkit-box"))

  tr.ok(".foo { background: linear-gradient(to top, #000, #fff); }")
  tr.notOk(".foo { background: -webkit-linear-gradient(bottom, #000, #fff); }",
    messages.rejected("-webkit-linear-gradient"))

  tr.ok(".foo { max-width: max-content; }")
  tr.notOk(".foo { max-width: -moz-max-content; }",
    messages.rejected("-moz-max-content"))
})
