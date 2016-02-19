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

// Some nesting examples
testRule("0,4,1", tr => {
  warningFreeBasics(tr)
  // A pointless nest that includes a parent selector when it isn't needed
  tr.ok(".cd .de {& .fg {}}")
  // A nested combinator test
  tr.notOk(".thing .thing2 {&.nested {#pop {}}}", {
    message: messages.expected(".thing .thing2.nested #pop", "0,4,1"),
    line: 1,
    column: 27,
  })
  // A nested override of the key selector
  tr.notOk(".thing .thing2 {#here & {}}", {
    message: messages.expected("#here .thing .thing2", "0,4,1"),
    line: 1,
    column: 17,
  })
  // A nested override of the key selector which requires the nested selector to exceed the max
  tr.notOk(".thing .thing2 .thing3 .thing4 {a.here & {}}", {
    message: messages.expected("a.here .thing .thing2 .thing3 .thing4", "0,4,1"),
    line: 1,
    column: 33,
  })
})

