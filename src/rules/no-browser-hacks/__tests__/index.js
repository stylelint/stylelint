import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// These are just enough to ensure that the integration with stylehacks
// is working as expected: but that tool has its own tests.
// The tests below are mostly copied from stylehacks.

testRule(true, tr => {
  warningFreeBasics(tr)

  tr.notOk("h1 { _color: red }", {
    message: messages.rejected("property", "_color"),
    line: 1,
    column: 6,
  }, "ie 6 underscore hack")
  tr.notOk("div {} h1 { color: red !ie }", {
    message: messages.rejected("!important", "!ie"),
    line: 1,
    column: 13,
  }, "ie 5.5-7 important hack")
  tr.notOk("@media screen\\9 { h1 { color: red } }", {
    message: messages.rejected("media query", "screen\\9"),
    line: 1,
    column: 1,
  }, "ie 7 media screen\\9 hack")
  tr.notOk("html ~ /**/ body h1 { color: red }", {
    message: messages.rejected("selector", "html ~ /**/ body h1"),
    line: 1,
    column: 1,
  }, "html combinator comment body hack")
})

testRule(true, { browsers: [ "last 2 versions", "ie >= 5" ] }, tr => {
  warningFreeBasics(tr)

  tr.ok("h1 { _color: red }", "ie 6 underscore hack")
  tr.ok("div {} h1 { color: red !ie }", "ie 5.5-7 important hack")
  tr.ok("@media screen\\9 { h1 { color: red } }", "ie 7 media screen\\9 hack")
  tr.ok("html ~ /**/ body h1 { color: red }", "html combinator comment body hack")
})
