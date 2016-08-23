import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [20],

  accept: [ {
    code: "a { color: 0; }",
  }, {
    code: "a {  color   : 0 ; }",
  }, {
    code: "a { color: 0;\n  top: 0; }",
  }, {
    code: "@media print {\n  a {\n    color: pink;\n }\n}",
  }, {
    code: "a {\n background: url(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n background: uRl(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n background: URL(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n  background: url(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a {\n  background: uRl(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a {\n  background: URL(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a { margin: 0 2px; }\r\n",
  }, {
    code: "a { margin: 0 2px; }\r\na { margin: 4px 0; }\n",
  } ],

  reject: [ {
    code: "a {   color   : 0  ;}",
    message: messages.expected(20),
    line: 1,
    column: 21,
  }, {
    code: "a { color: 0; top: 0; }",
    message: messages.expected(20),
    line: 1,
    column: 23,
  }, {
    code: "a { color: 0;\n  top: 0; bottom: 0; right: 0; \n  left: 0; }",
    message: messages.expected(20),
    line: 2,
    column: 31,
  }, {
    code: "a { color: 0;\n  top: 0;\n  left: 0; bottom: 0; right: 0; }",
    message: messages.expected(20),
    line: 3,
    column: 33,
  }, {
    code: "@media print {\n  a {\n    color: pink; background: orange;\n }\n}",
    message: messages.expected(20),
    line: 3,
    column: 36,
  }, {
    code: "@media (min-width: 30px) and screen {}",
    message: messages.expected(20),
    line: 1,
    column: 38,
  }, {
    code: "a { margin: 0 2rem; }\r\n",
    message: messages.expected(20),
    line: 1,
    column: 21,
  } ],
})

testRule(rule, {
  ruleName,
  config: [30],

  accept: [{
    code: "a { color: 0;\n  top: 0; left: 0; right: 0; \n  bottom: 0; }",
  }],

  reject: [{
    code: "a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }",
    message: messages.expected(30),
    line: 2,
    column: 47,
  }],
})

testRule(rule, {
  ruleName,
  config: [ 20, { ignore: "non-comments" } ],

  accept: [ {
    code: "a { color: 0; top: 0; bottom: 0; }",
  }, {
    code: "a { color: 0; top: 0; /* too long comment here */ bottom: 0; }",
  }, {
    code: "/* short nuff */",
  }, {
    code: "/* short\nnuff */",
  }, {
    code: "/**\n * each line\n * short nuff\n */",
  }, {
    code: "a { color: 0; }\n/* short nuff */\nb {}",
  }, {
    code: "a {}\n/**\n * each line\n * short nuff\n */\nb {}",
  }, {
    code: "a { /* this comment is too long for the max length */ }",
  } ],

  reject: [ {
    code: "/* comment that is too long */",
    message: messages.expected(20),
    line: 1,
    column: 30,
  }, {
    code: "a {}\n  /* comment that is too long */\nb {}",
    message: messages.expected(20),
    line: 2,
    column: 32,
  }, {
    code: "/* this comment is too long for the max length */",
    message: messages.expected(20),
    line: 1,
    column: 49,
  }, {
    code: "a {}\n/**\n * each line\n * short nuff\n * except this one which is too long\n */\nb {}",
    message: messages.expected(20),
    line: 5,
    column: 36,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 20, { ignore: "comments" } ],

  accept: [ {
    code: "/* comment that is too long */",
  }, {
    code: "       /* comment that is too long */",
  }, {
    code: "/* short */ a { color: 0; }",
  }, {
    code: "a {}\n/* comment that is too long\n*/ a { color: 0; top: 0; }",
  }, {
    code: "/**\n comment that is too long #1\n comment that is too long #2 */",
  } ],

  reject: [ {
    code: "a { color: 0; } /* comment that is too long */",
    message: messages.expected(20),
    line: 1,
    column: 46,
  }, {
    code: "a { /* this comment is too long for the max length */ }",
    message: messages.expected(20),
    line: 1,
    column: 55,
  } ],
})
