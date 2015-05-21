import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"var(--hoot)color(blue)\"; }")
  tr.ok("a::before { background: url('var(--hoot)color(blue)'); }")
  tr.ok("a::before { content: attr(data-foo); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1, 1) }")
  tr.ok("a { transform: translate(1, 1)}")
  tr.ok("a { transform: translate(1, 1) scale(3); }")
  tr.ok("a { color: color(rgb(0,0,0) lightness(50%)) };")

  tr.notOk("a { transform: translate(1, 1)scale(3); }", messages.expected)
  tr.notOk("a { transform: translate(1, 1)  scale(3); }", messages.expected)
  tr.notOk("a { transform: translate(1, 1)\nscale(3); }", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)lightness(50%)) };", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)  lightness(50%)) };", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)\nlightness(50%)) };", messages.expected)
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"var(--hoot) color(blue)\"; }")
  tr.ok("a::before { background: url('var(--hoot) color(blue)'); }")
  tr.ok("a::before { content: attr(data-foo); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1, 1) }")
  tr.ok("a { transform: translate(1, 1)}")
  tr.ok("a { transform: translate(1, 1)scale(3); }")
  tr.ok("a { color: color(rgb(0,0,0)lightness(50%)) };")

  tr.notOk("a { transform: translate(1, 1) scale(3); }", messages.rejected)
  tr.notOk("a { transform: translate(1, 1)  scale(3); }", messages.rejected)
  tr.notOk("a { transform: translate(1, 1)\nscale(3); }", messages.rejected)
  tr.notOk("a { color: color(rgb(0,0,0) lightness(50%)) };", messages.rejected)
  tr.notOk("a { color: color(rgb(0,0,0)  lightness(50%)) };", messages.rejected)
  tr.notOk("a { color: color(rgb(0,0,0)\nlightness(50%)) };", messages.rejected)
})
