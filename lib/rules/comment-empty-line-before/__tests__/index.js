"use strict"

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions")

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

const alwaysTests = {
  accept: [ {
    code: "/** comment */",
    description: "first node ignored",
  }, {
    code: "a { color: pink; /** comment */\ntop: 0; }",
    description: "shared-line comment ignored",
  }, {
    code: "a {} /** comment */",
    description: "shared-line comment ignored",
  }, {
    code: "a {}\n\n/** comment */",
  }, {
    code: "a {}\r\n\r\n/** comment */",
    description: "CRLF",
  }, {
    code: "a {}\n\r\n/** comment */",
    description: "Mixed",
  }, {
    code: "a { color: pink;\n\n/** comment */\ntop: 0; }",
  } ],

  reject: [ {
    code: "/** comment */\n/** comment */",
    message: messages.expected,
  }, {
    code: "/** comment */\r\n/** comment */",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "a { color: pink;\n/** comment */\ntop: 0; }",
    message: messages.expected,
  }, {
    code: "a { color: pink;\r\n/** comment */\r\ntop: 0; }",
    description: "CRLF",
    message: messages.expected,
  } ],
}

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "a {\n\n  /* comment */\n  color: pink;\n}",
    description: "first-nested with empty line before",
  }],

  reject: [{
    code: "a {\n  /* comment */\n  color: pink;\n}",
    description: "first-nested without empty line before",
    message: messages.expected,
    line: 2,
    column: 3,
  }],
}))

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],

  accept: [{
    code: "a {\n  /* comment */\n  color: pink;\n}",
    description: "first-nested without empty line before",
  }],

  reject: [{
    code: "a {\n\n  /* comment */\n  color: pink;\n}",
    description: "first-nested with empty line before",
    message: messages.rejected,
    line: 3,
    column: 3,
  }],
}))

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: [ "always", { ignore: ["stylelint-commands"] } ],

  accept: [{
    code: "a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}",
    description: "no newline before a stylelint command comment",
  }],
}))

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["between-comments"] } ],

  accept: [ {
    code: "/* a */\n/* b */\n/* c */\nbody {\n}",
    description: "no newline between comments",
  }, {
    code: "a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }",
    description: "no newline between comments",
  } ],

  reject: [{
    code: "a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }",
    message: messages.expected,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],

  accept: [ {
    code: "/* a */\n/* b */\n/* c */\nbody {\n}",
    description: "no newline between comments",
  }, {
    code: "a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }",
    description: "no newline between comments",
  } ],

  reject: [{
    code: "a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }",
    message: messages.expected,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "\n\n/** comment */",
    description: "first node ignored",
  }, {
    code: "\r\n\r\n/** comment */",
    description: "first node ignored and CRLF",
  }, {
    code: "a { color: pink; /** comment */\ntop: 0; }",
    description: "shared-line comment ignored",
  }, {
    code: "a {} /** comment */",
  }, {
    code: "a { color: pink;\n/** comment */\n\ntop: 0; }",
  }, {
    code: "a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }",
    description: "CRLF",
  } ],

  reject: [ {
    code: "/** comment */\n\n/** comment */",
    message: messages.rejected,
  }, {
    code: "a {}\n\n\n/** comment */",
    message: messages.rejected,
  }, {
    code: "a {}\r\n\r\n\r\n/** comment */",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "a { color: pink;\n\n/** comment */\ntop: 0; }",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

  accept: [ {
    code: "a { color: pink;\n// comment\ntop: 0; }",
    description: "single-line comment ignored",
  }, {
    code: "// first line\n// second line\na { color: pink; }",
    description: "subsequent single-line comments ingnored",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "sugarss",
  skipBasicChecks: true,

  accept: [{
    code: "a\n  color: pink\n\n  // single-line comment\n  top: 0",
    description: "single-line comment ignored",
  }],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "less",

  accept: [ {
    code: "a { color: pink;\n// comment\ntop: 0; }",
    description: "single-line comment ignored",
  }, {
    code: "// first line\n// second line\na { color: pink; }",
    description: "subsequent single-line comments ingnored",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "less",

  accept: [{
    code: "a { color: pink;\n\n// comment\ntop: 0; }",
    description: "single-line comment ignored",
  }],
})
