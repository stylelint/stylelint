import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: ".foo { display: flex; }",
  }, {
    code: ".foo { background: linear-gradient(to top, #000, #fff); }",
  }, {
    code: ".foo { max-width: max-content; }",
  }, {
    code: ".foo { -webkit-transform: translate(0, 0); }",
    description: "ignores property vendor prefixes",
  } ],

  reject: [ {
    code: ".foo { display: -webkit-flex; }",
    message: messages.rejected("-webkit-flex"),
    line: 1,
    column: 17,
  }, {
    code: ".foo { color: pink; display: -webkit-flex; }",
    message: messages.rejected("-webkit-flex"),
    line: 1,
    column: 30,
  }, {
    code: ".foo { display: -webkit-box; }",
    message: messages.rejected("-webkit-box"),
    line: 1,
    column: 17,
  }, {
    code: ".foo { background: -webkit-linear-gradient(bottom, #000, #fff); }",
    message: messages.rejected("-webkit-linear-gradient"),
    line: 1,
    column: 20,
  }, {
    code: ".foo { max-width: -moz-max-content; }",
    message: messages.rejected("-moz-max-content"),
    line: 1,
    column: 19,
  } ],
})
