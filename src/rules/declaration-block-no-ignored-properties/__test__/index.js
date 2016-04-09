import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a { display: inline; }",
  }, {
    code: "a { display: inline; color: red; }",
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
    code: "a { display: inline-block; color: red; }",
  }, {
    code: "a { display: inline-block; width: 10px; }",
  }, {
    code: "a { display: inline-block; height: 10px; }",
  }, {
    code: "a { display: inline-block; margin: 10px; }",
  }, {
    code: "a { display: inline-block; padding: 10px; }",
  }, {
    code: "a { display: inline-block; vertical-align: baseline; }",
  }, {
    code: "a { display: block; }",
  }, {
    code: "a { display: block; color: red; }",
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
  }, {
    code: "a { display: table-cell; width: 100%; }",
  }, {
    code: "a { display: table-cell; height: 100%; }",
  }, {
    code: "a { display: table-cell; padding: 10px; }",
  }, {
    code: "a { position: static; display: block; }",
  }, {
    code: "a { position: static; width: 100%; }",
  }, {
    code: "a { position: absolute; top: 0px; }",
  }, {
    code: "a { position: absolute; right: 0px; }",
  }, {
    code: "a { position: absolute; bottom: 0px; }",
  }, {
    code: "a { position: absolute; left: 0px; }",
  }, {
    code: "a { position: fixed; top: 0px; }",
  }, {
    code: "a { position: fixed; right: 0px; }",
  }, {
    code: "a { position: fixed; bottom: 0px; }",
  }, {
    code: "a { position: fixed; left: 0px; }",
  } ],

  reject: [ {
    code: "a { display: inline; width: 100px; }",
    message: messages.rejected("width", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; height: 100px; }",
    message: messages.rejected("height", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; margin: 100px; }",
    message: messages.rejected("margin", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; margin-top: 100px; }",
    message: messages.rejected("margin-top", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; margin-bottom: 100px; }",
    message: messages.rejected("margin-bottom", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; float: left; }",
    message: messages.rejected("float", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline-block; float: left; }",
    message: messages.rejected("float", "display: inline-block"),
    line: 1,
    column: 28,
    description: "display: inline-block rules out float",
  }, {
    code: "a { display: block; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: block"),
    line: 1,
    column: 21,
    description: "display: block rules out baseline",
  }, {
    code: "a { display: table-cell; margin: 10px; }",
    message: messages.rejected("margin", "display: table-cell"),
    line: 1,
    column: 26,
    description: "display: table-* rules out margin",
  }, {
    code: "a { display: table-cell; margin-top: 10px; }",
    message: messages.rejected("margin-top", "display: table-cell"),
    line: 1,
    column: 26,
    description: "display: table-* rules out margin",
  },{
    code: "a { display: table-cell; margin-right: 10px; }",
    message: messages.rejected("margin-right", "display: table-cell"),
    line: 1,
    column: 26,
    description: "display: table-* rules out margin",
  }, {
    code: "a { display: table-cell; margin-bottom: 10px; }",
    message: messages.rejected("margin-bottom", "display: table-cell"),
    line: 1,
    column: 26,
    description: "display: table-* rules out margin",
  }, {
    code: "a { display: table-cell; margin-left: 10px; }",
    message: messages.rejected("margin-left", "display: table-cell"),
    line: 1,
    column: 26,
    description: "display: table-* rules out margin",
  }, {
    code: "a { display: table-row; margin: 10px; }",
    message: messages.rejected("margin", "display: table-row"),
    line: 1,
    column: 25,
    description: "display: table-* rules out margin",
  }, {
    code: "a { position: static; top: 1px; }",
    message: messages.rejected("top", "position: static"),
    line: 1,
    column: 23,
    description: "position: static rules out top, right, bottom, and left",
  }, {
    code: "a { position: static; right: 1px; }",
    message: messages.rejected("right", "position: static"),
    line: 1,
    column: 23,
    description: "position: static rules out top, right, bottom, and left",
  }, {
    code: "a { position: static; bottom: 1px; }",
    message: messages.rejected("bottom", "position: static"),
    line: 1,
    column: 23,
    description: "position: static rules out top, right, bottom, and left",
  }, {
    code: "a { position: static; left: 1px; }",
    message: messages.rejected("left", "position: static"),
    line: 1,
    column: 23,
    description: "position: static rules out top, right, bottom, and left",
  }, {
    code: "a { position: absolute; float: left; }",
    message: messages.rejected("float", "position: absolute"),
    line: 1,
    column: 25,
    description: "position: absolute rules out float",
  }, {
    code: "a { position: absolute; clear: left; }",
    message: messages.rejected("clear", "position: absolute"),
    line: 1,
    column: 25,
    description: "position: absolute rules out clear",
  }, {
    code: "a { position: fixed; float: left; }",
    message: messages.rejected("float", "position: fixed"),
    line: 1,
    column: 22,
    description: "position: absolute rules out float",
  }, {
    code: "a { position: fixed; clear: left; }",
    message: messages.rejected("clear", "position: fixed"),
    line: 1,
    column: 22,
    description: "position: absolute rules out float",
  } ],
})
