"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "/* comment */"
    },
    {
      code: "/*\n multi-line comment\n */\n"
    },
    {
      code: "a { color: red; /* comment */ }"
    }
  ],
  reject: [
    {
      code: "/**/",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: " /* */",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 2
        }
      ]
    },
    {
      code: "\n/*\n*/",
      warnings: [
        {
          message: messages.rejected,
          line: 2,
          column: 1
        }
      ]
    },
    {
      code: "\n /*\r\n*/",
      warnings: [
        {
          message: messages.rejected,
          line: 2,
          column: 2
        }
      ]
    },
    {
      code: "/*\t\t*/",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: "a {/*\r\n*/\n color: red;}",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 4
        }
      ]
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "// blabla",
      description: "ignore inline scss comments"
    },
    {
      code: "a { color: red; } // blabla",
      description: "ignore inline scss comments"
    },
    {
      code: "//\n// blabla\n//",
      description: "ignore inline scss comments group"
    },
    {
      code: "a {\ncolor: red;\n} // blabla\n//\n//\n// blabla",
      description: "ignore inline scss comments group"
    }
  ],

  reject: [
    {
      code: "//",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: "//\n//\n//",
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 1
        },
        {
          message: messages.rejected,
          line: 2,
          column: 1
        },
        {
          message: messages.rejected,
          line: 3,
          column: 1
        }
      ]
    },
    {
      code: "//\n// valid comment group\na {}\n//\n//\n//",
      warnings: [
        {
          message: messages.rejected,
          line: 4,
          column: 1
        },
        {
          message: messages.rejected,
          line: 5,
          column: 1
        },
        {
          message: messages.rejected,
          line: 6,
          column: 1
        }
      ]
    }
  ]
});
