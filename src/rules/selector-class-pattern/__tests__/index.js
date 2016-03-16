/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import { mergeTestDescriptions } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const basicAZTests = {
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
  }, {
    code: ":root { --custom-property-set: {} }",
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

const nestedAZTestsDefault = {
  accept: [{
    code: ".AB { }",
  }, {
    code: ".A { &__B { }}",
  }],
}

const nestedAZTests = {
  accept: [{
    code: ".AB { }",
  }, {
    code: ".A { &B {}}",
  }, {
    code: ".A { & > B {}}",
  }, {
    code: ".A { &B {}, .C {}, &D {} }",
  }, {
    code: ".A, .B { &C {} &D, &E {} }",
  }],

  reject: [{
    code: ".A { &__B { }}",
    message: messages.expected("A__B"),
    line: 0,
    column: 6,
  }],
}

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName,
  config: [/^[A-Z]+$/],
}))

testRule(rule, mergeTestDescriptions(basicAZTests, {
  ruleName,
  config: ["^[A-Z]+$"],
}))

testRule(rule, mergeTestDescriptions(nestedAZTestsDefault, {
  ruleName,
  config: [/^[A-Z]+$/],
}))

testRule(rule, mergeTestDescriptions(nestedAZTestsDefault, {
  ruleName,
  config: ["^[A-Z]+$"],
}))

testRule(rule, mergeTestDescriptions(nestedAZTests, {
  ruleName,
  config: [/^[A-Z]+$/, { resolveNestedSelectors: true }],
}))

testRule(rule, mergeTestDescriptions(nestedAZTests, {
  ruleName,
  config: ["^[A-Z]+$", { resolveNestedSelectors: true }],
}))

testRule(rule, {
  ruleName,
  config: [/^B+$/, { resolveNestedSelectors: true }],

  reject: [{
    code: ".A { .B { } }",
    message: messages.expected("A"),
  }, {
    code: ".A { & .B { } }",
    message: messages.expected("A"),
  }, {
    code: ".A { &>.B { } }",
    message: messages.expected("A"),
  }],
})
