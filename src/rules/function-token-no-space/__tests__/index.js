import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"var (--a) var\n(--a)\"; }")
  tr.ok("a::before { background: url('var (--hoot) color (blue)'); }")
  tr.ok("a::before { content: attr(data-foo); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { color: color(rgb(0, 0, 0) lightness(50%)) }")

  tr.notOk("a { transform: translate (1, 1); }", messages.rejected)
  tr.notOk("a::before { content: attr (data-foo); }", messages.rejected)
  tr.notOk("a { transform: translate  (1, 1); }", messages.rejected)
  tr.notOk("a { transform: translate\n(1, 1); }", messages.rejected)
  tr.notOk("a { transform: translate\t(1, 1); }", messages.rejected)
  tr.notOk("a { color: color (rgb(0, 0, 0) lightness(50%)); }", messages.rejected)
  tr.notOk("a { color: color(rgb (0, 0, 0) lightness(50%)); }", messages.rejected)
  tr.notOk("a { color: color(rgb(0, 0, 0) lightness (50%)); }", messages.rejected)
})
