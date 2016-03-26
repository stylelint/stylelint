import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a {}",
  }, {
    code: ".foo, #bar {}",
  }, {
    code: "a.foo {}",
  }, {
    code: ":root { --custom-property-set: {} }",
  } ],

  reject: [ {
    code: "a b {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }, {
    code: "a + a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a > a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a ~ a {}",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a b, .foo {}",
    message: messages.rejected,
    line: 1,
    column: 2,
  }, {
    code: ".foo, a b {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "\t.foo,\n\ta b {}",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a#foo ~ b {}",
    message: messages.rejected,
    line: 1,
    column: 7,
  } ],
})
