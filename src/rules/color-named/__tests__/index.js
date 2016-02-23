import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: #000; }")
  tr.ok("a { color: #ababab; }")
  tr.ok("a { color: rgba(0, 0, 0, 0); }")
  tr.ok("a { something: #000, #fff, #333; }")

  tr.ok("/** color: black; */", "ignore color names within comments")

  tr.ok("a::before { content: \"orange\" }", "ignore color names within doubl quotes")
  tr.ok("a::before { content: 'orange' }", "ignore color names within single quotes")

  tr.ok("a { background-image: url(./black.png); }", "ignore color names within urls")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")

  tr.ok("a { color: $black; }", "ignore sass variable named with color")

  tr.ok("a { color: var(--some-color-blue); }", "ignore css variable named with color")

  tr.ok("a { animation: spin-blue 2s linear; }", "ignore keyframe animation name that includes colors")

  tr.notOk("a { color: red; }", {
    message: messages.rejected("red"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: rebeccapurple; }", {
    message: messages.rejected("rebeccapurple"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #00c, red, #fff; }", {
    message: messages.rejected("red"),
    line: 1,
    column: 22,
  })
  tr.notOk("a { something: #fff1a1, rgb(250, 250, 0), black; }", {
    message: messages.rejected("black"),
    line: 1,
    column: 43,
  })

  // No supplementary spaces after colon or comma
  tr.notOk("a { something:#cccccc,white,#12345a; }", {
    message: messages.rejected("white"),
    line: 1,
    column: 23,
  })
})

testRule("always-where-possible", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: black; }")
  tr.ok("a { color: rgb(0,0,1); }")
  tr.ok("a { color: rgba(0,0,0,0.5); }")
  tr.ok("a { color: rgb(0,0,0,50%); }")

  tr.ok("a { color: color(black, a(50%)) }")
  tr.ok("a { color: rgb(0, calc(0 + 0), 0, 0) }")

  tr.ok("/** color: #000; */", "ignore representations within comments")
  tr.ok("a::before { content: \"#000\" }", "ignore representations within doubl quotes")
  tr.ok("a::before { content: '#000' }", "ignore representations within single quotes")
  tr.ok("a { background-image: url(./thing.png#000); }", "ignore representations within urls")

  tr.notOk("a { color: #000 }", {
    message: messages.expected("black", "#000"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { background: #f000 }", {
    message: messages.expected("black", "#f000"),
    line: 1,
    column: 17,
  })

  tr.notOk("a { color: #ff000000 }", {
    message: messages.expected("black", "#ff000000"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgb(0, 0, 0) }", {
    message: messages.expected("black", "rgb(0,0,0)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgba(0, 0, 0, 1) }", {
    message: messages.expected("black", "rgba(0,0,0,1)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgba(0, 0, 0, 100%) }", {
    message: messages.expected("black", "rgba(0,0,0,100%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgb(0%,0%, 0%) }", {
    message: messages.expected("black", "rgb(0%,0%,0%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgba(0%,0%, 0%  ,1) }", {
    message: messages.expected("black", "rgba(0%,0%,0%,1)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgba(0%,0%, 0%\n,100%) }", {
    message: messages.expected("black", "rgba(0%,0%,0%,100%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hsl(0,0%, 0%) }", {
    message: messages.expected("black", "hsl(0,0%,0%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hsla(0,0%, 0%  ,1) }", {
    message: messages.expected("black", "hsla(0,0%,0%,1)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hsla(0,0%, 0%\n,100%) }", {
    message: messages.expected("black", "hsla(0,0%,0%,100%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hwb(0,0%, 0%) }", {
    message: messages.expected("red", "hwb(0,0%,0%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hwb(0,0%, 0%  ,1) }", {
    message: messages.expected("red", "hwb(0,0%,0%,1)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: hwb(0,0%, 0%\n,100%) }", {
    message: messages.expected("red", "hwb(0,0%,0%,100%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: gray(0) }", {
    message: messages.expected("black", "gray(0)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: gray(0%) }", {
    message: messages.expected("black", "gray(0%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: gray(0, 1) }", {
    message: messages.expected("black", "gray(0,1)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: gray(0, 100%) }", {
    message: messages.expected("black", "gray(0,100%)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { color: rgb(\n0 ,\n 0 ,\r\n 0) }", {
    message: messages.expected("black", "rgb(0,0,0)"),
    line: 1,
    column: 12,
  })

  tr.notOk("a { something: #302, rgb(\n0 ,\n 0 ,\r\n 0) }", {
    message: messages.expected("black", "rgb(0,0,0)"),
    line: 1,
    column: 22,
  })

})
