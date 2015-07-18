import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("lower", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #fff, #ababab; }")
  tr.ok("a { color: #0000ffcc; }", "eight digits")
  tr.ok("a { color: #00fc; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ABABA\"; }")
  tr.ok("a { color: white /* #FFF */; }")

  tr.notOk("a { color: #Ababa; }", messages.expected("#Ababa", "#ababa"))
  tr.notOk("a { something: #000F, #fff, #ababab; }", messages.expected("#000F", "#000f"))
  tr.notOk("a { something: #000, #FFFFAZ, #ababab; }", messages.expected("#FFFFAZ", "#ffffaz"))
  tr.notOk("a { something: #000, #fff, #12345AA; }", messages.expected("#12345AA", "#12345aa"))
})

testRule("upper", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #FFF, #ABABAB; }")
  tr.ok("a { color: #0000FFCC; }", "eight digits")
  tr.ok("a { color: #00FC; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")
  tr.ok("a { color: white /* #fff */; }")

  tr.notOk("a { color: #aBABA; }", messages.expected("#aBABA", "#ABABA"))
  tr.notOk("a { something: #000f, #FFF, #ABABAB; }", messages.expected("#000f", "#000F"))
  tr.notOk("a { something: #000, #ffffaz, #ABABAB; }", messages.expected("#ffffaz", "#FFFFAZ"))
  tr.notOk("a { something: #000, #FFF, #12345aa; }", messages.expected("#12345aa", "#12345AA"))
})
