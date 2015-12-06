import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "transform",
  "font-smoothing",
  "top",
  "transition",
  "border",
  "color",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; color: red; }")
  tr.ok("a { top: 0; color: pink; }")
  tr.ok("a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }")
  tr.ok("a { -webkit-font-smoothing: antialiased; top: 0; color: pink; }")
  tr.ok("a { top: 0; color: pink; width: 0; }")
  tr.ok("a { top: 0; color: pink; width: 0; height: 0; }")

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

  // Longhand properties accounted for when shorthand is included
  tr.ok("a { border: 1px solid; color: pink; }")
  tr.ok("a { border-top: 1px solid; color: pink; }")
  tr.ok("a { border-left: 1px solid; color: pink; }")
  // Post-hyphen string doesn't affect order by default
  tr.ok("a { border-left: 1px solid; border-right: 0; color: pink; }")
  tr.ok("a { border-right: 1px solid; border-left: 0; color: pink; }")
  tr.notOk("a { color: pink; border: 1px solid; }", messages.expected("border", "color"))
  tr.notOk("a { color: pink; border-top: 1px solid; }", messages.expected("border-top", "color"))
  tr.notOk("a { color: pink; border-bottom: 1px solid; }", messages.expected("border-bottom", "color"))
  tr.notOk("a { border-right: 0; color: pink; border-bottom: 1px solid; }", messages.expected("border-bottom", "color"))

  tr.ok("a { transition: none; border: 1px solid; }")
  tr.ok("a { transition-name: 'foo'; border-top: 1px solid; }")
  tr.notOk("a { border-top: 1px solid; transition-name: 'foo'; }",
    messages.expected("transition-name", "border-top"))

  // Position of unspecified `display` is arbitrary
  tr.ok("a { top: 0; color: pink; width: 0; height: 0; display: none; }")
  tr.ok("a { top: 0; color: pink; display: none; width: 0; height: 0; }")
  tr.ok("a { display: none; top: 0; color: pink; width: 0; height: 0; }")
})

// Longhand properties with specified order
testRule([
  "padding",
  "padding-top",
  "padding-right",
  "padding-left",
  "border",
  "border-top",
  "border-right",
  "color",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { padding: 1px; color: pink; }")
  tr.ok("a { padding-top: 1px; color: pink; }")
  tr.ok("a { padding-left: 1px; color: pink; }")
  tr.ok("a { padding-top: 1px; padding-right: 0; color: pink; }")
  // `padding-bottom` was not specified, so it will be expected where `padding` was expected
  tr.ok("a { padding-bottom: 0; padding-top: 1px; padding-right: 0; padding-left: 0; color: pink; }")
  tr.ok("a { padding: 1px; padding-bottom: 0; padding-left: 0; color: pink; }")
  tr.ok("a { border: 1px solid #fff; border-right: 2px solid #fff; border-right-color: #000; }")
  tr.ok("a { border: 1px solid #fff; border-top: none; border-right-color: #000; }")

  tr.notOk("a { color: pink; padding: 1px; }", messages.expected("padding", "color"))
  tr.notOk("a { color: pink; padding-top: 1px; }", messages.expected("padding-top", "color"))
  tr.notOk("a { padding-right: 1px; padding-top: 0; color: pink;  }",
    messages.expected("padding-top", "padding-right"))
})

// Forcing unspecified properties to the top
testRule([
  "height",
  "color",
], { unspecified: "top" }, tr => {
  warningFreeBasics(tr)

  tr.ok("a { top: 0; height: 1px; color: pink; }")
  tr.ok("a { bottom: 0; top: 0; }")
  tr.notOk("a { height: 1px; top: 0; }", messages.expected("top", "height"))
  tr.notOk("a { color: 1px; top: 0; }", messages.expected("top", "color"))
})

// Forcing unspecified properties to the bottom
testRule([
  "height",
  "color",
], { unspecified: "bottom" }, tr => {
  warningFreeBasics(tr)

  tr.ok("a { height: 1px; color: pink; bottom: 0; }")
  tr.ok("a { bottom: 0; top: 0; }")
  tr.notOk("a { bottom: 0; height: 1px; }", messages.expected("height", "bottom"))
  tr.notOk("a { bottom: 0; color: 1px; }", messages.expected("color", "bottom"))
})
