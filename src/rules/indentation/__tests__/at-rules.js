const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "  }\n" + "}",
  }, {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "  }\n" + "}\n" + "\n" + "@media screen {\n" + "  b { color: orange; }\n" + "}",
  }, {
    code: "@media print {\r\n" + "  a {\r\n" + "    color: pink;\r\n" + "  }\r\n" + "}",
  }, {
    code: "@media print {\r\n" + "  a {\r\n" + "    color: pink;\r\n" + "  }\r\n" + "}\r\n" + "\r\n" + "@media screen {\r\n" + "  b { color: orange; }\r\n" + "}",
  } ],

  reject: [ {
    code: "\n" + "  @media print {\n" + "  a {\n" + "    color: pink;\n" + "  }\n" + "}",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }, {
    code: "@media print {\n" + "a {\n" + "    color: pink;\n" + "  }\n" + "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 1,
  }, {
    code: "@media print {\n" + "  a {\n" + "  color: pink;\n" + "  }\n" + "}",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 3,
  }, {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "}\n" + "}",

    message: messages.expected("2 spaces"),
    line: 4,
    column: 1,
  }, {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "  }\n" + "\t}",

    message: messages.expected("0 spaces"),
    line: 5,
    column: 2,
  }, {
    code: "\r\n" + "  @media print {\r\n" + "  a {\r\n" + "    color: pink;\r\n" + "  }\r\n" + "}",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }, {
    code: "@media print {\r\n" + "a {\r\n" + "    color: pink;\r\n" + "  }\r\n" + "}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 1,
  }, {
    code: "@media print {\r\n" + "  a {\r\n" + "  color: pink;\r\n" + "  }\r\n" + "}",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 3,
  }, {
    code: "@media print {\r\n" + "  a {\r\n" + "    color: pink;\r\n" + "}\r\n" + "}",

    message: messages.expected("2 spaces"),
    line: 4,
    column: 1,
  }, {
    code: "@media print {\r\n" + "  a {\r\n" + "    color: pink;\r\n" + "  }\r\n" + "\t}",

    message: messages.expected("0 spaces"),
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "tab", { except: ["block"] } ],

  accept: [ {
    code: "@media print {\n" + "\n" + "a {\n" + "\tcolor: pink;\n" + "}\n" + "\n" + "}",
  }, {
    code: "@media print,\n" + "\t(-webkit-min-device-pixel-ratio: 1.25),\n" + "\t(min-resolution: 120dpi) {}",
  } ],

  reject: [ {
    code: "@media print {\n" + "\n" + "\ta {\n" + "\tcolor: pink;\n" + "}\n" + "\n" + "}",

    message: messages.expected("0 tabs"),
    line: 3,
    column: 2,
  }, {
    code: "@media print {\n" + "\n" + "a {\n" + "color: pink;\n" + "}\n" + "\n" + "}",

    message: messages.expected("1 tab"),
    line: 4,
    column: 1,
  }, {
    code: "@media print,\n" + "  (-webkit-min-device-pixel-ratio: 1.25),\n" + "\t(min-resolution: 120dpi) {}",

    description: "multi-line at-rule params",
    message: messages.expected("1 tab"),
    line: 2,
    column: 3,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 4, { except: ["param"] } ],

  accept: [{
    code: "@media print,\n" + "(-webkit-min-device-pixel-ratio: 1.25),\n" + "(min-resolution: 120dpi) {}",
  }],

  reject: [{
    code: "@media print,\n" + "  (-webkit-min-device-pixel-ratio: 1.25),\n" + "(min-resolution: 120dpi) {}",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }],
})

testRule(rule, {
  ruleName,
  config: [ 2, { ignore: ["param"] } ],

  accept: [ {
    code: "@media print,\n" + "(-webkit-min-device-pixel-ratio: 1.25),\n" + "(min-resolution: 120dpi) {}",
  }, {
    code: "@media print,\n" + "  (-webkit-min-device-pixel-ratio: 1.25),\n" + "(min-resolution: 120dpi) {}",
  } ],

  reject: [{
    code: "\n" + "  @media print {\n" + "  a {\n" + "    color: pink;\n" + "  }\n" + "}",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }],
})

testRule(rule, {
  ruleName,
  config: [ 2, {
    indentClosingBrace: true,
  } ],

  accept: [ {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "    }\n" + "  }",
  }, {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "    }\n" + "  }\n" + "\n" + "@media screen {\n" + "  b { color: orange; }\n" + "  }",
  } ],

  reject: [ {
    code: "\n" + "@media print {\n" + "  a {\n" + "    color: pink;\n" + "    }\n" + " }",

    message: messages.expected("2 spaces"),
    line: 6,
    column: 2,
  }, {
    code: "@media print {\n" + "  a {\n" + "    color: pink;\n" + "   }\n" + "  }",

    message: messages.expected("4 spaces"),
    line: 4,
    column: 4,
  } ],
})
