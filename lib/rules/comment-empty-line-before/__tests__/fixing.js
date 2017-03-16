"use strict"

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions")

const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

const alwaysTests = {
  fixingCases: [ {
    code: "/** comment */",
    description: "first node ignored",
    same: true,
  }, {
    code: "a { color: pink; /** comment */\ntop: 0; }",
    description: "shared-line comment ignored",
    same: true,
  }, {
    code: "a {} /** comment */",
    description: "shared-line comment ignored",
    same: true,
  }, {
    code: "a {}\n\n/** comment */",
    same: true,
  }, {
    code: "a {}\r\n\r\n/** comment */",
    description: "CRLF",
    same: true,
  }, {
    code: "a {}\n\r\n/** comment */",
    description: "Mixed",
    same: true,
  }, {
    code: "a { color: pink;\n\n/** comment */\ntop: 0; }",
    same: true,
  }, {
    code: "/** comment */\n/** comment */",
    expected: "/** comment */\n\n/** comment */",
  }, {
    code: "/** comment */\r\n/** comment */",
    expected: "/** comment */\n\r\n/** comment */",
    description: "CRLF",
  }, {
    code: "a { color: pink;\n/** comment */\ntop: 0; }",
    expected: "a { color: pink;\n\n/** comment */\ntop: 0; }",
  }, {
    code: "a { color: pink;\r\n/** comment */\r\ntop: 0; }",
    expected: "a { color: pink;\n\r\n/** comment */\r\ntop: 0; }",
    description: "CRLF",
  } ],
}

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: ["always"],

  fixingCases: [ {
    code: "a {\n\n  /* comment */\n  color: pink;\n}",
    description: "first-nested with empty line before",
    same: true,
  }, {
    code: "a {\n  /* comment */\n  color: pink;\n}",
    expected: "a {\n\n  /* comment */\n  color: pink;\n}",
    description: "first-nested without empty line before",
  } ],
}))

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],

  fixingCases: [ {
    code: "a {\n  /* comment */\n  color: pink;\n}",
    description: "first-nested without empty line before",
    same: true,
  }, {
    code: "a {\n\n  /* comment */\n  color: pink;\n}",
    expected: "a {\n  /* comment */\n  color: pink;\n}",
    description: "first-nested with empty line before",
  } ],
}))

testRule(rule, mergeTestDescriptions(alwaysTests, {
  ruleName,
  config: [ "always", { ignore: ["stylelint-commands"] } ],

  fixingCases: [{
    code: "a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}",
    description: "no newline before a stylelint command comment",
    same: true,
  }],
}))

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],

  fixingCases: [ {
    code: "/* a */\n/* b */\n/* c */\nbody {\n}",
    description: "no newline between comments",
    same: true,
  }, {
    code: "a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }",
    description: "no newline between comments",
    same: true,
  }, {
    code: "a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }",
    expected: "a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  fixingCases: [ {
    code: "\n\n/** comment */",
    description: "first node ignored",
    same: true,
  }, {
    code: "\r\n\r\n/** comment */",
    description: "first node ignored and CRLF",
    same: true,
  }, {
    code: "a { color: pink; /** comment */\ntop: 0; }",
    description: "shared-line comment ignored",
    same: true,
  }, {
    code: "a {} /** comment */",
    same: true,
  }, {
    code: "a { color: pink;\n/** comment */\n\ntop: 0; }",
    same: true,
  }, {
    code: "a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }",
    description: "CRLF",
    same: true,
  }, {
    code: "/** comment */\n\n/** comment */",
    expected: "/** comment */\n/** comment */",
  }, {
    code: "a {}\n\n\n/** comment */",
    expected: "a {}\n/** comment */",
  }, {
    code: "a {}\r\n\r\n\r\n/** comment */",
    expected: "a {}\r\n/** comment */",
    description: "CRLF",
  }, {
    code: "a { color: pink;\n\n/** comment */\ntop: 0; }",
    expected: "a { color: pink;\n/** comment */\ntop: 0; }",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

  fixingCases: [ {
    code: "a { color: pink;\n// comment\ntop: 0; }",
    description: "single-line comment ignored",
    same: true,
  }, {
    code: "// first line\n// second line\na { color: pink; }",
    description: "subsequent single-line comments ingnored",
    same: true,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "sugarss",
  skipBasicChecks: true,

  fixingCases: [{
    code: "a\n  color: pink\n\n  // single-line comment\n  top: 0",
    description: "single-line comment ignored",
    same: true,
  }],
})

// testRule(rule, {
//   ruleName,
//   config: ["always"],
//   syntax: "less",

//   fixingCases: [ {
//     code: "a { color: pink;\n// comment\ntop: 0; }",
//     description: "single-line comment ignored",
//     same: true,
//   }, {
//     code: "// first line\n// second line\na { color: pink; }",
//     description: "subsequent single-line comments ingnored",
//     same: true,
//   } ],
// })

// testRule(rule, {
//   ruleName,
//   config: ["never"],
//   syntax: "less",

//   fixingCases: [{
//     code: "a { color: pink;\n\n// comment\ntop: 0; }",
//     description: "single-line comment ignored",
//     same: true,
//   }],
// })
