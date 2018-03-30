"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [
    {
      code: "@import url(x.css)"
    },
    {
      code: "a\n{ color: pink; }"
    },
    {
      code: "a\r\n{ color: pink; }",
      description: "CRLF"
    },
    {
      code: "a\n\n{ color: pink; }"
    },
    {
      code: "a\r\n\r\n{ color: pink; }",
      description: "CRLF"
    },
    {
      code: "a\n{color: pink; }"
    },
    {
      code: "@media print\n{ a\n{ color: pink; } }"
    },
    {
      code: "@media print\r\n{ a\r\n{ color: pink; } }",
      description: "CRLF"
    },
    {
      code: "@media print\n{a\n{color: pink; } }"
    },
    {
      code: "@media print\n\t{a\n\t\t{color: pink; } }",
      description: "indentation after the newline before the opening braces"
    },
    {
      code:
        "@media print\n\t{a\n\t\t{color: pink;\n\t\t&:hover\n\t\t\t{\n\t\t\t\tcolor:black;} } }",
      description:
        "3 level deep indentation after the newline before the opening braces"
    },
    {
      code:
        "@media print\r\n\t{a\r\n\t\t{color: pink;\r\n\t\t&:hover\r\n\t\t\t{\r\n\t\t\t\tcolor:black;} } }",
      description:
        "3 level deep indentation after the newline before the opening braces and CRLF"
    },
    {
      code: "a\n{ &:hover\n{ color: pink; }}"
    },
    {
      code: "a\n{ color: red; &:hover\n{ color: pink; }}"
    },
    {
      code: "a /* x */\n{ color: pink; }",
      description: "end-of-line comment after selector"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 2
    },
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
      code: "@media print { a\n{ color: pink; } }",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media print { a\r\n{ color: pink; } }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 13
    },
    {
      code: "@media print\n{ a { color: pink; } }",
      message: messages.expectedBefore(),
      line: 2,
      column: 4
    },
    {
      code: "@media print{ a\n{ color: pink; } }",
      message: messages.expectedBefore(),
      line: 1,
      column: 12
    },
    {
      code: "@media print{ a\r\n{ color: pink; } }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 12
    },
    {
      code: "@media print\n{ a{ color: pink; } }",
      message: messages.expectedBefore(),
      line: 2,
      column: 3
    },
    {
      code: "a\n/* foo */{ color: pink; }",
      message: messages.expectedBefore(),
      line: 2,
      column: 9
    },
    {
      code: "a\r\n/* foo */{ color: pink; }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 2,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a\n{ color: pink; }"
    },
    {
      code: "a\n{color: pink; }"
    },
    {
      code: "@media print\n{ a\n{ color: pink; } }"
    },
    {
      code: "@media print\r\n{ a\r\n{ color: pink; } }",
      description: "CRLF"
    },
    {
      code: "@media print\n{a\n{color: pink; } }"
    },
    {
      code: "a{ color: pink;\nbackground:orange; }"
    },
    {
      code: "@media print { a{ color: pink;\nbackground:orange; } }"
    },
    {
      code: "@media print{ a { color: pink;\nbackground:orange; } }"
    },
    {
      code: "@media print{\na\n{ color: pink; } }"
    },
    {
      code: "@media print{\r\na\r\n{ color: pink; } }",
      description: "CRLF"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 2
    },
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
      code: "@media print\n{ a { color: pink; } }",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 4
    },
    {
      code: "@media print\n{ a{ color: pink; } }",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 3
    },
    {
      code: "@media print\r\n{ a{ color: pink; } }",
      description: "CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 3
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
      code: "a{color: pink; }"
    },
    {
      code: "@media print{ a{ color: pink; } }"
    },
    {
      code: "@media print{a{color: pink; } }"
    },
    {
      code: "a\n{ color: pink;\nbackground:orange; }"
    },
    {
      code: "a\r\n{ color: pink;\r\nbackground:orange; }",
      description: "CRLF"
    },
    {
      code: "@media print { a\n{ color: pink;\nbackground:orange; } }"
    },
    {
      code: "@media print{ a\n{ color: pink;\nbackground:orange; } }"
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
      code: "@media print\n{ a\n{ color: pink; } }",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 4
    },
    {
      code: "@media print\r\n{ a\r\n{ color: pink; } }",
      description: "CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 4
    },
    {
      code: "@media print { a\n{ color: pink; } }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 17
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: "a\n{ color: pink;\nbackground: orange; }"
    },
    {
      code: "a\r\n{ color: pink;\nbackground: orange; }",
      description: "CRLF"
    },
    {
      code: "@media print\n{\na\n{ color: pink;\nbackground: orange } }"
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
    },
    {
      code: "a /* foo */\n  {\n    color: pink;\n  }"
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
      code: "a { color: pink;\nbackground: orange; }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a { color: pink;\r\nbackground: orange; }",
      description: "CRLF",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "@media print\n{\na { color: pink;\nbackground: orange; } }",
      message: messages.expectedBeforeMultiLine(),
      line: 3,
      column: 2
    },
    {
      code: "@media print { a\n{ color: pink;\nbackground: orange; } }",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 13
    },
    {
      code: "@media print { a\r\n{ color: pink;\r\nbackground: orange; } }",
      description: "CRLF",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 13
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
      code: "a{ color: pink;\r\nbackground: orange; }",
      description: "CRLF"
    },
    {
      code: "@media print{\na{ color: pink;\nbackground: orange } }"
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
      code: "a { color: pink;\r\nbackground: orange; }",
      description: "CRLF",
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
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 16
    }
  ]
});
