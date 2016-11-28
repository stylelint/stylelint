"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a {}",
    description: "first node ignored",
  }, {
    code: "@media { a {} }",
    description: "nested node ignored",
  }, {
    code: "b {}\n\na {}",
  }, {
    code: "b {}\r\n\r\na {}",
    description: "CRLF",
  }, {
    code: "b {}\n\r\na {}",
    description: "Mixed",
  }, {
    code: "b {}\n  \t\n\na {}",
  }, {
    code: "b {}\n\n\ta {}",
  }, {
    code: "b {}\r\n\r\n\ta {}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "b {} a {}",
    message: messages.expected,
  }, {
    code: "b {}\na {}",
    message: messages.expected,
  }, {
    code: "b {}\n\n/* comment here*/\na {}",
    message: messages.expected,
  }, {
    code: "b {}\r\n\r\n/* comment here*/\r\na {}",
    description: "CRLF",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-single-line-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "/**\n * comment\n*/\n\na {}",
  }, {
    code: "/* comment */\na {}",
  } ],

  reject: [ {
    code: "/**\n * comment\n*/\na {}",
    message: messages.expected,
  }, {
    code: "/* comment */\n\na {}",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "/* foo */\na {}",
  }, {
    code: "/* foo */\n\na {}",
  }, {
    code: "/* foo */\r\n\r\na {}",
    description: "CRLF",
  } ],

  reject: [{
    code: "b {} a {}",
    message: messages.expected,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "\n\na {}",
    description: "first node ignored",
  }, {
    code: "\r\n\r\na {}",
    description: "first node ignored and CRLF",
  }, {
    code: "@media {\n\na {} }",
    description: "nested node ignored",
  }, {
    code: "b {}\na {}",
  }, {
    code: "b {}\n  \t\na {}",
  }, {
    code: "b {}\r\n  \t\r\na {}",
    description: "CRLF",
  }, {
    code: "b {}\ta {}",
  } ],

  reject: [ {
    code: "b {}\n\na {}",
    message: messages.rejected,
  }, {
    code: "b {}\t\n\n\ta {}",
    message: messages.rejected,
  }, {
    code: "b {}\t\r\n\r\n\ta {}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "b {}\n\n/* comment here*/\n\na {}",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { except: ["after-single-line-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "/**\n * comment\n*/\na {}",
  }, {
    code: "/* comment */\n\na {}",
  } ],

  reject: [ {
    code: "/**\n * comment\n*/\n\na {}",
    message: messages.rejected,
  }, {
    code: "/* comment */\na {}",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { ignore: ["after-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "/* foo */\na {}",
  }, {
    code: "/* foo */\r\na {}",
    description: "CRLF",
  }, {
    code: "/* foo */\n\na {}",
  } ],

  reject: [ {
    code: "b {}\n\na {}",
    message: messages.rejected,
  }, {
    code: "b {}\r\n\r\na {}",
    description: "CRLF",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [ {
    code: "a {}",
    description: "first node ignored",
  }, {
    code: "@media { a\n{} }",
    description: "nested node ignored",
  }, {
    code: "b {}\na {}",
    description: "single-line ignored",
  }, {
    code: "b\n{}\n\na\n{}",
  }, {
    code: "b\r\n{}\r\n\r\na\r\n{}",
    description: "CRLF",
  }, {
    code: "b\n{}\n  \t\n\na\n{}",
  }, {
    code: "b {}\n\n\ta\n{}",
  }, {
    code: "b {}\r\n\r\n\ta\r\n{}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "b {} a\n{}",
    message: messages.expected,
  }, {
    code: "b\n{}\na\n{}",
    message: messages.expected,
  }, {
    code: "b\r\n{}\r\na\r\n{}",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "b {}\n\n/* comment here*/\na\n{}",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [ {
    code: "\n\na\n{}",
    description: "first node ignored",
  }, {
    code: "@media\n{\n\na\n{} }",
    description: "nested node ignored",
  }, {
    code: "@media\r\n{\r\n\r\na\r\n{} }",
    description: "nested node ignored and CRLF",
  }, {
    code: "b {}\n\na {}",
    description: "single-line ignored",
  }, {
    code: "b\n{}\n  \t\na\n{}",
  }, {
    code: "b\r\n{}\r\n  \t\r\na\r\n{}",
    description: "CRLF",
  }, {
    code: "b {}\ta\n{}",
  } ],

  reject: [ {
    code: "b {}\n\na\n{}",
    message: messages.rejected,
  }, {
    code: "b {}\t\n\n\ta\n{}",
    message: messages.rejected,
  }, {
    code: "b {}\t\r\n\r\n\ta\r\n{}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "b {}\n\n/* comment here*/\n\na\n{}",
    message: messages.rejected,
  }, {
    code: "b {}\r\n\r\n/* comment here*/\r\n\r\na\r\n{}",
    description: "CRLF",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["always"],

  accept: [ {
    code: "a {}\n.mixin-call() {}",
    description: "ignore non-ouputting Less class mixin definition",
  }, {
    code: "@foo: {};\n@bar: {};",
    description: "ignore non-ouputting Less class mixin definition",
  } ],
})
