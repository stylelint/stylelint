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
  tr.ok(":root { --custom-property-set: {} }")

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

function nestedAZTestsDefault(tr) {
  warningFreeBasics(tr)

  tr.ok(".AB { }")

  tr.ok(".A { &__B { }}")
}

testRule(/^[A-Z]+$/, nestedAZTestsDefault)
testRule("^[A-Z]+$", nestedAZTestsDefault)

function nestedAZTests(tr) {
  warningFreeBasics(tr)

  tr.ok(".AB { }")

  tr.ok(".A { &B {}}")

  tr.ok(".A { &B {}, .C {}, &D {} }")

  tr.ok(".A, .B { &C {} &D, &E {} }")

  tr.notOk(".A { &__B { }}", {
    message: messages.expected("A__B"),
    line: 0,
    column: 6,
  })
}

testRule(/^[A-Z]+$/, { resolveNestedSelectors: true }, nestedAZTests)
testRule("^[A-Z]+$", { resolveNestedSelectors: true }, nestedAZTests)

// When a selector like ".A { .B { } }" is used
// The checking will go like this :
//
// 1. Start with ".A" and check it
// 1. Go to ".B"
// 1. resolve nested selectors and get ".A .B"
//   1. separate ".A" and ".B"
//   1. check ".A"
//   1. check ".B"
//
// thus checking ".A" twice, and if ".A" fails, we will get
// two warnings, this test ensures it is not the case.
function nestedDoubleCheckTest(tr) {
  tr.notOk(".A { .B { } }", {
    message: messages.expected("A"),
    line:0,
    column:0,
  })
}

testRule(/^B+$/, { resolveNestedSelectors: true }, nestedDoubleCheckTest)
