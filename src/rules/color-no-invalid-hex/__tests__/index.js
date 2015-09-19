import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #fff, #ababab; }")
  tr.ok("a { color: #0000ffcc; }", "eight digits")
  tr.ok("a { color: #00fc; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")

  tr.ok("a { border-#$side: 0; }", "ignore sass-like interpolation")
  tr.ok("a { box-sizing: #$type-box; }", "ignore sass-like interpolation")

  tr.notOk("a { color: #ababa; }", {
    message: messages.rejected("#ababa"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #00, #fff, #ababab; }", {
    message: messages.rejected("#00"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { something: #000, #fff1az, #ababab; }", {
    message: messages.rejected("#fff1az"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { something: #000, #fff, #12345aa; }", {
    message: messages.rejected("#12345aa"),
    line: 1,
    column: 28,
  })
})
