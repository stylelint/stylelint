/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [1],

  accept: [{
    code: "a {}\nb {}",
  }, {
    code: "a {}\r\nb {}",
  }, {
    code: "a {}\n\nb{}",
  }, {
    code: "a {}\r\n\r\nb{}",
  }, {
    code: "/** horse */\n\nb{}",
  }, {
    code: "/** horse */\r\n\r\nb{}",
  }, {
    code: "a{}\n\n/** horse */\n\nb{}",
  }, {
    code: "a{}\r\n\r\n/** horse */\r\n\r\nb{}",
  }],

  reject: [{
    code: "a {}\n\n\nb{}",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a {}\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: "a {}\n\n/** horse */\n\n\nb{}",
    message: messages.rejected,
    line: 3,
    column: 13,
  }, {
    code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 3,
    column: 14,
  }, {
    code: "/* horse\n\n\n */\na{}",
    message: messages.rejected,
    line: 1,
    column: 9,
  }, {
    code: "/* horse\r\n\r\n\r\n */\r\na{}",
    message: messages.rejected,
    line: 1,
    column: 10,
  }],
})

testRule(rule, {
  ruleName,
  config: [2],

  accept: [{
    code: "a {}\nb {}",
  }, {
    code: "a {}\n\nb {}",
  }, {
    code: "a {}\n\n\nb {}",
  }, {
    code: "a {}\r\n\r\n\r\nb{}",
  }, {
    code: "a{}\n\n\n/** horse */\n\n\nb{}",
  }, {
    code: "a{}\r\n\r\n\r\n/** horse */\r\n\r\n\r\nb{}",
  }],

  reject: [{
    code: "a {}\n\n\n\nb{}",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a {}\r\n\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 1,
    column: 6,
  }, {
    code: "a {}\n\n/** horse */\n\n\n\nb{}",
    message: messages.rejected,
    line: 3,
    column: 13,
  }, {
    code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 3,
    column: 14,
  }, {
    code: "/* horse\n\n\n\n */\na{}",
    message: messages.rejected,
    line: 1,
    column: 9,
  }, {
    code: "/* horse\r\n\r\n\r\n\r\n */\r\na{}",
    message: messages.rejected,
    line: 1,
    column: 10,
  }],
})