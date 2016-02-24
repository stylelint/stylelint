import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(true, tr => {
  // Stand-in warning-free-basics
  tr.ok("")
  tr.ok("@import \"foo.css\";")

  tr.ok("#foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.ok(".foo { & {} }")
  tr.ok(".foo { &.bar {} }")
  tr.ok(".foo { [&] {} }")
  tr.ok(".foo { & [class*=bar] {} }")
  tr.ok(".foo { @nest & {} }")
  tr.ok(".foo:nth-child(3n + 1) {}")
  tr.ok(".foo:nth-child(n) {}")
  tr.ok(".foo:nth-child(odd) {}")
  tr.ok(".foo:nth-child(even) {}")
  tr.ok(".foo:nth-child(-n) {}")
  tr.ok(".foo { &:nth-child(3n + 1) {} }")
  tr.ok("@keyframes spin { 0% {} }")
  tr.ok("@keyframes spin { to {} from {} }")
  tr.ok(":root { --custom-property-set: {} }")

  tr.notOk("foo {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".bar > foo {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("foo.bar {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".foo, .bar, foo.baz {}", {
    message: messages.rejected,
    line: 1,
    column: 13,
  })
})

testRule(true, { ignore: ["descendant"] }, tr => {
  tr.ok(".foo div {}")
  tr.ok(".foo > div {}")
  tr.ok(".foo + div {}")
  tr.ok("#bar div.foo {}", "descendant and compounded")

  tr.notOk("div {}", messages.rejected)
  tr.notOk(".foo, div {}", messages.rejected)
  tr.notOk("div.foo {}", messages.rejected)
})

testRule(true, { ignore: ["compounded"] }, tr => {
  tr.ok("div.foo {}")
  tr.ok("div#foo {}")
  tr.ok("div[something] {}")

  tr.notOk("div {}", messages.rejected)
  tr.notOk(".foo, div {}", messages.rejected)
  tr.notOk(".foo div {}", messages.rejected)
  tr.notOk("#bar div.foo {}", messages.rejected, "compounded and descendant")
})
