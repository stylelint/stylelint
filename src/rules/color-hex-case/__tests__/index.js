import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

function sharedTests(tr) {
  warningFreeBasics(tr)

  tr.ok("a { border-#$side: 0; }", "ignore sass-like interpolation")
  tr.ok("a { box-sizing: #$type-box; }", "ignore sass-like interpolation")
}

testRule("lower", tr => {
  sharedTests(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #fff, #ababab; }")
  tr.ok("a { color: #0000ffcc; }", "eight digits")
  tr.ok("a { color: #00fc; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ABABA\"; }")
  tr.ok("a { color: white /* #FFF */; }")

  tr.notOk("a { color: #Ababa; }", {
    message: messages.expected("#Ababa", "#ababa"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #000F, #fff, #ababab; }", {
    message: messages.expected("#000F", "#000f"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { something: #000, #FFFFAZ, #ababab; }", {
    message: messages.expected("#FFFFAZ", "#ffffaz"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { something: #000, #fff, #12345AA; }", {
    message: messages.expected("#12345AA", "#12345aa"),
    line: 1,
    column: 28,
  })
})

testRule("upper", tr => {
  sharedTests(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: #000; }")
  tr.ok("a { something: #000, #FFF, #ABABAB; }")
  tr.ok("a { color: #0000FFCC; }", "eight digits")
  tr.ok("a { color: #00FC; }", "four digits")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")
  tr.ok("a { color: white /* #fff */; }")

  tr.notOk("a { color: #aBABA; }", {
    message: messages.expected("#aBABA", "#ABABA"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #000f, #FFF, #ABABAB; }", {
    message: messages.expected("#000f", "#000F"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { something: #000, #ffffaz, #ABABAB; }", {
    message: messages.expected("#ffffaz", "#FFFFAZ"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { something: #000, #FFF, #12345aa; }", {
    message: messages.expected("#12345aa", "#12345AA"),
    line: 1,
    column: 28,
  })
})
