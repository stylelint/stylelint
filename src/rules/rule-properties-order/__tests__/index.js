import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("alphabetical", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; color: red; }")
  tr.ok("a { color: pink; color: red; } b { color: pink; color: red; }")
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a { color: pink; top: 0; transform: scale(1); }")
  tr.ok("a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }")
  tr.ok("a { color: pink; -webkit-font-smoothing: antialiased; top: 0; }")

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
})

testRule([
  "transform",
  "font-smoothing",
  "top",
  "color",
], tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; color: red; }")
  tr.ok("a { top: 0; color: pink; }")
  tr.ok("a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }")
  tr.ok("a { -webkit-font-smoothing: antialiased; top: 0; color: pink; }")
  tr.ok("a { top: 0; color: pink; width: 0; }")
  tr.ok("a { top: 0; color: pink; width: 0; height: 0; }")
  tr.ok("a { top: 0; color: pink; width: 0; height: 0; display: none; }")

  tr.notOk("a { color: pink; top: 0;  }",
    messages.expected("top", "color"))
  tr.notOk("a { top: 0; transform: scale(1); color: pink; }",
    messages.expected("transform", "top"))
  tr.notOk("a { -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }",
    messages.expected("-webkit-transform", "transform"))
  tr.notOk("a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }",
    messages.expected("-moz-transform", "-webkit-transform"))
  tr.notOk("a { color: pink; -webkit-font-smoothing: antialiased; }",
    messages.expected("-webkit-font-smoothing", "color"))
  tr.notOk("a { height: 0; color: pink; }",
    messages.expected("color", "height"))
  tr.notOk("a { top: 0; height: 0; color: pink; }",
    messages.expected("color", "height"))
  tr.notOk("a { top: 0; height: 0; color: pink; width: 0 }",
    messages.expected("color", "height"))
})
