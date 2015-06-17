import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #fff, #ababab; }")
  tr.ok("a { color: #0000ffcc; }", "eight digits")
  tr.ok("a { color: #00fc; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")

  tr.notOk("a { color: #ababa; }", messages.rejected("#ababa"))
  tr.notOk("a { something: #00, #fff, #ababab; }", messages.rejected("#00"))
  tr.notOk("a { something: #000, #fff1az, #ababab; }", messages.rejected("#fff1az"))
  tr.notOk("a { something: #000, #fff, #12345aa; }", messages.rejected("#12345aa"))
})
