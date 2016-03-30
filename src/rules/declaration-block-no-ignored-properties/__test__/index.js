import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a { display: inline; }",
  }, {
    code: "a { display: inline; padding: 10px; }",
  }, {
    code: "a { display: inline; margin-left: 10px; }",
  }, {
    code: "a { display: inline; margin-right: 10px; }",
  }, {
    code: "a { display: inline; vertical-align: baseline; }",
  }, {
    code: "a { display: inline-block; }",
  }, {
    code: "a { display: inline-block; width: 10px; }",
  }, {
    code: "a { display: inline-block; height: 10px; }",
  }, {
    code: "a { display: inline-block; margin: 10px; }",
  }, {
    code: "a { display: inline-block; padding: 10px; }",
  }, {
    code: "a { display: block; }",
  }, {
    code: "a { display: block; width: 10px; }",
  }, {
    code: "a { display: block; height: 10px; }",
  }, {
    code: "a { display: block; margin: 10px; }",
  }, {
    code: "a { display: block; padding: 10px; }",
  }, {
    code: "a { display: block; float: left; }",
  } ],

  reject: [ {
    code: "a { display: inline; width: 100px; }",
    message: messages.rejected("width", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline; height: 100px; }",
    message: messages.rejected("height", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline; margin: 100px; }",
    message: messages.rejected("margin", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline; margin-top: 100px; }",
    message: messages.rejected("margin-top", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline; margin-bottom: 100px; }",
    message: messages.rejected("margin-bottom", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline; float: left; }",
    message: messages.rejected("float", "display: inline"),
    line: 1,
    column: 22,
  }, {
    code: "a { display: inline-block; float: left; }",
    message: messages.rejected("float", "display: inline-block"),
    line: 1,
    column: 28,
  }, {
    code: "a { display: block; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: block"),
    line: 1,
    column: 21,
  }, {
    code: "a { display: table; margin: 10px; }",
    message: messages.rejected("margin", "display: table"),
    line: 1,
    column: 21,
  }, {
    code: "a { display: table; float: left; }",
    message: messages.rejected("float", "display: table"),
    line: 1,
    column: 21,
  }, {
    code: "a { display: table-caption; margin: 10px; }",
    message: messages.rejected("margin", "display: table-caption"),
    line: 1,
    column: 29,
  }, {
    code: "a { display: table-cell; margin: 10px; }",
    message: messages.rejected("margin", "display: table-cell"),
    line: 1,
    column: 26,
  }, {
    code: "a { display: table-column-group; margin: 10px; }",
    message: messages.rejected("margin", "display: table-column-group"),
    line: 1,
    column: 34,
  }, {
    code: "a { display: flex; float: left; }",
    message: messages.rejected("float", "display: flex"),
    line: 1,
    column: 20,
  } ],
})
