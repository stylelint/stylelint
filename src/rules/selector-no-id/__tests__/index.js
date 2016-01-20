import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.notOk("#foo {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".bar > #foo {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("#foo.bar {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".foo, .bar, #foo.baz {}", {
    message: messages.rejected,
    line: 1,
    column: 13,
  })
})

const scssTestRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

scssTestRule(undefined, tr => {
  tr.ok("@for $n from 1 through 10 { .n-#{$n} { content: \"n: #{1 + 1}\"; } }", "ignore sass interpolation inside @for")
  tr.ok("@for $n from 1 through 10 { .n#{$n}-#{$n} { content: \"n: #{1 + 1}\"; } }", "ignore multiple sass interpolations in a selector inside @for")
  tr.ok("@for $n from 1 through 10 { .n#{$n}n#{$n} { content: \"n: #{1 + 1}\"; } }", "ignore multiple sass interpolations in a selector inside @for")
  tr.ok("@each $n in $vals { .n-#{$n} { content: \"n: #{1 + 1}\"; } }", "ignore sass interpolation inside @each")
  tr.ok("@while $n < 10 { .n-#{$n} { content: \"n: #{1 + 1}\"; } }", "ignore sass interpolation inside @while")

  tr.notOk("@for $n from 1 through 10 { .n-#{$n} #foo { } }", {
    message: messages.rejected,
    line: 1,
    column: 38,
  }, "report sass interpolation + id inside @for")
  tr.notOk("@for $n from 1 through 10 { .n#{$n}-#{$n} #foo { } }", {
    message: messages.rejected,
    line: 1,
    column: 43,
  }, "report sass interpolation + id inside @for")
})
