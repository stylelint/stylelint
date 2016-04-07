import testRule from "../../../testUtils/testRule"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [0],

  accept: [ {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { transform: translate(\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate\n\n(1, 1); }",
  }, {
    code: "a { transform: translate\r\n\r\n(1, 1); }",
  },  {
    code: "a { transform: translate(1, 1)\n\n; }",
  }, {
    code: "a { transform: translate(1, 1)\r\n\r\n; }",
  }, {
    code: "a { transform:\n\ntranslate(1, 1); }",
  }, {
    code: "a { transform:\r\n\r\ntranslate(1, 1); }",
  }, {
    code: "a { background: blah,\n\nfoo; }",
  }, {
    code: "a { background: blah,\r\n\r\nfoo; }",
  }, {
    code: "$list: (value,\n\n\nvalue2)",
    description: "Sass list ignored",
  } ],

  reject: [ {
    code: "a { transform: translate(\n\n1\n,\n1\n); }",
    message: messages.rejected,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(\r\n\r\n1\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(\n1\n\n,\n1\n); }",
    message: messages.rejected,
    line: 2,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n\n1\n); }",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n1\r\n); }",
    message: messages.rejected,
    line: 3,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n); }",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n); }",
    message: messages.rejected,
    line: 4,
    column: 3,
  } ],
})

testRule(rule, {
  ruleName,
  config: [1],

  accept: [ {
    code: "a { transform: translate(\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n); }",
  } ],

  reject: [ {
    code: "a { transform: translate(\n\n\n1\n,\n1\n); }",
    message: messages.rejected,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(\r\n\r\n\r\n1\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(\n1\n\n\n,\n1\n); }",
    message: messages.rejected,
    line: 2,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n\n\n1\n); }",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n\r\n1\r\n); }",
    message: messages.rejected,
    line: 3,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n\n); }",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n\r\n); }",
    message: messages.rejected,
    line: 4,
    column: 3,
  } ],
})

testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: "a { transform: translate(\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n); }",
  }, {
    code: "a { transform: translate(\n\n\n1\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n\r\n\r\n1\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n\n\n,\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n\r\n,\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n\n\n1\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n\r\n1\r\n); }",
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n\n); }",
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n\r\n); }",
  } ],

  reject: [ {
    code: "a { transform: translate(\n\n\n\n1\n,\n1\n); }",
    message: messages.rejected,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(\r\n\r\n\r\n\r\n1\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(\n1\n\n\n\n,\n1\n); }",
    message: messages.rejected,
    line: 2,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n\r\n\r\n\r\n,\r\n1\r\n); }",
    message: messages.rejected,
    line: 2,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n\n\n\n1\n); }",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n\r\n\r\n\r\n1\r\n); }",
    message: messages.rejected,
    line: 3,
    column: 3,
  }, {
    code: "a { transform: translate(\n1\n,\n1\n\n\n\n); }",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a { transform: translate(\r\n1\r\n,\r\n1\r\n\r\n\r\n\r\n); }",
    message: messages.rejected,
    line: 4,
    column: 3,
  } ],
})
