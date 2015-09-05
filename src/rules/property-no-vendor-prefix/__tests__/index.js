import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(":root { --foo-bar: 1px; }")
  tr.ok("a { color: pink; --webkit-transform: 1px; }")
  tr.ok("a { transform: scale(1); }")
  tr.ok("a { box-sizing: border-box; }")
  tr.ok("a { -webkit-font-smoothing: antialiased; }", "non-standard prefixed property")
  tr.ok("a { -webkit-touch-callout: none; }", "another non-standard prefixed property")

  tr.notOk("a { -webkit-transform: scale(1); }", {
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { -webkit-transform: scale(1); transform: scale(1); }", {
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { transform: scale(1); -webkit-transform: scale(1); }", {
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 26,
  })
  tr.notOk("a { -moz-transition: all 3s; }", {
    message: messages.rejected("-moz-transition"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { -moz-columns: 2; }", {
    message: messages.rejected("-moz-columns"),
    line: 1,
    column: 5,
  })

  tr.notOk("a { -o-columns: 2; }", {
    message: messages.rejected("-o-columns"),
    line: 1,
    column: 5,
  }, "mistaken prefix")

  tr.notOk("a { -ms-interpolation-mode: nearest-neighbor; }", {
    message: messages.rejected("-ms-interpolation-mode"),
    line: 1,
    column: 5,
  }, "\"hack\" prefix")
})
