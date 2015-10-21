import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: rgba(0, 0, 0, 0); }")
  tr.ok("a { something: black, white, gray; }")

  tr.ok("a { padding: 000; }")
  tr.ok("a::before { content: \"#ababa\"; }")

  tr.ok("a { border-#$side: 0; }", "ignore sass-like interpolation")
  tr.ok("a { box-sizing: #$type-box; }", "ignore sass-like interpolation")

  tr.notOk("a { color: #12345; }", {
    message: messages.rejected("#12345"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: #123456a; }", {
    message: messages.rejected("#123456a"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: #cccccc; }", {
    message: messages.rejected("#cccccc"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { something: #00c, red, white; }", {
    message: messages.rejected("#00c"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { something: black, #fff1a1, rgb(250, 250, 0); }", {
    message: messages.rejected("#fff1a1"),
    line: 1,
    column: 23,
  })

  // No supplementary spaces after colon or comma
  tr.notOk("a { something:black,white,#12345a; }", {
    message: messages.rejected("#12345a"),
    line: 1,
    column: 27,
  })

  // 4 digits
  tr.notOk("a { color: #ffff; }", {
    message: messages.rejected("#ffff"),
    line: 1,
    column: 12,
  })

  // 8 digits
  tr.notOk("a { color: #ffffffaa; }", {
    message: messages.rejected("#ffffffaa"),
    line: 1,
    column: 12,
  })

  tr.ok("@font-face {\n" +
    "font-family: dashicons;\n" +
    "src: url(data:application/font-woff;charset=utf-8;base64, ABCDEF==) format(\"woff\"),\n" +
        "url(../fonts/dashicons.ttf) format(\"truetype\"),\n" +
        "url(../fonts/dashicons.svg#dashicons) format(\"svg\");\n" +
    "font-weight: normal;\n" +
    "font-style: normal;\n" +
  "}")
})
