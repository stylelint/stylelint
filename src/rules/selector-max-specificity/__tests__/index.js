import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(30, tr => {
  warningFreeBasics(tr)

  tr.ok(".ab {}")
  tr.ok(".ab .cd {}")
  tr.ok(".ab .cd span {}")
  tr.ok(".cd div span {}")
  tr.ok(".cd .de div span a {}")
  tr.ok(".cd .de div span a > b {}")
  tr.ok(".cd .de, .cd .ef > b {}")

  tr.notOk("#jubjub {}", {
    message: messages.expected("#jubjub", 30),
    line: 1,
    column: 1,
  })
  tr.notOk(".thing div .thing .sausages {}", {
    message: messages.expected(".thing div .thing .sausages", 30),
    line: 1,
    column: 1,
  })
  tr.notOk(".thing div .thing, .sausages .burgers .bacon a {}", {
    message: messages.expected(".sausages .burgers .bacon a", 30),
    line: 1,
    column: 20,
  })
})