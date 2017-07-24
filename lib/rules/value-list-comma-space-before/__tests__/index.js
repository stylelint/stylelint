"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a { background-size: 0 , 0; }"
    },
    {
      code: "a { background-size: 0 ,0; }"
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
      code: "a { background-size: 0, 0; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0  , 0; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: "a { background-size: 0\n, 0; }",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { background-size: 0\r\n, 0; }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { background-size: 0\t, 0; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { background-size: 0, 0; }"
    },
    {
      code: "a { background-size: 0,0; }"
    },
    {
      code: 'a::before { content: "foo ,bar ,baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1 ,1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0 , 0; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 24
    },
    {
      code: "a { background-size: 0  , 0; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: "a { background-size: 0\n, 0; }",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { background-size: 0\r\n, 0; }",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { background-size: 0\t, 0; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a { background-size: 0 , 0; }"
    },
    {
      code: "a { background-size: 0 ,0; }"
    },
    {
      code: "a { background-size: 0 ,0;\n}",
      description: "single-line list, multi-line block"
    },
    {
      code: "a { background-size: 0 ,0;\r\n}",
      description: "single-line list, multi-line block with CRLF"
    },
    {
      code: "a { background-size: 0,\n0; }",
      description: "ignores multi-line list"
    },
    {
      code: "a { background-size: 0,\r\n0; }",
      description: "ignores multi-line list with CRLF"
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
      code: "a { background-size: 0, 0; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, 0;\n}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0, 0;\r\n}",
      description: "CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 23
    },
    {
      code: "a { background-size: 0  , 0; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 25
    },
    {
      code: "a { background-size: 0\t, 0; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "a { background-size: 0, 0; }"
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
      code: "a { background-size: 0 ,\n0; }",
      description: "ignores multi-line list"
    },
    {
      code: "a { background-size: 0 ,\r\n0; }",
      description: "ignores multi-line list with CRLF"
    },
    {
      code: 'a::before { content: "foo ,bar ,baz"; }',
      description: "strings"
    },
    {
      code: "a { transform: translate(1 ,1); }",
      description: "function arguments"
    }
  ],

  reject: [
    {
      code: "a { background-size: 0 , 0; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 24
    },
    {
      code: "a { background-size: 0 , 0;\n}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 24
    },
    {
      code: "a { background-size: 0 , 0;\r\n}",
      description: "CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 24
    },
    {
      code: "a { background-size: 0  , 0; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 25
    },
    {
      code: "a { background-size: 0\t, 0; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 24
    }
  ]
});
