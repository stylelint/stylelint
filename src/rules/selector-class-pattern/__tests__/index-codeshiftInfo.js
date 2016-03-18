// Original file:
import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

function basicAZTests(tr) {
  warningFreeBasics(tr)

  tr.ok("a {}")
  tr.ok("#foo {}")
  tr.ok("[foo='bar'] {}")
  tr.ok(".FOO {}")
  tr.ok("a #foo > [foo='bar'], .FOO {}")
  tr.ok("a /* .foo */ {}")

  tr.notOk("a .foo {}", {
    message: messages.expected("foo"),
    line: 1,
    column: 3,
  })
  tr.notOk(".ABABA > .bar {}", {
    message: messages.expected("bar"),
    line: 1,
    column: 10,
  })
}

testRule(/^[A-Z]+$/, basicAZTests)
testRule("^[A-Z]+$", basicAZTests)


// Schematization of "basicAZTests":
const schematizedBasicAZTests = {
  accept: [{
    code: "a {}",
  }, {
    code: "#foo {}",
  }, {
    code: "[foo='bar'] {}",
  }, {
    code: ".FOO {}",
  }, {
    code: "a #foo > [foo='bar'], .FOO {}",
  }, {
    code: "a /* .foo */ {}",
  }],

  reject: [{
    code: "a .foo {}",
    message: messages.expected("foo"),
    line: 1,
    column: 3,
  }, {
    code: ".ABABA > .bar {}",
    message: messages.expected("bar"),
    line: 1,
    column: 10,
  }],
}