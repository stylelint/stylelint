import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("alphabetical", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; color: red; }")
  tr.ok("a { color: pink; color: red; } b { color: pink; color: red; }")
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a { border: 1px solid pink; border-left-width: 0; }")
  tr.ok("a { color: pink; top: 0; transform: scale(1); }")
  tr.ok("a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }")
  tr.ok("a { color: pink; -webkit-font-smoothing: antialiased; top: 0; }")
  tr.ok("a {{ &:hover { color: red; top: 0; } } }")
  tr.ok("a { top: 0; { &:hover { color: red; } } }")
  tr.ok("a { top: 0; &:hover { color: red; } }")
  tr.ok("a { color: red; width: 0; { &:hover { color: red; top: 0; } } }")
  tr.ok("a { color: red; width: 0; &:hover { color: red; top: 0; } }")
  tr.ok("a { color: red; width: 0; @media print { color: red; top: 0; } }")
  tr.ok("a { $scss: 0; $a: 0; }")
  tr.ok("a { @less: 0; @a: 0; }")

  tr.notOk("a { top: 0; color: pink; }",
    messages.expected("color", "top"))
  tr.notOk("a { top: 0; color: pink; } b { color: pink; top: 0; }",
    messages.expected("color", "top"))
  tr.notOk("a { color: pink; transform: scale(1); top: 0; }",
    messages.expected("top", "transform"))
  tr.notOk("a { color: pink; top: 0; -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }",
    messages.expected("-webkit-transform", "transform"))
  tr.notOk("a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }",
    messages.expected("-moz-transform", "-webkit-transform"))
  tr.notOk("a { -webkit-font-smoothing: antialiased; color: pink;  top: 0; }",
    messages.expected("color", "-webkit-font-smoothing"))
  tr.notOk("a { width: 0; { &:hover { top: 0; color: red; } } }",
    messages.expected("color", "top"))
  tr.notOk("a {{ &:hover { top: 0; color: red; } } }",
    messages.expected("color", "top"))
  tr.notOk("a { width: 0; &:hover { top: 0; color: red; } }",
    messages.expected("color", "top"))
  tr.notOk("a { width: 0; @media print { top: 0; color: red; } }",
    messages.expected("color", "top"))
  tr.notOk("@media print { top: 0; color: red; }",
    messages.expected("color", "top"))
})
