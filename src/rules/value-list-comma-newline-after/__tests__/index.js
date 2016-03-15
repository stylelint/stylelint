/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName: ruleName,
  config: ["always"],

  accept: [{
    code: "a { background-size: 0,\n0; }",
  }, {
    code: "a { background-size: 0 ,\n  0; }",
  }, {
    code: "a { background-size: 0 ,\r\n  0; }",
    description: "CRLF",
  }, {
    code: "a::before { content: \"foo,bar,baz\"; }",
    description: "string",
  }, {
    code: "a { transform: translate(1,1); }",
    description: "ignores function",
  }],

  reject: [{
    code: "a { background-size: 0, 0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  }, {
    code: "a { background-size: 0,  0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  }, {
    code: "a { background-size: 0,\t0; }",
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  }],
})

testRule(rule, {
  ruleName: ruleName,
  config: ["always-multi-line"],

  accept: [{
    code: "a { background-size: 0,\n0,\n0; }",
  }, {
    code: "a { background-size: 0 ,\n  0,\n0; }",
  }, {
    code: "a { background-size: 0 ,\r\n  0,\r\n0; }",
    description: "CRLF",
  }, {
    code: "a { background-size: 0, 0; }",
    description: "ignores single-line",
  }, {
    code: "a { background-size: 0, 0;\n}",
    description: "ignores single-line list, multi-line block",
  }, {
    code: "a { background-size: 0, 0;\r\n}",
    description: "ignores single-line list, multi-line block with CRLF",
  }],

  reject: [{
    code: "a { background-size: 0,\n0, 0; }",
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  }, {
    code: "a { background-size: 0,\n0,  0; }",
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  }, {
    code: "a { background-size: 0,\n0,\t0; }",
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  }, {
    code: "a { background-size: 0,\r\n0,\t0; }",
    description: "CRLF",
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  }],
})

testRule(rule, {
  ruleName: ruleName,
  config: ["never-multi-line"],

  accept: [{
    code: "a { background-size: 0\n,0\n,0; }",
  }, {
    code: "a { background-size: 0\r\n,0\r\n,0; }",
    description: "CRLF",
  }, {
    code: "a { background-size: 0, 0; }",
    description: "ignores single-line",
  }, {
    code: "a { background-size: 0, 0;\n}",
    description: "ignores single-line list, multi-line block",
  }, {
    code: "a { background-size: 0, 0;\r\n}",
    description: "ignores single-line list, multi-line block with CRLF",
  }],

  reject: [{
    code: "a { background-size: 0\n,0\n, 0; }",
    message: messages.rejectedAfterMultiLine(),
    line: 3,
    column: 1,
  }, {
    code: "a { background-size: 0\n,0\n,  0; }",
    message: messages.rejectedAfterMultiLine(),
    line: 3,
    column: 1,
  }, {
    code: "a { background-size: 0\r\n,0\r\n,  0; }",
    description: "CRLF",
    message: messages.rejectedAfterMultiLine(),
    line: 3,
    column: 1,
  }, {
    code: "a { background-size: 0\n,0\n,\t0; }",
    message: messages.rejectedAfterMultiLine(),
    line: 3,
    column: 1,
  }],
})