"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [1],

  accept: [ {
    code: "\na {}\n",
    description: "(LF) One empty line at beginning and end of selector (max: 1)",
  }, {
    code: "\r\na {}\r\n",
    description: "(CRLF) One empty line at beginning and end of selector (max: 1)",
  }, {
    code: "a {}\nb {}",
    description: "(LF) No empty lines between selectors (max: 1)",
  }, {
    code: "a {}\r\nb {}",
    description: "(CRLF) No empty lines between selectors (max: 1)",
  }, {
    code: "a {}\n\nb {}",
    description: "(LF) One empty line between selectors (max: 1)",
  }, {
    code: "a {}\r\n\r\nb {}",
    description: "(CRLF) One empty line between selectors (max: 1)",
  }, {
    code: "/*\n\n*/",
    description: "(LF) One empty line in comment block (max: 1)",
  }, {
    code: "/*\r\n\r\n*/",
    description: "(CRLF) One empty line in comment block (max: 1)",
  }, {
    code: "/*\n\nhorse\n\n*/",
    description: "(LF) One empty line at beginning and end in comment block (max: 1)",
  }, {
    code: "/*\r\n\r\nhorse\r\n\r\n*/",
    description: "(CRLF) One empty line at beginning and end in comment block (max: 1)",
  } ],

  reject: [ {
    code: "\n",
    message: messages.expected(1),
    line: 2,
    column: 1,
    description: "(LF) Two empty lines inside file (max: 1)",
  }, {
    code: "\r\n",
    message: messages.expected(1),
    line: 2,
    column: 1,
    description: "(CRLF) Two empty lines inside file (max: 1)",
  }, {
    code: "\n\na {}",
    message: messages.expected(1),
    line: 2,
    column: 1,
    description: "(LF) Two empty lines at beginning of selector (max: 1)",
  }, {
    code: "\r\n\r\na {}",
    message: messages.expected(1),
    line: 2,
    column: 1,
    description: "(CRLF) Two empty lines at beginning of selector (max: 1)",
  }, {
    code: "a {}\n\n",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(LF) Two empty lines at end of selector (max: 1)",
  }, {
    code: "a {}\r\n\r\n",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(CRLF) Two empty lines at end of selector (max: 1)",
  }, {
    code: "a {}\n\n\nb {}",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(LF) Two empty lines between selectors (max: 1)",
  }, {
    code: "a {}\r\n\r\n\r\nb {}",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(CRLF) Two empty lines between selectors (max: 1)",
  }, {
    code: "/*\n\n\n*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(LF) Two empty lines in comment block (max: 1)",
  }, {
    code: "/*\r\n\r\n\r\n*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(CRLF) Two empty lines in comment block (max: 1)",
  }, {
    code: "/*\n\n\nhorse*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(LF) Two empty lines at beginning in comment block (max: 1)",
  }, {
    code: "/*\r\n\r\n\r\nhorse*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(CRLF) Two empty lines at beginning in comment block (max: 1)",
  }, {
    code: "/*horse\n\n\n*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(LF) Two empty lines at end in comment block (max: 1)",
  }, {
    code: "/*horse\r\n\r\n\r\n*/",
    message: messages.expected(1),
    line: 3,
    column: 1,
    description: "(CRLF) Two empty lines at end in comment block (max: 1)",
  } ],
})

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,

  accept: [ {
    code: "\n",
    description: "(LF) Two empty lines in file (max: 2)",
  }, {
    code: "\r\n",
    description: "(CRLF) Two empty lines in file (max: 2)",
  }, {
    code: "\n\na {}\n\n",
    description: "(LF) Two empty lines at beginning and end of selector (max: 2)",
  }, {
    code: "\r\n\r\na {}\r\n\r\n",
    description: "(CRLF) Two empty lines at beginning and end of selector (max: 2)",
  }, {
    code: "a {}\n\n\nb {}",
    description: "(LF) Two empty lines between selectors (max: 2)",
  }, {
    code: "a {}\r\n\r\n\r\nb {}",
    description: "(CRLF) Two empty lines between selectors (max: 2)",
  }, {
    code: "/*\n\n\n*/",
    description: "(LF) Two empty lines in comment block (max: 2)",
  }, {
    code: "/*\r\n\r\n\r\n*/",
    description: "(CRLF) Two empty lines in comment block (max: 2)",
  }, {
    code: "/*\n\n\nhorse\n\n\n*/",
    description: "(LF) Two empty lines at beginning and end in comment block (max: 2)",
  }, {
    code: "/*\r\n\r\n\r\nhorse\r\n\r\n\r\n*/",
    description: "(CRLF) Two empty lines at beginning and end in comment block (max: 2)",
  } ],

  reject: [ {
    code: "\n\n",
    message: messages.expected(2),
    line: 3,
    column: 1,
    description: "(LF) Three empty lines inside file (max: 2)",
  }, {
    code: "\r\n\r\n",
    message: messages.expected(2),
    line: 3,
    column: 1,
    description: "(CRLF) Three empty lines inside file (max: 2)",
  }, {
    code: "\n\n\na {}",
    message: messages.expected(2),
    line: 3,
    column: 1,
    description: "(LF) Three empty lines at beginning of selector (max: 2)",
  }, {
    code: "\r\n\r\n\r\na {}",
    message: messages.expected(2),
    line: 3,
    column: 1,
    description: "(CRLF) Three empty lines at beginning of selector (max: 2)",
  }, {
    code: "a {}\n\n\n",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(LF) Three empty lines at end of selector (max: 2)",
  }, {
    code: "a {}\r\n\r\n\r\n",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(CRLF) Three empty lines at end of selector (max: 2)",
  }, {
    code: "a {}\n\n\n\nb {}",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(LF) Three empty lines between selectors (max: 2)",
  }, {
    code: "a {}\r\n\r\n\r\n\r\nb {}",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(CRLF) Three empty lines between selectors (max: 2)",
  }, {
    code: "/*\n\n\n\n*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(LF) Three empty lines in comment block (max: 2)",
  }, {
    code: "/*\r\n\r\n\r\n\r\n*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(CRLF) Three empty lines in comment block (max: 2)",
  }, {
    code: "/*\n\n\n\nhorse*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(LF) Three empty lines at beginning in comment block (max: 2)",
  }, {
    code: "/*\r\n\r\n\r\n\r\nhorse*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(CRLF) Three empty lines at beginning in comment block (max: 2)",
  }, {
    code: "/*horse\n\n\n\n*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(LF) Three empty lines at end in comment block (max: 2)",
  }, {
    code: "/*horse\r\n\r\n\r\n\r\n*/",
    message: messages.expected(2),
    line: 4,
    column: 1,
    description: "(CRLF) Three empty lines at end in comment block (max: 2)",
  } ],
})

testRule(rule, {
  ruleName,
  config: [3],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [ {
    code: "\n\n\n// one\n\n\n",
    description: "(LF) Three empty lines at beginning and end of single line comment (max: 3)",
  }, {
    code: "// one\n\n\n\n// two",
    description: "(LF) Three empty lines between single line comments (max: 3)",
  } ],

  reject: [ {
    code: "\n\n\n\n// one",
    message: messages.expected(3),
    line: 4,
    column: 1,
    description: "(LF) Four empty lines at beginning of single line comment (max: 3)",
  }, {
    code: "// one\n\n\n\n",
    message: messages.expected(3),
    line: 5,
    column: 1,
    description: "(LF) Four empty lines at end of single line comment (max: 3)",
  }, {
    code: "// one\n\n\n\n\n// two",
    message: messages.expected(3),
    line: 5,
    column: 1,
    description: "(LF) Four empty lines between single line comments (max: 3)",
  } ],
})
