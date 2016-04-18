import testRule from "../../../testUtils/testRule"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [[
    "/todo/",
    "word",
    "/copy/",
    "/map/",
  ]],

  accept: [ {
    code: "/* comment */",
  }, {
    code: "/* comment comment */",
  }, {
    code: "/* comment\ncomment */",
  }, {
    code: "/* comment\n\ncomment */",
  }, {
    code: "/** comment */",
  }, {
    code: "/**** comment ***/",
  }, {
    code: "/*\ncomment\n*/",
  }, {
    code: "/*\tcomment   */",
  }, {
    code: "/*! copyright */",
  }, {
    code: "/*# sourcemap */",
  }, {
    code: "a { color: pink; /* comment */\ntop: 0; }",
  }, {
    code: "a {} /* comment */",
  } ],

  reject: [{
    code: "/* todo */",
    message: messages.rejected("todo"),
    line: 1,
    column: 1,
  }],
})
