import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(1, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\n")
  tr.ok("a \n{ color: pink; top: 3px; }")
  tr.ok("a {\n color: pink; top: 3px; }")
  tr.ok("a { color: pink;\n top: 3px; }")
  tr.ok("a,\nb { color: pink; top: 3px; }")
  tr.ok("@media screen {\na { color: pink; }}")
  tr.ok("a { color: pink; }\r\n")
  tr.ok("a \r\n{ color: pink; top: 3px; }")
  tr.ok("a {\r\n color: pink; top: 3px; }")
  tr.ok("a { color: pink;\r\n top: 3px; }")

  tr.notOk(
    "a { color: pink; top: 3px; }",
    messages.expected(1),
    "single-line rule with 2 declarations"
  )

  tr.notOk(
    "@media screen {\na { color: pink; top: 3px; }}",
    messages.expected(1),
    "single-line rule with 2 declarations within nested multi-line"
  )
})

testRule(2, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; top: 1px; }")

  tr.notOk(
    "a { color: pink; top: 3px; right: 2px; }",
    messages.expected(2),
    "single-line rule with 3 declarations"
  )
})
