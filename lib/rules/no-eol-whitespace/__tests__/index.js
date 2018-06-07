"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [
    {
      code: "",
      description: "empty string"
    },
    {
      code: "\n",
      description: "no nodes"
    },
    {
      code: "a {}",
      description: "no newline"
    },
    {
      code: 'a::before { content: "  \n\t\n"; }',
      description: "breaking the rule within a string"
    },
    {
      code: "a,\nb {}",
      description: "selector delimiter"
    },
    {
      code: "a\n{}",
      description: "before opening brace"
    },
    {
      code: "a {\n  color: pink; }",
      description: "after opening brace with space after newline"
    },
    {
      code: "a { color: pink;\n}",
      description: "before closing brace"
    },
    {
      code: "a { color: pink; }\nb { color: orange; }",
      description: "after closing brace"
    },
    {
      code: "a { color: pink; }\n\n\nb { color: orange; }",
      description: "multiple newlines after closing brace"
    },
    {
      code: "a { color: pink;\n  top: 0; }",
      description: "between declarations with two spaces after newline"
    },
    {
      code: "a { color:\n\tpink; }",
      description: "between properties and values with tab after newline"
    },
    {
      code: "a { background-position: top left,\ntop right; }",
      description: "within values"
    },
    {
      code: "@media print,\nscreen {}",
      description: "within media query list"
    },
    {
      code: "@media print {\n  a { color: pink; } }",
      description: "after opening brace of media query with space after newline"
    },
    {
      code: "a\r{}",
      description: "carriage return opening brace"
    },
    {
      code: "a\n{\n\tcolor: pink;\n\ttop: 0;\n}"
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}"
    }
  ],

  reject: [
    {
      code: " \n",
      description: "no nodes with space before newline",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "/* foo  \nbar */ a { color: pink; }",
      description: "eol-whitespace within a comment",
      message: messages.rejected,
      line: 1,
      column: 8
    },
    {
      code: "a, \nb {}",
      description: "selector delimiter with space before newline",
      message: messages.rejected,
      line: 1,
      column: 3
    },
    {
      code: "a\t\n{}",
      description: "before opening brace with tab before newline",
      message: messages.rejected,
      line: 1,
      column: 2
    },
    {
      code: "a { \n  color: pink; }",
      description: "after opening brace with space before and after newline",
      message: messages.rejected,
      line: 1,
      column: 4
    },
    {
      code: "a { color: pink; \n}",
      description: "before closing brace with space before newline",
      message: messages.rejected,
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink; }\t\nb { color: orange; }",
      description: "after closing brace with tab before newline",
      message: messages.rejected,
      line: 1,
      column: 19
    },
    {
      code: "a { color: pink; } \n\n\nb { color: orange; }",
      message: messages.rejected,
      line: 1,
      column: 19
    },
    {
      code: "a { color: pink; }\n \n\nb { color: orange; }",
      message: messages.rejected,
      line: 2,
      column: 1
    },
    {
      code: "a { color: pink; }\n\n \nb { color: orange; }",
      message: messages.rejected,
      line: 3,
      column: 1
    },
    {
      code: "a { color: pink; \n  top: 0; }",
      description:
        "between declarations with space before and two after newline",
      message: messages.rejected,
      line: 1,
      column: 17
    },
    {
      code: "a { color:\t\n\tpink; }",
      description:
        "between properties and values with tab before and after newline",
      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { background-position: top left, \ntop right; }",
      description: "within values with space before newline",
      message: messages.rejected,
      line: 1,
      column: 35
    },
    {
      code: "@media print, \nscreen {}",
      description: "within media query list with space before newline",
      message: messages.rejected,
      line: 1,
      column: 14
    },
    {
      code: "@media print { \n  a { color: pink; } }",
      description:
        "after opening brace of media query with space before and after newline",
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a\t\r{}",
      description: "tab before carriage return before opening brace",
      message: messages.rejected,
      line: 1,
      column: 2
    },
    {
      code: "a \n{\n\tcolor: pink;\n\ttop: 0;\n}",
      message: messages.rejected,
      line: 1,
      column: 2
    },
    {
      code: "a\n{\t\n\tcolor: pink;\n\ttop: 0;\n}",
      message: messages.rejected,
      line: 2,
      column: 2
    },
    {
      code: "a\n{\n\tcolor: pink; \n\ttop: 0;\n}",
      message: messages.rejected,
      line: 3,
      column: 14
    },
    {
      code: "a\n{\n\tcolor: pink;\n\ttop: 0;  \n}",
      message: messages.rejected,
      line: 4,
      column: 10
    },
    {
      code:
        "@media print { \n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code:
        "@media print {\n  a { \n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 2,
      column: 6
    },
    {
      code:
        "@media print {\n  a {\n  color: pink; \n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 3,
      column: 15
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  } \n}\n\n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 4,
      column: 4
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  }\n} \n\n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 5,
      column: 2
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  }\n}\n \n@media screen {\n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 6,
      column: 1
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen { \n  b { color: orange; }\n}",
      message: messages.rejected,
      line: 7,
      column: 16
    },
    {
      code:
        "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; } \n}",
      message: messages.rejected,
      line: 8,
      column: 23
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "html",

  accept: [
    {
      code: `<div> /* After this comment we have eol whitespace */ 
<style>
a {
  color: red;
}
</style>

</div>`
    }
  ],

  reject: [
    {
      code: `<div>
<style>
a {
  color: red; 
}
</style>

</div>`,
      message: messages.rejected,
      line: 4,
      column: 14
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignore: ["empty-lines"] }],
  skipBasicChecks: true,

  accept: [
    {
      code: "a {}\n     \nb {}",
      description: "empty line with spaces"
    },
    {
      code: "a {}\r\n\t\r\nb {}",
      description: "empty line with a tab and CRLF"
    },
    {
      code: "a {}\n  \t\nb {}",
      description: "empty line with spaces and a tab"
    },
    {
      code: " \n",
      description: "no nodes with space before newline"
    }
  ],

  reject: [
    {
      code: "a { color: pink; \n}",
      description: "typical rejection #1",
      message: messages.rejected,
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink; }\t\n",
      description: "typical rejection #2",
      message: messages.rejected,
      line: 1,
      column: 19
    }
  ]
});
