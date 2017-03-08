"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning for declarationBlockNoIgnoredProperties", () => {
  const config = {
    rules: {
      "declaration-block-no-ignored-properties": true,
    },
  }

  const code = "a { display: inline; width: 100px; }"

  return stylelint({ code, config }).then(output => {
    const result = output.results[0]
    expect(result.deprecations.length).toEqual(1)
    expect(result.deprecations[0].text).toEqual("\'declaration-block-no-ignored-properties\' has been deprecated and in 8.0 will be removed.")
    expect(result.deprecations[0].reference).toEqual("https://stylelint.io/user-guide/rules/declaration-block-no-ignored-properties/")
    expect(result.warnings.length).toEqual(1)
    expect(result.warnings[0].text).toEqual("Unexpected \"width\" with \"display: inline\" (declaration-block-no-ignored-properties)")
  })
})

testRule(rule, {
  ruleName,
  config: [true],

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
    code: "a { display: inline-table; vertical-align: baseline; }",
  }, {
    code: "a { display: inline-flex; vertical-align: baseline; }",
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
    code: "a { display: table-cell; vertical-align: baseline; }",
  }, {
    code: "a { position: static; display: block; }",
  }, {
    code: "a { position: static; width: 100%; }",
  }, {
    code: "a { position: static; vertical-align: baseline; }",
  }, {
    code: "a { position: relative; vertical-align: baseline; }",
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
  }, {
    code: "a { display: inline; &:hover { width: 100px; } }",
  }, {
    code: "a { display: inline; &::before { width: 100px; } }",
  }, {
    code: "a { display: inline; display: inline-block; width: 100px; }",
  }, {
    code: "a { display: inline; width: 100px; display: inline-block; }",
  } ],

  reject: [ {
    code: "a { display: inline; width: 100px; }",
    message: messages.rejected("width", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { dIsPlAy: iNlInE; wIdTh: 100pX; }",
    message: messages.rejected("wIdTh", "dIsPlAy: iNlInE"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { DISPLAY: INLINE; WIDTH: 100PX; }",
    message: messages.rejected("WIDTH", "DISPLAY: INLINE"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; min-width: 100px; }",
    message: messages.rejected("min-width", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out min-width",
  }, {
    code: "a { display: inline; max-width: 100px; }",
    message: messages.rejected("max-width", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out max-width",
  }, {
    code: "a { display: inline; height: 100px; }",
    message: messages.rejected("height", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out width, height, margin-top and margin-bottom, and float",
  }, {
    code: "a { display: inline; min-height: 100px; }",
    message: messages.rejected("min-height", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out min-height",
  }, {
    code: "a { display: inline; max-height: 100px; }",
    message: messages.rejected("max-height", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out max-height",
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
    code: "a { display: inline; overflow: scroll; }",
    message: messages.rejected("overflow", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out overflow",
  }, {
    code: "a { display: inline; overflow-x: scroll; }",
    message: messages.rejected("overflow-x", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out overflow-x",
  }, {
    code: "a { display: inline; overflow-y: scroll; }",
    message: messages.rejected("overflow-y", "display: inline"),
    line: 1,
    column: 22,
    description: "display: inline rules out overflow-x",
  }, {
    code: "a { display: block; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: block"),
    line: 1,
    column: 21,
    description: "display: block rules out baseline",
  }, {
    code: "a { display: flex; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: flex"),
    line: 1,
    column: 20,
    description: "display: flex rules out baseline",
  }, {
    code: "a { display: list-item; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: list-item"),
    line: 1,
    column: 25,
    description: "display: list-item rules out baseline",
  }, {
    code: "a { display: table; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table"),
    line: 1,
    column: 21,
    description: "display: table rules out baseline",
  }, {
    code: "a { display: table-row-group; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-row-group"),
    line: 1,
    column: 31,
    description: "display: table-row-group rules out baseline",
  }, {
    code: "a { display: table-column; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-column"),
    line: 1,
    column: 28,
    description: "display: table-column rules out baseline",
  }, {
    code: "a { display: table-column-group; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-column-group"),
    line: 1,
    column: 34,
    description: "display: table-column-group rules out baseline",
  }, {
    code: "a { display: table-header-group; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-header-group"),
    line: 1,
    column: 34,
    description: "display: table-header-group rules out baseline",
  }, {
    code: "a { display: table-footer-group; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-footer-group"),
    line: 1,
    column: 34,
    description: "display: table-footer-group rules out baseline",
  }, {
    code: "a { display: table-row; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-row"),
    line: 1,
    column: 25,
    description: "display: table-row rules out baseline",
  }, {
    code: "a { display: table-caption; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "display: table-caption"),
    line: 1,
    column: 29,
    description: "display: table-caption rules out baseline",
  }, {
    code: "a { position: absolute; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "position: absolute"),
    line: 1,
    column: 25,
    description: "position: absolute rules out baseline",
  }, {
    code: "a { position: fixed; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "position: fixed"),
    line: 1,
    column: 22,
    description: "position: fixed rules out baseline",
  }, {
    code: "a { float: left; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "float: left"),
    line: 1,
    column: 18,
    description: "float: left rules out baseline",
  }, {
    code: "a { float: right; vertical-align: baseline; }",
    message: messages.rejected("vertical-align", "float: right"),
    line: 1,
    column: 19,
    description: "float: right rules out baseline",
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
  }, {
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
    code: "a { display: table-row; width: 10px; }",
    message: messages.rejected("width", "display: table-row"),
    line: 1,
    column: 25,
    description: "display: table-row rules out width",
  }, {
    code: "a { display: table-row; min-width: 10px; }",
    message: messages.rejected("min-width", "display: table-row"),
    line: 1,
    column: 25,
    description: "display: table-row rules out min-width",
  }, {
    code: "a { display: table-row; max-width: 10px; }",
    message: messages.rejected("max-width", "display: table-row"),
    line: 1,
    column: 25,
    description: "display: table-row rules out max-width",
  }, {
    code: "a { display: table-row-group; width: 10px; }",
    message: messages.rejected("width", "display: table-row-group"),
    line: 1,
    column: 31,
    description: "display: table-row-group rules out width",
  }, {
    code: "a { display: table-row-group; min-width: 10px; }",
    message: messages.rejected("min-width", "display: table-row-group"),
    line: 1,
    column: 31,
    description: "display: table-row-group rules out min-width",
  }, {
    code: "a { display: table-row-group; max-width: 10px; }",
    message: messages.rejected("max-width", "display: table-row-group"),
    line: 1,
    column: 31,
    description: "display: table-row-group rules out max-width",
  }, {
    code: "a { display: table-column; height: 10px; }",
    message: messages.rejected("height", "display: table-column"),
    line: 1,
    column: 28,
    description: "display: table-column rules out height",
  }, {
    code: "a { display: table-column; min-height: 10px; }",
    message: messages.rejected("min-height", "display: table-column"),
    line: 1,
    column: 28,
    description: "display: table-column rules out min-width",
  }, {
    code: "a { display: table-column; max-height: 10px; }",
    message: messages.rejected("max-height", "display: table-column"),
    line: 1,
    column: 28,
    description: "display: table-column rules out max-width",
  }, {
    code: "a { display: table-column-group; height: 10px; }",
    message: messages.rejected("height", "display: table-column-group"),
    line: 1,
    column: 34,
    description: "display: table-column-group rules out height",
  }, {
    code: "a { display: table-column-group; min-height: 10px; }",
    message: messages.rejected("min-height", "display: table-column-group"),
    line: 1,
    column: 34,
    description: "display: table-column-group rules out min-height",
  }, {
    code: "a { display: table-column-group; max-height: 10px; }",
    message: messages.rejected("max-height", "display: table-column-group"),
    line: 1,
    column: 34,
    description: "display: table-column-group rules out max-height",
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
