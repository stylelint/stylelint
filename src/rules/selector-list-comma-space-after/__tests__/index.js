/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "a, b {}",
  }, {
    code: "a, b, c {}",
  }, {
    code: "a , b {}",
  }, {
    code: "a\n, b {}",
  }, {
    code: "a\r\n, b {}",
    description: "CRLF",
  }, {
    code: "a, b[data-foo=\"tr,tr\"] {}",
    description: "string",
  }],

  reject: [{
    code: "a,b {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,  b {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\nb {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\r\nb {}",
    description: "CRLF",
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\tb {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a, b,c {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 5,
  }, {
    code: "a, b,  c {}",
    message: messages.expectedAfter(),
    line: 1,
    column: 5,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [{
    code: "a,b {}",
  }, {
    code: "a,b,c {}",
  }, {
    code: "a ,b {}",
  }, {
    code: "a\n,b {}",
  }, {
    code: "a\r\n,b {}",
    description: "CRLF",
  }, {
    code: "a,b[data-foo=\"tr, tr\"] {}",
    description: "string",
  }],

  reject: [{
    code: "a, b {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,  b {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\nb {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\r\nb {}",
    description: "CRLF",
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,\tb {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, {
    code: "a,b, c {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  }, {
    code: "a,b,  c {}",
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  }],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [{
    code: "a, b {}",
  }, {
    code: "a, b {\n}",
    description: "single-line selector list, multi-line block",
  }, {
    code: "a, b {\r\n}",
    description: "single-line selector list, multi-line block with CRLF",
  }],

  reject: [{
    code: "a,b {}",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, {
    code: "a,b {\n}",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, {
    code: "a,b {\r\n}",
    description: "CRLF",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [{
    code: "a,b {}",
  }, {
    code: "a,b {\n}",
    description: "single-line selector list, multi-line block",
  }, {
    code: "a,b {\r\n}",
    description: "single-line selector list, multi-line block with CRLF",
  }],

  reject: [{
    code: "a, b {}",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, {
    code: "a, b {\n}",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, {
    code: "a, b {\r\n}",
    description: "CRLF",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  }],
})