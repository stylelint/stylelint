import {
  mergeTestDescriptions,
  testRule,
} from "../../../testUtils"
import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"

const rule = rules[ruleName]

const sharedTests = {
  accept: [ {
    code: "a { top: 1px; }",
    description: "rule ignored",
  }, {
    code: "a { --foo: 1px; }",
    description: "single-line declaration block with single custom prop",
  }, {
    code: "a { --foo: 1px; --bar: 1px; }",
    description: "single-line declaration block with two custom props",
  }, {
    code: "a {\n  --foo: 1px;\n}",
  }, {
    code: "a {\n  --foo: 1px;\n  --bar: 2px;\n}",
  }, {
    code: "a {\r\n  --foo: 1px;\r\n  --bar: 2px;\r\n}",
  } ],

  reject: [ {
    code: "a {\n  --foo: 1px;\n\n  --bar: 2px;\n}",
    message: messages.rejected,
  }, {
    code: "a {\r\n  --foo: 1px;\r\n\r\n  --bar: 2px;\r\n}",
    message: messages.rejected,
  } ],
}

testRule(rule, mergeTestDescriptions(sharedTests, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a {\n  top: 1px;\n  --foo: 1px;\n}",
  }, {
    code: "a {\r\n  top: 1px;\r\n  --foo: 1px;\r\n}",
  } ],

  reject: [ {
    code: "a {\n  top: 1px;\n\n  --foo: 1px;\n}",
    message: messages.rejected,
  }, {
    code: "a {\r\n  top: 1px;\r\n\r\n  --foo: 1px;\r\n}",
    message: messages.rejected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedTests, {
  ruleName,
  config: [ true, { except: ["first-after-non-custom-property-sibling"] } ],

  accept: [ {
    code: "a {\n  top: 1px;\n\n  --foo: 1px;\n}",
  }, {
    code: "a {\r\n  top: 1px;\r\n\r\n  --foo: 1px;\r\n}",
  } ],

  reject: [ {
    code: "a {\n  top: 1px;\n  --foo: 1px;\n}",
    message: messages.expected,
  }, {
    code: "a {\r\n  top: 1px;\r\n  --foo: 1px;\r\n}",
    message: messages.expected,
  } ],
}))
