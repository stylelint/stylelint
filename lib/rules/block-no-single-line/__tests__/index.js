"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning for blockNoSingleLine", () => {
  const config = {
    rules: {
      "block-no-single-line": true,
    },
  }

  const code = "a { foo: bar; }"

  return stylelint({ code, config }).then(output => {
    const result = output.results[0]
    expect(result.deprecations.length).toEqual(1)
    expect(result.deprecations[0].text).toEqual("\'block-no-single-line\' has been deprecated and in 8.0 will be removed. Instead use \'block-opening-brace-newline-after\' and \'block-closing-brace-newline-before\' with the \"always\" option.")
    expect(result.deprecations[0].reference).toEqual("http://stylelint.io/user-guide/rules/block-no-single-line/")
    expect(result.warnings.length).toEqual(1)
    expect(result.warnings[0].text).toEqual("Unexpected single-line block (block-no-single-line)")
  })
})

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { }",
  }, {
    code: "a {\ncolor: pink; }",
    description: "multi-line declaration block with newline at start",
  }, {
    code: "a {\r\ncolor: pink; }",
    description: "multi-line declaration block with CRLF at start",
  }, {
    code: "a { color: pink;\n}",
    description: "multi-line declaration block with newline at end",
  }, {
    code: "a { color: pink;\r\n}",
    description: "multi-line declaration block with CRLF at end",
  }, {
    code: "a { color: pink;\nbackground: orange; }",
    description: "multi-line declaration block with newline in middle",
  }, {
    code: "a { color: pink;\r\nbackground: orange; }",
    description: "multi-line declaration block with CRLF in middle",
  }, {
    code: "@media (color) {\na { color: pink;\r\nbackground: orange; }\n}",
    description: "multi-line blocks",
  }, {
    code: "a {\n@media (color) { color: pink;\r\nbackground: orange; }\n}",
    description: "multi-line blocks with the at-rule nested",
  } ],

  reject: [ {
    code: "a { color: pink; }",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a { color: pink; top: 1px; }",
    description: "single-line rule with two declarations",
    message: messages.rejected,
    line: 1,
    column: 3,
  }, {
    code: "a,\nb { color: pink; }",
    description: "multi-line rule with single-line declaration block",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "@media print {\na { color: pink; }}",
    description: "single-line rule within multi-line at-rule",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "@media print {\r\na { color: pink; }}",
    description: "single-line rule within multi-line at-rule and CRLF",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a {\r\n@media print { color: pink; }}",
    description: "single-line at-rule within multi-line rule and CRLF",
    message: messages.rejected,
    line: 2,
    column: 14,
  }, {
    code: "@rule { a:b }",
    description: "single-line @rule",
    message: messages.rejected,
    line: 1,
    column: 7,
  } ],
})
