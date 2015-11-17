import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(1, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a,\nb { color: pink; }")
  tr.ok("a { color: pink; }\n")
  tr.ok("a {\n color: pink; top: 3px; }")
  tr.ok("a { color: pink;\n top: 3px; }")
  tr.ok("@media screen {\na { color: pink; }}")
  tr.ok("a { color: pink; }\r\n")
  tr.ok("a {\r\n color: pink; top: 3px; }")
  tr.ok("a { color: pink;\r\n top: 3px; }")

  tr.notOk(
    "a { color: pink; top: 3px; }", {
      message: messages.expected(1),
      line: 1,
      column: 3,
    },
    "single-line rule with 2 declarations"
  )
  tr.notOk(
    "a,\nb\n{ color: pink; top: 3px; }", {
      message: messages.expected(1),
      line: 3,
      column: 1,
    },
    "rule-line rule with single-line delclaration block with 2 declarations"
  )
  tr.notOk(
    "@media screen {\na { color: pink; top: 3px; }}", {
      message: messages.expected(1),
      line: 2,
      column: 3,
    },
    "single-line rule with 2 declarations within nested multi-line"
  )
})

testRule(2, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; top: 1px; }")

  tr.notOk(
    "a { color: pink; top: 3px; right: 2px; }", {
      message: messages.expected(2),
      line: 1,
      column: 3,
    },
    "single-line rule with 3 declarations"
  )
})
