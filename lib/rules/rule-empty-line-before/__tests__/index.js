"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a {}",
    description: "first node ignored",
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
  }, {
    code: "@media {\n\na {} }",
    description: "nested",
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
  }, {
    code: "@media { b {}\n\n/* comment here*/\na {} }",
    description: "nested",
    message: messages.expected,
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
  }, {
    code: "@media { /* foo */\na {} }",
    description: "nested",
  } ],

  reject: [ {
    code: "b {} a {}",
    message: messages.expected,
  }, {
    code: "@media { b {} a {} }",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["inside-block"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "b {}\n\na {}",
  }, {
    code: "@media { b {} a {} }",
  } ],

  reject: [{
    code: "b {} a {}",
    message: messages.expected,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-rule"] } ],

  accept: [ {
    code: "a {} \nb {}",
  }, {
    code: "$var: pink;\n\nb {}",
    description: "scss variable",
  }, {
    code: "@media {}\n\na{}",
    description: "media rule",
  }, {
    code: "@media {\n\na {}\nb {} }",
    description: "nested",
  } ],

  reject: [ {
    code: "a {}\n\nb {}",
    message: messages.rejected,
  }, {
    code: "$var: pink;\nb {}",
    message: messages.expected,
  }, {
    code: "@media {}\na{}",
    message: messages.expected,
  }, {
    code: "@media {\n\na{}\n\nb{}}",
    message: messages.rejected,
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
  }, {
    code: "/* comment */\na {}",
  }, {
    code: "@media { /* comment */\na {} }",
  } ],

  reject: [ {
    code: "/**\n * comment\n*/\na {}",
    message: messages.expected,
  }, {
    code: "/* comment */\n\na {}",
    message: messages.rejected,
  }, {
    code: "@media { /* comment */\n\na {} }",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],

  accept: [ {
    code: "@media {\n  a {}\n\n}",
  }, {
    code: "@media {\r\n  a {}\r\n\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n  a {}\n\n  b{}\n\n}",
  }, {
    code: "@media {\n\ta {}\n\n\tb{}\n}",
  }, {
    code: "@media {\n\ta {}}",
  }, {
    code: "@media {\r\n\ta {}}",
    description: "CRLF",
  }, {
    code: "@media {\na {}\n/* comment */\n\nb {}}",
  }, {
    code: "@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "b {} a {}",
    message: messages.expected,
  }, {
    code: "@media {\n\n  a {}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\n\n  a {}\n\n  b{}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\r\n\r\n  a {}\r\n\r\n  b{}\r\n}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "@media {\n  b {} a {} }",
    message: messages.expected,
  }, {
    code: "@media {\r\n  b {} a {} }",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "@media {\n  b {}\n  a {}\n\n}",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["inside-block-and-after-rule"] } ],

  accept: [ {
    code: "a {\n color: pink; \n\n b {color: red; } \n c {color: blue; }\n}",
    description: "css property",
  }, {
    code: "a {\n $var: pink; \n\n b {color: red; } \n c {color: blue; }\n}",
    description: "scss variable",
  }, {
    code: "a {\n --custom-prop: pink; \n\n b {color: red; } \n c {color: blue; }\n}",
    description: "custom property",
  }, {
    code: "a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}",
    description: "media rule",
  }, {
    code: "a {\n color: pink; \r\n\r\n b {color: red; } \n c {color: blue; }\n}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "a {} b {}",
    message: messages.expected,
  }, {
    code: "a {}\nb {}",
    message: messages.expected,
  }, {
    code: "a {\n color: pink; b {color: red; }\n c {color: blue; }\n}",
    message: messages.expected,
  }, {
    code: "a {\n color: pink;\n b {color: red; }\n c {color: blue; }\n}",
    message: messages.expected,
  }, {
    code: "a {\n color: pink;\n\n b {color: red; }\n\n c {color: blue; }\n}",
    message: messages.rejected,
  }, {
    code: "a {\n @media {\n\n   b {}\n }\n c {}\n d {}\n}",
    description: "media rule",
    message: messages.expected,
  }, {
    code: "a {\r\n color: pink;\r\n b {\r\ncolor: red; \r\n}\r\n c {\r\ncolor: blue; \r\n}\r\n}",
    description: "CRLF",
    message: messages.expected,
  } ],
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
  }, {
    code: "@media {\n\na {} }",
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

  reject: [{
    code: "b {}\n\na {}",
    message: messages.rejected,
  }],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [ {
    code: "a {}",
    description: "first node ignored",
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
  }, {
    code: "@media { a\n{} }",
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
  }, {
    code: "@media\n{\n\na\n{} }",
    message: messages.rejected,
  }, {
    code: "@media\r\n{\r\n\r\na\r\n{} }",
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
