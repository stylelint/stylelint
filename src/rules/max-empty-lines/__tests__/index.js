import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [1],

  accept: [ {
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
  } ],

  reject: [ {
    code: "a {}\n\n\nb{}",
    message: messages.rejected,
    line: 4,
    column: 1,
  }, {
    code: "a {}\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 4,
    column: 1,
  }, {
    code: "a {}\n\n/** horse */\n\n\nb{}",
    message: messages.rejected,
    line: 6,
    column: 1,
  }, {
    code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 6,
    column: 1,
  }, {
    code: "/* horse\n\n\n */\na{}",
    message: messages.rejected,
    line: 4,
    column: 1,
  }, {
    code: "/* horse\r\n\r\n\r\n */\r\na{}",
    message: messages.rejected,
    line: 4,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
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
  } ],

  reject: [ {
    code: "a {}\n\n\n\nb{}",
    message: messages.rejected,
    line: 5,
    column: 1,
  }, {
    code: "a {}\r\n\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 5,
    column: 1,
  }, {
    code: "a {}\n\n/** horse */\n\n\n\nb{}",
    message: messages.rejected,
    line: 7,
    column: 1,
  }, {
    code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\n\r\nb{}",
    message: messages.rejected,
    line: 7,
    column: 1,
  }, {
    code: "/* horse\n\n\n\n */\na{}",
    message: messages.rejected,
    line: 5,
    column: 1,
  }, {
    code: "/* horse\r\n\r\n\r\n\r\n */\r\na{}",
    message: messages.rejected,
    line: 5,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [{
    code: "// one\n\n\n// two\n",
  }],

  reject: [{
    code: "// one\n\n\n\n// two\n",
    message: messages.rejected,
    line: 5,
    column: 1,
  }],
})
