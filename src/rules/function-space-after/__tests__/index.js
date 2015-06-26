import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a::before { content: \"var(--hoot)color(blue)\"; }")
  tr.ok("a::before { background: url('var(--hoot)color(blue)'); }")
  tr.ok("a::before { content: attr(data-foo); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1, 1) }")
  tr.ok("a { transform: translate(1, 1)}")
  tr.ok("a { transform: translate(1, 1) scale(3); }")
  tr.ok("a { color: color(rgb(0,0,0) lightness(50%)) };")
  tr.ok("a { background-image: linear-gradient(#f3c, #4ec), linear-gradient(#f3c, #4ec); }",
    "multiple comma-separated functions ")
  tr.ok("a { border-color: color(rgb(0,0,0) lightness(50%)) red pink orange; }",
    "function within a function as one of multiple space-separated values")

  tr.notOk("a { transform: translate(1, 1)scale(3); }", messages.expected)
  tr.notOk("a { transform: translate(1, 1)  scale(3); }", messages.expected)
  tr.notOk("a { transform: translate(1, 1)\nscale(3); }", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)lightness(50%)) };", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)  lightness(50%)) };", messages.expected)
  tr.notOk("a { color: color(rgb(0,0,0)\nlightness(50%)) };", messages.expected)
})

testRule("never", tr => {
  warningFreeBasics(tr)

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
