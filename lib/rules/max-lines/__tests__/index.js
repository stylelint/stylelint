"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [1],

  accept: [
    {
      code: ".a { color: red; } .b { color: green; }",
      description: "count = 1"
    }
  ],

  reject: [
    {
      code: ".a { color: red; }\r\n.b { color: green; }",
      description: "count = 2 (CRLF)",
      message: messages.expected(1, 2)
    },
    {
      code: ".a { color: red; }\n.b { color: green; }",
      description: "count = 2 (LF)",
      message: messages.expected(1, 2)
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: "\r\n",
      description: "count = 2 (CRLF)"
    },
    {
      code: "\n",
      description: "count = 2 (LF)"
    },
    {
      code: ".a { color: red; } .b { color: green; }",
      description: "count = 1"
    },
    {
      code: ".a { color: red; }\r\n.b { color: green; }",
      description: "count = 2 (CRLF)"
    },
    {
      code: ".a { color: red; }\n.b { color: green; }",
      description: "count = 2 (LF)"
    }
  ],

  reject: [
    {
      code: "\r\n\r\n",
      description: "count = 3 (CRLF)",
      message: messages.expected(2, 3)
    },
    {
      code: "\n\n",
      description: "count = 3 (LF)",
      message: messages.expected(2, 3)
    },
    {
      code: "\r\n\n",
      description: "count = 3 (CRLF & LF)",
      message: messages.expected(2, 3)
    },
    {
      code: "\n\r\n",
      description: "count = 3 (LF & CRLF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a { color: red; }\r\n.b { color: green; }\r\n.c { color: blue; }",
      description: "count = 3 (CRLF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a { color: red; }\n.b { color: green; }\n.c { color: blue; }",
      description: "count = 3 (LF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a { color: red; }\r\n.b { color: green; }\n.c { color: blue; }",
      description: "count = 3 (CRLF & LF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a {\r\ncolor: red;\r\n}",
      description: "count = 3 (CRLF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a {\ncolor: red;\n}",
      description: "count = 3 (LF)",
      message: messages.expected(2, 3)
    },
    {
      code: ".a {\r\ncolor: red;\n}",
      description: "count = 3 (CRLF & LF)",
      message: messages.expected(2, 3)
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],
  syntax: "css-in-js",

  accept: [
    {
      code: "export const a = styled.div` color: red; `;",
      description: "count = 1"
    }
  ],

  reject: [
    {
      code: "export const a = styled.div`\r\ncolor: red;\r\n`;",
      description: "count = 3 (CRLF)",
      message: messages.expected(1, 3)
    },
    {
      code: "export const a = styled.div`\ncolor: red;\n`;",
      description: "count = 3 (LF)",
      message: messages.expected(1, 3)
    }
  ]
});
