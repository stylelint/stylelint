"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "@import url(x.css)"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: "@media print { a { color: pink; } }"
    },
    {
      code: "a {{ &:hover { color: pink; }}}"
    },
    {
      code: "a {\n&:hover { color: pink; }}"
    }
  ],

  reject: [
    {
      code: "a{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 1
    },
    {
      code: "a  { color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n{ color: pink; }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "@media print\n{ a { color: pink; } }",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media print { a\n{ color: pink; } }",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always", { ignoreAtRules: ["for"] }],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "@for ...\n{ color: pink; }"
    },
    {
      code: "@for ...\r\n{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always", { ignoreAtRules: "/fo/" }],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "@for ...\n{ color: pink; }"
    },
    {
      code: "@for ...\r\n{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a{ color: pink; }"
    },
    {
      code: "@media print{ a{ color: pink; } }"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "a  { color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n{ color: pink; }",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 1,
      column: 2
    },
    {
      code: "@media print { a{ color: pink; } }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media print{ a { color: pink; } }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 16
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "@media print { a { color: pink; } }"
    },
    {
      code: "a{ color:\npink; }"
    },
    {
      code: "@media print { a{ color:\npink; } }"
    },
    {
      code: "@media print{ a { color:\npink; } }"
    },
    {
      code: "@media print{\na { color: pink; } }"
    }
  ],

  reject: [
    {
      code: "a{ color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 1
    },
    {
      code: "a  { color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n{ color: pink; }",
      description: "CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "@media print\n{ a { color: pink; } }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 13
    },
    {
      code: "@media print { a\n{ color: pink; } }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 17
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "a{ color: pink; }"
    },
    {
      code: "@media print{ a{ color: pink; } }"
    },
    {
      code: "a { color:\npink; }"
    },
    {
      code: "a { color:\r\npink; }",
      description: "CRLF"
    },
    {
      code: "@media print { a { color:\npink; } }"
    },
    {
      code: "@media print{ a{ color:\npink; } }"
    },
    {
      code: "@media print {\na{ color: pink; } }"
    },
    {
      code: "@media print{\na{ color: pink; } }"
    },
    {
      code: "@media print{\r\na{ color: pink; } }",
      description: "CRLF"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a  { color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n{ color: pink; }",
      description: "CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "@media print { a{ color: pink; } }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 13
    },
    {
      code: "@media print{ a { color: pink; } }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 16
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: "a { color: pink;\nbackground: orange; }"
    },
    {
      code: "@media print {\na { color: pink;\nbackground: orange } }"
    },
    {
      code: "@media print {\r\na { color: pink;\r\nbackground: orange } }",
      description: "CRLF"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: "@media print { a { color: pink; } }"
    },
    {
      code: "a{ color: pink; }"
    },
    {
      code: "a  { color: pink; }"
    },
    {
      code: "a\t{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a{ color: pink;\nbackground: orange; }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 1
    },
    {
      code: "a  { color: pink;\nbackground: orange; }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink;\nbackground: orange; }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink;\nbackground: orange; }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\r\n{ color: pink;\r\nbackground: orange; }",
      description: "CRLF",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "@media print\n{\na { color: pink;\nbackground: orange; } }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 13
    },
    {
      code: "@media print { a\n{ color: pink;\nbackground: orange; } }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 17
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [
    {
      code: "a{ color: pink;\nbackground: orange; }"
    },
    {
      code: "@media print{\na{ color: pink;\nbackground: orange } }"
    },
    {
      code: "@media print{\r\na{ color: pink;\r\nbackground: orange } }",
      description: "CRLF"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: "@media print { a { color: pink; } }"
    },
    {
      code: "a{ color: pink; }"
    },
    {
      code: "a  { color: pink; }"
    },
    {
      code: "a\t{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink;\nbackground: orange; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a  { color: pink;\nbackground: orange; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 3
    },
    {
      code: "a\t{ color: pink;\nbackground: orange; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a\n{ color: pink;\nbackground: orange; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "@media print\n{\na{ color: pink;\nbackground: orange; } }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 13
    },
    {
      code: "@media print{ a\n{ color: pink;\nbackground: orange; } }",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 16
    },
    {
      code: "@media print{ a\r\n{ color: pink;\r\nbackground: orange; } }",
      description: "CRLF",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 16
    }
  ]
});
