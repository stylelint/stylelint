import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("0,3,0", tr => {
  warningFreeBasics(tr)
  tr.ok(".ab {}")
  tr.ok(".ab .cd {}")
  tr.ok(".ab .cd span {}")
  tr.ok(".cd div span {}")
  tr.ok(".cd .de div span a {}")
  tr.ok(".cd .de div span a > b {}")
  tr.ok(".cd .de, .cd .ef > b {}")

  tr.notOk("#jubjub {}", {
    message: messages.expected("#jubjub", "0,3,0"),
    line: 1,
    column: 1,
  })
  tr.notOk(".thing div .thing .sausages {}", {
    message: messages.expected(".thing div .thing .sausages", "0,3,0"),
    line: 1,
    column: 1,
  })
  tr.notOk(".thing div .thing, .sausages .burgers .bacon a {}", {
    message: messages.expected(".sausages .burgers .bacon a", "0,3,0"),
    line: 1,
    column: 20,
  })
})

testRule("0,2,1", tr => {
  warningFreeBasics(tr)
  tr.ok(".cd .de,\n.cd .ef > b {}")
  tr.notOk(".thing div .thing,\n.sausages .burgers .bacon a {}", {
    message: messages.expected(".sausages .burgers .bacon a", "0,2,1"),
    line: 2,
    column: 1,
  })
})

// With nesting
testRule("0,2,1", tr => {
  warningFreeBasics(tr)

  tr.ok(".cd { .de {} }", "standard nesting")
  tr.ok("div:hover { .de {} }", "element, pseudo-class, nested class")
  tr.ok(".ab, .cd { & > .de {} }", "initial (unnecessary) parent selector")
  tr.ok(".cd { .de > & {} }", "necessary parent selector")
  tr.ok(".cd { @media print { .de {} } }", "nested rule within nested media query")
  tr.ok("@media print { .cd { .de {} } }", "media query > rule > rule")

  tr.notOk(".cd { .de { .fg {} } }", messages.expected(".cd .de .fg", "0,2,1"))
  tr.notOk(".cd { .de { & > .fg {} } }", messages.expected(".cd .de > .fg", "0,2,1"))
  tr.notOk(".cd { .de { &:hover > .fg {} } }", messages.expected(".cd .de:hover > .fg", "0,2,1"))
  tr.notOk(".cd { .de { .fg > & {} } }", messages.expected(".fg > .cd .de", "0,2,1"))
  tr.notOk(".cd { @media print { .de { & + .fg {} } } }", messages.expected(".cd .de + .fg", "0,2,1"))
  tr.notOk("@media print { li { & + .ab, .ef.ef { .cd {} } } }", messages.expected("li .ef.ef .cd", "0,2,1"))
})
