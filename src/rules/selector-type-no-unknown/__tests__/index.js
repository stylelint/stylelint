import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [ {
    code: "a {}",
  }, {
    code: "input {}",
  }, {
    code: "iNpUt {}",
  }, {
    code: "INPUT {}",
  }, {
    code: "ul li {}",
  }, {
    code: "ul > li {}",
  }, {
    code: "ul + li {}",
  }, {
    code: "ul ~ li {}",
  }, {
    code: "@media only screen and (min-width: 35em) { a {} }",
  }, {
    code: "a.class {}",
  }, {
    code: "a#id {}",
  }, {
    code: "a:hover {}",
  }, {
    code: "a::before {}",
  }, {
    code: "a[target] {}",
  }, {
    code: "circle {}",
    description: "svg tags",
  } ],

  reject: [ {
    code: "unknown {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "uNkNoWn {}",
    message: messages.rejected("uNkNoWn"),
    line: 1,
    column: 1,
  }, {
    code: "UNKNOWN {}",
    message: messages.rejected("UNKNOWN"),
    line: 1,
    column: 1,
  }, {
    code: "ul unknown {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 4,
  }, {
    code: "unknown[target] {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "unknown:nth-child(even) {}",
    message: messages.rejected("unknown"),
    line: 1,
    column: 1,
  }, {
    code: "@media only screen and (min-width: 35em) { unknown {} }",
    message: messages.rejected("unknown"),
    line: 1,
    column: 44,
  } ],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [ {
    code: ".foo { &-bar {} }",
  }, {
    code: "#{$variable} {}",
  }, {
    code: "%foo {}",
    description: "ignore placeholder selector",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreTypes: ["unknown"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "unknown {}",
  }, {
    code: "uNkNoWn {}",
  }, {
    code: "UNKNOWN {}",
  } ],

  reject: [{
    code: "tag {}",
    message: messages.rejected("tag"),
    line: 1,
    column: 1,
  }],
})
