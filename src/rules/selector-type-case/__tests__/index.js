import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("lower", tr => {
    
  tr.ok("a { display: inline-block; }")
  tr.ok("div { display: inline-block; }")
  tr.ok("body { display: inline-block; }")
  tr.ok("li { display: inline-block; }")

  tr.ok("a::before { content: \"some content\"; }")
  tr.ok("div::before { display: inline-block; }")
  tr.ok("body::before { display: inline-block; }")
  tr.ok("li::before { display: inline-block; }")

  tr.ok("&a { display: inline-block; }")
  tr.ok("&li { display: inline-block; }")

  tr.ok(".foo { display: inline-block; }")
  tr.ok("#bar { display: inline-block; }")

  tr.ok(".FOO { display: inline-block; }")
  tr.ok("#BAR { display: inline-block; }")

  tr.notOk("A { color: #Ababa; }", {
    message: messages.expected("A", "a"),
  })
  tr.notOk("DIV { display: inline-block; }", {
    message: messages.expected("DIV", "div"),
  })
  tr.notOk("BODY { display: inline-block; }", {
    message: messages.expected("BODY", "body"),
  })
  tr.notOk("LI { display: inline-block; }", {
    message: messages.expected("LI", "li"),
  })
})

testRule("upper", tr => {

  tr.ok("A { display: inline-block; }")
  tr.ok("DIV { display: inline-block; }")
  tr.ok("BODY { display: inline-block; }")
  tr.ok("LI { display: inline-block; }")

  tr.ok("A::before { content: \"some content\"; }")
  tr.ok("DIV::before { display: inline-block; }")
  tr.ok("BODY::before { display: inline-block; }")
  tr.ok("LI::before { display: inline-block; }")

  tr.ok("&A { display: inline-block; }")
  tr.ok("&LI { display: inline-block; }")

  tr.ok(".foo { display: inline-block; }")
  tr.ok("#bar { display: inline-block; }")

  tr.ok(".FOO { display: inline-block; }")
  tr.ok("#BAR { display: inline-block; }")

  tr.notOk("a { color: #Ababa; }", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("div { display: inline-block; }", {
    message: messages.expected("div", "DIV"),
  })
  tr.notOk("body { display: inline-block; }", {
    message: messages.expected("body", "BODY"),
  })
  tr.notOk("li { display: inline-block; }", {
    message: messages.expected("li", "LI"),
  })
})
