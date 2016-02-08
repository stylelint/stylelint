import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule({
  // regular string
  "text-transform": ["uppercase"],
  // regexes
  "transform": [ "/scale3d/", "/rotate3d/", "/translate3d/" ],
  // mixed string and regex
  "color": [ "red", "green", "blue", "/^sea/" ],
}, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: lightgreen; }")
  tr.ok("a { text-transform: lowercase; }")
  tr.ok("a { transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translate(12px, 50%); }")

  tr.ok("a { color: /* red */ pink; }", "ignore value within comments")
  tr.ok("a::before { color: \"red\"}", "ignore value within quotes")

  tr.ok("a { color: $red; }", "ignore preprocessor variable includes value")
  tr.ok("a { color: --some-red; }", "ignore css variable includes value")

  tr.notOk("a { color: red; }", {
    message: messages.rejected("color", "red"),
    line: 1,
    column: 5,
  })

  tr.notOk("a { color: green }", {
    message: messages.rejected("color", "green"),
    line: 1,
    column: 5,
  })

  tr.notOk("a { text-transform: uppercase; }", {
    message: messages.rejected("text-transform", "uppercase"),
    line: 1,
    column: 5,
  })

  tr.notOk("a { transform: scale3d(1, 2, 3) }", {
    message: messages.rejected("transform", "scale3d(1, 2, 3)"),
    line: 1,
    column: 5,
  })

  tr.notOk("a { -webkit-transform: scale3d(1, 2, 3) }", {
    message: messages.rejected("-webkit-transform", "scale3d(1, 2, 3)"),
    column: 5,
  })

  tr.ok("a { color: darkseagreen }", {
    message: messages.rejected("color", "darkseagreen"),
    column: 5,
  })
  tr.notOk("a { color: seagreen }", {
    message: messages.rejected("color", "seagreen"),
    column: 5,
  })

})
