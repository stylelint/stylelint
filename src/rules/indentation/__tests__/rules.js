/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName: ruleName,
  config: [2],

  accept: [{
    code: "/* anything\n" +
    "    goes\n" +
    "\t\t\twithin a comment */\n" +
    "",
  }, {
    code: "a { top: 0; } b { top: 1px; }",
  }, {
    code: "a {\n" +
    "  top: 0;\n" +
    "}\n" +
    "b { top: 1px; bottom: 4px; }",
  }, {
    code: "a {\n" +
    "  top: 0;\n" +
    "} b { top: 1px; }",
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a { color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    "} b { top: 0; }",
  }, {
    code: "a { color: pink;\n" +
    "  top: 0; background: orange;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "b {\n" +
    "  color: orange\n" +
    "}",
  }, {
    code: "a {\n" +
    "  color: pink;}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "    bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "    bottom left\n" +
    "  ;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "\n" +
    "    bottom left\n" +
    "  ;\n" +
    "}",

    description: "weird empty line",
  }, {
    code: "a {\n" +
    "  *top: 1px;\n" +
    "}",
  }, {
    code: "* { top: 0; }",
  }, {
    code: "@media print {\n" +
    "  * { color: pink; }\n" +
    "}",
  }],

  reject: [{
    code: "\ta {\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("0 spaces"),
    line: 1,
    column: 2,
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    "  }",

    message: messages.expected("0 spaces"),
    line: 3,
    column: 3,
  }, {
    code: "a,\n" +
    "b {\n" +
    "  color: pink;\n" +
    "  }",

    message: messages.expected("0 spaces"),
    line: 4,
    column: 3,
  }, {
    code: "a { color: pink;\n" +
    "  }",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }, {
    code: "a {\n" +
    "  color: pink\n" +
    "}\n" +
    " b {\n" +
    "  color: orange\n" +
    "}",

    message: messages.expected("0 spaces"),
    line: 4,
    column: 2,
  }, {
    code: "a {\n" +
    "  color: pink\n" +
    "}\n" +
    "b {\n" +
    "  color: orange\n" +
    " }",

    message: messages.expected("0 spaces"),
    line: 6,
    column: 2,
  }, {
    code: "a {\n" +
    "color: pink;\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 1,
  }, {
    code: "a {\n" +
    "\tcolor: pink;\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 2,
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    " background: orange;\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 3,
    column: 2,
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "  top right,\n" +
    "    bottom left;\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 1,
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "  bottom left;\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("4 spaces"),
    line: 4,
    column: 1,
  }, {
    code: "@media print {\n" +
    "   * { color: pink; }\n" +
    "}",

    message: messages.expected("2 spaces"),
  }],
})

testRule(rule, {
  ruleName: ruleName,
  config: ["tab"],

  accept: [{
    code: "",
  }, {
    code: "a {color: pink;}",
  }, {
    code: "a {\n" +
    "\tcolor: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "\tcolor: pink;\n" +
    "}\n" +
    "\n" +
    "b {\n" +
    "\tcolor: orange\n" +
    "}",
  }, {
    code: "a {\n" +
    "\tcolor: pink;}",
  }],

  reject: [{
    code: "\ta {\n" +
    "\tcolor: pink;\n" +
    "}",

    message: messages.expected("0 tabs"),
    line: 1,
    column: 2,
  }, {
    code: "a {\n" +
    "\tcolor: pink;\n" +
    "  }",

    message: messages.expected("0 tabs"),
    line: 3,
    column: 3,
  }, {
    code: "a {\n" +
    "\tcolor: pink\n" +
    "}\n" +
    " b {\n" +
    "\tcolor: orange\n" +
    "}",

    message: messages.expected("0 tabs"),
    line: 4,
    column: 2,
  }, {
    code: "a {\n" +
    "\tcolor: pink\n" +
    "}\n" +
    "b {\n" +
    "\tcolor: orange\n" +
    " }",

    message: messages.expected("0 tabs"),
    line: 6,
    column: 2,
  }, {
    code: "a {\n" +
    "color: pink;\n" +
    "}",

    message: messages.expected("1 tab"),
    line: 2,
    column: 1,
  }, {
    code: "a {\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("1 tab"),
    line: 2,
    column: 3,
  }, {
    code: "a {\n" +
    "\tcolor: pink;\n" +
    " background: orange;\n" +
    "}",

    message: messages.expected("1 tab"),
    line: 3,
    column: 2,
  }, {
    code: "a { color: pink;\n" +
    "top: 0; background: orange;\n" +
    "}",

    message: messages.expected("1 tab"),
    line: 2,
    column: 1,
  }],
})

testRule(rule, {
  ruleName: ruleName,
  config: [2, { except: ["value"] }],

  accept: [{
    code: "a {\n" +
    "  background-position: top left, top right, bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "  top right,\n" +
    "  bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }],

  reject: [{
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "  bottom left;\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 3,
    column: 1,
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "  top right,\n" +
    "    bottom left;\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("2 spaces"),
    line: 4,
    column: 1,
  }],
})

testRule(rule, {
  ruleName: ruleName,
  config: [2, { ignore: ["value"] }],

  accept: [{
    code: "a {\n" +
    "  background-position: top left, top right, bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "  top right,\n" +
    "  bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "    top right,\n" +
    "  bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }, {
    code: "a {\n" +
    "  background-position: top left,\n" +
    "  top right,\n" +
    "    bottom left;\n" +
    "  color: pink;\n" +
    "}",
  }],

  reject: [{
    code: "\ta {\n" +
    "  color: pink;\n" +
    "}",

    message: messages.expected("0 spaces"),
    line: 1,
    column: 2,
  }],
})
