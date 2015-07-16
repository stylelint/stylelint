import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("short", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { color: #FFF; }")
  tr.ok("a { color: #fFf; }", "mixed case")
  tr.ok("a { color: #fffa; }")
  tr.ok("a { something: #000, #fff, #aba; }")

  tr.ok("a { color: #ff; }", "invalid short")
  tr.ok("a { color: #ffffffa; }", "invalid long")
  tr.ok("a { color: #fffffffffff; }", "invalid extra long")

  tr.ok("a { padding: 000000; }")
  tr.ok("a::before { content: \"#ABABAB\"; }")
  tr.ok("a { color: white /* #FFFFFF */; }")

  tr.notOk("a { color: #FFFFFF; }", messages.expected("short", "#FFFFFF", "#FFF"))
  tr.notOk("a { color: #FfaAFF; }", messages.expected("short", "#FfaAFF", "#FaF"))
  tr.notOk("a { color: #00aa00aa; }", messages.expected("short", "#00aa00aa", "#0a0a"))
  tr.notOk("a { something: #fff, #aba, #00ffAAaa; }", messages.expected("short", "#00ffAAaa", "#0fAa"))
})

testRule("long", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000000; }")
  tr.ok("a { color: #FFFFFF; }")
  tr.ok("a { color: #fFfFfF; }", "mixed case")
  tr.ok("a { color: #ffffffaa; }")
  tr.ok("a { something: #000000, #ffffff, #ababab; }")

  tr.ok("a { color: #ff; }", "invalid short")
  tr.ok("a { color: #ffffffa; }", "invalid long")
  tr.ok("a { color: #fffffffffff; }", "invalid extra long")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ABA\"; }")
  tr.ok("a { color: white /* #FFF */; }")

  tr.notOk("a { color: #FFF; }", messages.expected("long", "#FFF", "#FFFFFF"))
  tr.notOk("a { color: #Ffa; }", messages.expected("long", "#Ffa", "#FFffaa"))
  tr.notOk("a { color: #0a0a; }", messages.expected("long", "#0a0a", "#00aa00aa"))
  tr.notOk("a { something: #ffffff, #aabbaa, #0fAa; }", messages.expected("long", "#0fAa", "#00ffAAaa"))
})
