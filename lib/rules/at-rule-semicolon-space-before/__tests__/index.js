"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import \"styles/mystyle\" ;",
  }, {
    code: "@font-face {\n font-family: \"MyFont\"; src: url(\"myfont.woff2\") format(\"woff2\");\n}",
  }, {
    code: "a { color: @brand-primary; }",
  }, {
    code: "@myatrule \"valuehassemicolon;\" ;",
  }, {
    code: "@import url(http://www.example.com/alocation;withsemicolon) ;",
  }, {
    code: "@import /*my styles;*/ \"styles/mystyle\" ;",
  } ],

  reject: [ {
    code: "@import \"styles/mystyle\";",
    message: messages.expectedBefore(),
    line: 1,
    column: 25,
  }, {
    code: "@import \"styles/mystyle\"  ;",
    message: messages.expectedBefore(),
    line: 1,
    column: 26,
  }, {
    code: "@import \"styles/mystyle\"\t;",
    message: messages.expectedBefore(),
    line: 1,
    column: 26,
  }, {
    code: "@import \"styles/mystyle\"\n;",
    message: messages.expectedBefore(),
    line: 1,
    column: 26,
  }, {
    code: "@import \"styles/mystyle\"\r\n;",
    description: "CRLF",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "@import \"styles/mystyle\";",
  }, {
    code: "@font-face {\n font-family: \"MyFont\" ; src: url(\"myfont.woff2\") format(\"woff2\") ;\n}",
  }, {
    code: "a { color: @brand-primary ; }",
  }, {
    code: "@myatrule \"valuehassemicolon ;\";",
  }, {
    code: "@import url(http://www.example.com/alocation+;withsemicolon);",
  }, {
    code: "@import /*my styles ;*/ \"styles/mystyle\";",
  } ],

  reject: [ {
    code: "@import \"styles/mystyle\" ;",
    message: messages.expectedBefore(),
    line: 1,
    column: 26,
  }, {
    code: "@import \"styles/mystyle\"  ;",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  }, {
    code: "@import \"styles/mystyle\"\t;",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  }, {
    code: "@import \"styles/mystyle\"\n;",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  }, {
    code: "@import \"styles/mystyle\"\r\n;",
    description: "CRLF",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  } ],
})
