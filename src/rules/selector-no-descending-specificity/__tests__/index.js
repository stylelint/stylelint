import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(true, tr => {
  warningFreeBasics(tr)

  tr.ok("a {} b a {}")
  tr.ok("a {} a b {}")
  tr.ok("a {} a + a {}")
  tr.ok("a {} a[foo] {}")
  tr.ok("a[foo] {} a {}", "only checks matching last compound selectors")
  tr.ok("a { b {} } c + b {}")
  tr.ok("b a {} @media print { a {} }")

  tr.notOk("b a {} a {}", {
    message: messages.rejected("a", "b a"),
    line: 1,
    column: 8,
  })
  tr.notOk("a + a {} a {}", {
    message: messages.rejected("a", "a + a"),
    line: 1,
    column: 10,
  })
  tr.notOk("b > a[foo] {} a[foo] {}", {
    message: messages.rejected("a[foo]", "b > a[foo]"),
    line: 1,
    column: 15,
  })
  tr.notOk("e > f, b + e + a {} c {} a d {} z, f + a, y {}", {
    message: messages.rejected("f + a", "b + e + a"),
    line: 1,
    column: 36,
  })
  tr.notOk("e > f, b + e + a {} c {} a d {} z, f + a, y {}", {
    message: messages.rejected("f + a", "b + e + a"),
    line: 1,
    column: 36,
  })
  tr.notOk("a { & > b {} } b {}", {
    message: messages.rejected("b", "a > b"),
    line: 1,
    column: 16,
  })
  tr.notOk("b a {} @media print { #c a {} a {} }", {
    message: messages.rejected("a", "#c a"),
    line: 1,
    column: 31,
  })
})
