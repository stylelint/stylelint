import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a { padding: 1px; }",
  }, {
    code: "a { padding: 10px; }",
  }, {
    code: "a { padding: 10.01px; }",
  }, {
    code: "a { padding: 10px 1px 1.05px 3.00003em; }",
  }, {
    code: "a { padding: 0.01px; }",
  }, {
    code: "a { padding: .01px; }",
  }, {
    code: "@media (min-width: 100px) {}",
  }, {
    code: "@import \"0.10.css\";",
  }, {
    code: "@import url(0.10.css);",
  }, {
    code: "a { background: url(data:image/svg+xml;...1.0); }",
    description: "data URI containing trailing zero",
  } ],

  reject: [ {
    code: "a { padding: 1.0px; }",
    message: messages.rejected,
    line: 1,
    column: 16,
  }, {
    code: "a { padding: 1.000px; }",
    message: messages.rejected,
    line: 1,
    column: 18,
  }, {
    code: "a { padding: 10.0px; }",
    message: messages.rejected,
    line: 1,
    column: 17,
  }, {
    code: "a { padding: 10.010px; }",
    message: messages.rejected,
    line: 1,
    column: 19,
  }, {
    code: "a { padding: 10.010px; }",
    message: messages.rejected,
    line: 1,
    column: 19,
  }, {
    code: "a { padding: 0.010px; }",
    message: messages.rejected,
    line: 1,
    column: 18,
  }, {
    code: "a { padding: .010px; }",
    message: messages.rejected,
    line: 1,
    column: 17,
  }, {
    code: "a { transform: translate(2px, 0.40px); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "a { padding: 10px 1px 10.010px 3.00003em; }",
    message: messages.rejected,
    line: 1,
    column: 28,
  }, {
    code: "a { padding: 10px 1px 10.01px 3.000030em; }",
    message: messages.rejected,
    line: 1,
    column: 38,
  }, {
    code: "@media (min-width: 100.0px) {}",
    message: messages.rejected,
    line: 1,
    column: 24,
  } ],
})
