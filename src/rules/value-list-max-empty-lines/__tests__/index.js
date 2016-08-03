import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [0],

  accept: [ {
    code: "a { padding: 10px 10px 10px 10px }",
  }, {
    code: "a { padding:\n10px 10px 10px 10px }",
  }, {
    code: "a { padding:\n\n10px 10px 10px 10px }",
  }, {
    code: "a { padding:\r\n10px 10px 10px 10px }",
  },  {
    code: "a { padding:\r\n\r\n10px 10px 10px 10px }",
  }, {
    code: "a { padding: 10px 10px 10px 10px\n }",
  }, {
    code: "a { padding: 10px 10px 10px 10px\r\n }",
  }, {
    code: "a { padding: 10px 10px 10px 10px\n\n }",
  }, {
    code: "a { padding: 10px 10px 10px 10px\r\n\r\n }",
  }, {
    code: "a { padding: 10px\n10px\n10px\n10px }",
  }, {
    code: "a { padding: 10px\r\n10px\r\n10px\r\n10px }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6, 0 2px 5px #000; }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\n0 2px 5px #000; }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\r\n0 2px 5px #000; }",
  } ],

  reject: [ {
    code: "a { padding: 10px\n\n10px 10px 10px }",
    message: messages.expected(0),
    line: 1,
    column: 9,
  }, {
    code: "a { padding: 10px\r\n\r\n10px 10px 10px }",
    message: messages.expected(0),
    line: 1,
    column: 9,
  }, {
    code: "a { padding: 10px 10px 10px\n\n10px }",
    message: messages.expected(0),
    line: 1,
    column: 19,
  }, {
    code: "a { padding: 10px 10px 10px\r\n\r\n10px }",
    message: messages.expected(0),
    line: 1,
    column: 19,
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\n\n0 2px 5px #000; }",
    message: messages.expected(0),
    line: 1,
    column: 27,
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\r\n\r\n0 2px 5px #000; }",
    message: messages.expected(0),
    line: 1,
    column: 27,
  } ],
})

testRule(rule, {
  ruleName,
  config: [1],

  accept: [ {
    code: "a { padding: 10px\n10px\n10px\n10px }",
  }, {
    code: "a { padding: 10px\r\n10px\r\n10px\r\n10px }",
  }, {
    code: "a { padding: 10px\n\n10px\n\n10px\n\n10px }",
  }, {
    code: "a { padding: 10px\r\n\r\n10px\r\n\r\n10px\r\n\r\n10px }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6, 0 2px 5px #000; }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\n\n0 2px 5px #000; }",
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\r\n\r\n0 2px 5px #000; }",
  } ],

  reject: [ {
    code: "a { padding: 10px\n\n\n10px 10px 10px }",
    message: messages.expected(1),
    line: 1,
    column: 9,
  }, {
    code: "a { padding: 10px\r\n\r\n\r\n10px 10px 10px }",
    message: messages.expected(1),
    line: 1,
    column: 9,
  }, {
    code: "a { padding: 10px 10px 10px\n\n\n10px }",
    message: messages.expected(1),
    line: 1,
    column: 19,
  }, {
    code: "a { padding: 10px 10px 10px\r\n\r\n\r\n10px }",
    message: messages.expected(1),
    line: 1,
    column: 19,
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\n\n\n0 2px 5px #000; }",
    message: messages.expected(1),
    line: 1,
    column: 27,
  }, {
    code: "a { box-shadow: inset 0 2px 0 #dcffa6,\r\n\r\n\r\n0 2px 5px #000; }",
    message: messages.expected(1),
    line: 1,
    column: 27,
  } ],
})
