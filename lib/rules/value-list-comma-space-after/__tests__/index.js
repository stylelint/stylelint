"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],
  fix: true,

  accept: [
    {
      code: "a { background-size: 0 , 0; }"
    },
    {
      code: "a { background-size: 0, 0; }"
    },
    {
      code: 'a::before { content: "foo,bar,baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1,1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0,0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size:\n\t0,  0; }",
      fixed: "a { background-size:\n\t0, 0; }",
      message: messages.expectedAfter(),
      line: 2,
      column: 3
    },
    {
      code: "a { background-size: 0,\n0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\r\n0; }",
      fixed: "a { background-size: 0, 0; }",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\t0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,/*1*/0; }",
      fixed: "a { background-size: 0, /*1*/0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,0,0,0; }",
      fixed: "a { background-size: 0, 0, 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: ":root { --variable: 0,0; }",
      fixed: ":root { --variable: 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 22
    },
    {
      code: "a { pr,op: 0,0; }",
      fixed: "a { pr,op: 0, 0; }",
      description: "edge case",
      message: messages.expectedAfter(),
      line: 1,
      column: 7
    },
    {
      code: "a{b: 0,0,0,0,0,0,0,0; }",
      fixed: "a{b: 0, 0, 0, 0, 0, 0, 0, 0; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 7
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  fix: true,

  accept: [
    {
      code: "a { background-size: 0 ,0; }"
    },
    {
      code: "a { background-size: 0,0; }"
    },
    {
      code: 'a::before { content: "foo, bar, baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1, 1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0, 0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,  0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\n0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\r\n0; }",
      fixed: "a { background-size: 0,0; }",
      description: "CRLF",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\t0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, /*1*/ 0; }",
      fixed: "a { background-size: 0,/*1*/ 0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, 0, 0, 0 ; }",
      fixed: "a { background-size: 0,0,0,0 ; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 23
    },
    {
      code: ":root { --variable: 0, 0; }",
      fixed: ":root { --variable: 0,0; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 22
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],
  fix: true,

  accept: [
    {
      code: "a { background-size: 0 , 0; }"
    },
    {
      code: "a { background-size: 0, 0; }"
    },
    {
      code: "a { background-size: 0, 0;\n}",
      description: "single-line list, multi-line block"
    },
    {
      code: "a { background-size: 0, 0;\r\n}",
      description: "single-line list, multi-line block with CRLF"
    },
    {
      code: "a { background-size: 0\n,0}",
      description: "ignores multi-line"
    },
    {
      code: "a { background-size: 0\r\n,0}",
      description: "ignores multi-line with CRLF"
    },
    {
      code: 'a::before { content: "foo,bar,baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1,1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0,0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,0;\n}",
      fixed: "a { background-size: 0, 0;\n}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,0;\r\n}",
      fixed: "a { background-size: 0, 0;\r\n}",
      description: "CRLF",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,  0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\t0; }",
      fixed: "a { background-size: 0, 0; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 23
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],
  fix: true,

  accept: [
    {
      code: "a { background-size: 0 ,0; }"
    },
    {
      code: "a { background-size: 0,0; }"
    },
    {
      code: "a { background-size: 0,0;\n}",
      description: "single-line list, multi-line block"
    },
    {
      code: "a { background-size: 0,0;\r\n}",
      description: "single-line list, multi-line block with CRLF"
    },
    {
      code: "a { background-size: 0\n,  0}",
      description: "ignores multi-line values"
    },
    {
      code: "a { background-size: 0\r\n,  0}",
      description: "ignores multi-line values with CRLF"
    },
    {
      code: 'a::before { content: "foo, bar, baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1, 1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0, 0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, 0;\n}",
      fixed: "a { background-size: 0,0;\n}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, 0;\r\n}",
      fixed: "a { background-size: 0,0;\r\n}",
      description: "CRLF",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,  0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0,\t0; }",
      fixed: "a { background-size: 0,0; }",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 23
    }
  ]
});
