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

testRule("short", tr => {
  sharedTests(tr)

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

  tr.notOk("a { color: #FFFFFF; }", {
    message: messages.expected("#FFFFFF", "#FFF"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: #FfaAFF; }", {
    message: messages.expected("#FfaAFF", "#FaF"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: #00aa00aa; }", {
    message: messages.expected("#00aa00aa", "#0a0a"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #fff, #aba, #00ffAAaa; }", {
    message: messages.expected("#00ffAAaa", "#0fAa"),
    line: 1,
    column: 28,
  })
})

testRule("long", tr => {
  sharedTests(tr)

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

  tr.notOk("a { color: #FFF; }", {
    message: messages.expected("#FFF", "#FFFFFF"),
    line: 1,
    clumn: 12,
  })
  tr.notOk("a { color: #Ffa; }", {
    message: messages.expected("#Ffa", "#FFffaa"),
    line: 1,
    clumn: 12,
  })
  tr.notOk("a { color: #0a0a; }", {
    message: messages.expected("#0a0a", "#00aa00aa"),
    line: 1,
    clumn: 12,
  })
  tr.notOk("a { something: #ffffff, #aabbaa, #0fAa; }", {
    message: messages.expected("#0fAa", "#00ffAAaa"),
    line: 1,
    clumn: 34,
  })
})
