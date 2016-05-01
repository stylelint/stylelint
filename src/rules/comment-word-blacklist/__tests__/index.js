import testRule from "../../../testUtils/testRule"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [[
    "/^TODO:/",
    "bad-word",
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
  }, {
    code: "/* todo */",
  }, {
    code: "/* todo: */",
  }, {
    code: "/* todo: comment */",
  }, {
    code: "/* tOdO: comment */",
  }, {
    code: "/* Todo: comment */",
  }, {
    code: "/* Comment with bad-word */",
  }, {
    code: "/*! Todo: comment */",
  }, {
    code: "/*# Todo: comment */",
  }, {
    code: "/*! bad-word */",
  }, {
    code: "/*# bad-word */",
  }, {
    code: "/** bad-word **/",
  }, {
    code: "/*** bad-word ***/",
  }, {
    code: "/** TODO: comment **/",
  }, {
    code: "/*** TODO: comment ***/",
  } ],

  reject: [ {
    code: "/* TODO: */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* TODO: comment */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* TODO: comment\n next line */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* TODO: comment\n next line */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* TODO: comment\r\n next line */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* TODO: comment\n\n next line */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/*\n TODO: comment */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/*\r\n TODO: comment */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/*\n\n TODO: comment */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/*\r\n\r\n TODO: comment */",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "/* bad-word */",
    message: messages.rejected("bad-word"),
    line: 1,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [[
    "/^TODO:/",
    "bad-word",
  ]],

  accept: [ {
    code: "// comment",
  }, {
    code: "// todo",
  }, {
    code: "// todo:",
  }, {
    code: "// Todo:",
  }, {
    code: "// tOdO:",
  } ],

  reject: [ {
    code: "// TODO:",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "// TODO: comment",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "// bad-word",
    message: messages.rejected("bad-word"),
    line: 1,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: [[
    "/^TODO:/",
    "bad-word",
  ]],

  accept: [ {
    code: "// comment",
  }, {
    code: "// todo:",
  }, {
    code: "// Todo:",
  }, {
    code: "// tOdO:",
  } ],

  reject: [ {
    code: "// TODO:",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "// TODO: comment",
    message: messages.rejected("/^TODO:/"),
    line: 1,
    column: 1,
  }, {
    code: "// bad-word",
    message: messages.rejected("bad-word"),
    line: 1,
    column: 1,
  } ],
})
