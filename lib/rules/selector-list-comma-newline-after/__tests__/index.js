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
      code: "a,\nb {}"
    },
    {
      code: "a,\n\nb {}"
    },
    {
      code: "a,\r\nb {}",
      description: "CRLF"
    },
    {
      code: "a,\r\n\r\nb {}",
      description: "Double CRLF"
    },
    {
      code: "a,\nb,\nc {}"
    },
    {
      code: "a ,\nb {}"
    },
    {
      code: "a\n,\nb {}"
    },
    {
      code: "a\r\n,\r\nb {}",
      description: "CRLF"
    },
    {
      code: 'a,\nb[data-foo="tr,tr"] {}'
    },
    {
      code: "a {\n  &:hover,\n  &:focus {\n    color: pink; }\n}",
      description: "nested in rule set"
    },
    {
      code: "@media (min-width: 10px) {\n  a,\n  b {}\n}",
      description: "nested in at-rule"
    },
    {
      code: "@media (min-width: 10px) {\r\n  a,\r\n  b {}\r\n}",
      description: "nested in at-rule and CRLF"
    },
    {
      code: "\ta,\n\tb {}",
      description: "indented statement"
    },
    {
      code: "a, /* comment */\nb {}",
      description: "with end-of-line comment with newline after"
    },
    {
      code: "a,   /* comment */\nb {}",
      description:
        "with end-of-line and few spaces /* comment */ with newline after"
    },
    {
      code: "a,\t/* comment */\nb {}",
      description: "with end-of-line and a tab /* comment */ with newline after"
    },
    {
      code: "a,\t\t/* comment */\nb {}",
      description:
        "with end-of-line and few tabs /* comment */ with newline after"
    },
    {
      code: "a, \t \t /* comment */\nb {}",
      description:
        "with end-of-line and few tabs and spaces /* comment */ with newline after"
    },
    {
      code: "a, /* comment\n       commentline2 */\nb {}",
      description: "with end-of-line multi-line comment with newline after"
    },
    {
      code: "a,   /* comment\n       commentline2 */\nb {}",
      description:
        "with end-of-line and few spaces multi-line comment with newline after"
    },
    {
      code: "a,\t/* comment\n       commentline2 */\nb {}",
      description:
        "with end-of-line and a tab multi-line comment with newline after"
    },
    {
      code: "a,\t\t/* comment\n       commentline2 */\nb {}",
      description:
        "with end-of-line and few tabs multi-line comment with newline after"
    },
    {
      code: "a, \t \t /* comment\n       commentline2 */\nb {}",
      description:
        "with end-of-line and few tabs and spaces multi-line comment with newline after"
    },
    {
      code: "a:matches(:hover, :focus) {}",
      description: "comma inside :matches()"
    },
    {
      code: ":not(:hover, :focus) {}",
      description: "comma inside :not()"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    }
  ],

  reject: [
    {
      code: "a,b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a, b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,  b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\tb {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb,c {}",
      message: messages.expectedAfter(),
      line: 2,
      column: 2
    },
    {
      code: "a,\r\nb,c {}",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 2,
      column: 2
    },
    {
      code: "a, /* comment */ b {}",
      description: "with post-comma comment without newline after",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a, /* comment\n       commentline2 */b {}",
      description: "with post-comma multi-line comment without newline after",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: "a,\nb {}"
    },
    {
      code: "a,\r\nb {}",
      description: "CRLF"
    },
    {
      code: "a, b {}",
      description: "ignores single-line"
    },
    {
      code: "a, b {\n}",
      description: "ignores single-line selector list, multi-line block"
    },
    {
      code: "a, b {\r\n}",
      description:
        "ignores single-line selector list, multi-line block with CRLF"
    },
    {
      code: "\ta,\n\tb {\n}",
      description: "indented statement"
    }
  ],

  reject: [
    {
      code: "a,\nb, c {}",
      message: messages.expectedAfterMultiLine(),
      line: 2,
      column: 2
    },
    {
      code: "a,\nb, c {\n}",
      message: messages.expectedAfterMultiLine(),
      line: 2,
      column: 2
    },
    {
      code: "a,\r\nb, c {\r\n}",
      description: "CRLF",
      message: messages.expectedAfterMultiLine(),
      line: 2,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [
    {
      code: "a\n,b {}"
    },
    {
      code: "a ,b {}",
      description: "ignores single-line"
    },
    {
      code: "a ,b {\n}",
      description: "ignores single-line selector list, multi-line block"
    },
    {
      code: "a:matches(:hover, :focus) {}",
      description: "comma inside :matches()"
    },
    {
      code: ":not(:hover, :focus) {}",
      description: "comma inside :not()"
    }
  ],

  reject: [
    {
      code: "a,\nb ,c {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a,\r\nb ,c {}",
      description: "CRLF",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb ,c {\n}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "a, // comment\nb {}",
      description: "with end-of-line // comment with newline after"
    },
    {
      code: "a,   // comment\nb {}",
      description:
        "with end-of-line and few spaces // comment with newline after"
    },
    {
      code: "a,\t// comment\nb {}",
      description: "with end-of-line and a tab // comment with newline after"
    },
    {
      code: "a,\t\t// comment\nb {}",
      description: "with end-of-line and few tabs // comment with newline after"
    },
    {
      code: "a, \t \t // comment\nb {}",
      description:
        "with end-of-line and few tabs and spaces // comment with newline after"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "a, // comment\nb {}",
      description: "with end-of-line // comment with newline after"
    },
    {
      code: "a,   // comment\nb {}",
      description:
        "with end-of-line and few spaces // comment with newline after"
    },
    {
      code: "a,\t// comment\nb {}",
      description: "with end-of-line and a tab // comment with newline after"
    },
    {
      code: "a,\t\t// comment\nb {}",
      description: "with end-of-line and few tabs // comment with newline after"
    },
    {
      code: "a, \t \t // comment\nb {}",
      description:
        "with end-of-line and few tabs and spaces // comment with newline after"
    },
    {
      code: ".col( @a, @b ) {}",
      description: "mixin ending in a char"
    },
    {
      code: ".col3( @a, @b ) {}",
      description: "mixin ending in a number"
    }
  ]
});
