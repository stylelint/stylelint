"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],
  fix: true,
  accept: [
    {
      code: "a { top: 0; }",
      description: "unitless zero"
    },
    {
      description: "ignore calc",
      code: "a { padding: calc(0px +\n 0px); }"
    },
    {
      description: "ignore calc. insensitive",
      code: "a { padding: cAlc(0px + 0px); }"
    },
    {
      description: "ignore calc. empty calc",
      code: "a { padding: calc(); }"
    },
    {
      description: "ignore calc. several `calc`s",
      code: "a { padding: calc(1in + 0in * 2)) 0 calc(0px) 0 }"
    },
    {
      description: "ignore calc, but not inner functions",
      code: "padding: calc(var(--foo, 0) + 10px) 0"
    },
    {
      code: "a { padding: 0 /* 0px */; }",
      description: "united zero in comment"
    },
    {
      code: "a { top: 10px; }",
      description: "zero at end of non-zero value"
    },
    {
      code: "a { top: 100.00px; }",
      description: "zero at end of non-zero value after decimal"
    },
    {
      code: "a { top: 100.010px; }"
    },
    {
      code: "a { top: 0.10em; }",
      description: "zero at end of non-zero factional value after decimal"
    },
    {
      code: "a { top: .1em; }",
      description: "no leading zero factional value"
    },
    {
      code: "a { top: 0.01em; }",
      description: "leading zero factional value"
    },
    {
      code: "a { padding: 1px 0 2px 3px; }",
      description: "unitless zero in list"
    },
    {
      code: "a { padding: 1px 1px 2px 0; }",
      description: "unitless zero in list"
    },
    {
      code: "a { color: pink; }",
      description: "no zero"
    },
    {
      code: "a { color: #0ac0ac; }",
      description: "hex color value"
    },
    {
      code: 'a::before { content: "0px 0em 0cm"; }',
      description: "zero with units within a string"
    },
    {
      code: "a { color: color(rgb(0,0,0) lightness(50%)); }",
      description: "zero in functions"
    },
    {
      code: "a { color: color(rgb(0,0,0) lightness(0%)); }",
      description: "% is ok"
    },
    {
      code: "a { transition-delay: 0s; }",
      description: "dimension unit is ok"
    },
    {
      code: "@media (min-width: 0)",
      description: "media feature"
    },
    {
      code: "a { transform: translate(0); }",
      description: "transform function"
    },
    {
      code: "a { transition-duration: 0s; }",
      description: "ignore seconds"
    },
    {
      code: "a { transition-duration: 0ms; }",
      description: "ignore milliseconds"
    },
    {
      code: "a { transition: top 0s; }",
      description: "ignore seconds"
    },
    {
      code: "a { transition: top 0ms; }",
      description: "ignore milliseconds"
    },
    {
      code: "a { margin: 0%; }",
      description: "ignore percent unit"
    },
    {
      code: "@media print and (min-resolution: 0dpi) { }",
      description: "ignore dpi"
    },
    {
      code: "@media print and (min-resolution: 0dPi) { }",
      description: "ignore dpi"
    },
    {
      code: "@media print and (min-resolution: 0DPI) { }",
      description: "ignore dpi"
    },
    {
      code: "@media print and (min-resolution: 0dpcm) { }",
      description: "ignore dpcm"
    },
    {
      code: "@media print and (min-resolution: 0dppx) { }",
      description: "ignore dppx"
    },
    {
      code:
        "a { background: linear-gradient(0deg, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
      description: "ignore deg"
    },
    {
      code:
        "a { background: linear-gradient(0grad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
      description: "ignore grad"
    },
    {
      code:
        "a { background: linear-gradient(0turn, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
      description: "ignore turn"
    },
    {
      code:
        "a { background: linear-gradient(0rad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
      description: "ignore rad"
    },
    {
      code: "a { margin:0; }",
      description: "no space after colon"
    },
    {
      code: "a { margin:\n0; }",
      description: "newline after colon"
    },
    {
      code: "a { margin:\r\n0; }",
      description: "CRLF after colon"
    },
    {
      code: "a { margin:\t0; }",
      description: "tab after colon"
    },
    {
      code: "a { margin :0; }",
      description: "space before colon"
    },
    {
      code: "a { margin : 0; }",
      description: "space before and after colon"
    }
  ],

  reject: [
    {
      code: "a { top: 0px; }",
      fixed: "a { top: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { tOp: 0px; }",
      fixed: "a { tOp: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { TOP: 0px; }",
      fixed: "a { TOP: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { top: 0pX; }",
      fixed: "a { top: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { top: 0PX; }",
      fixed: "a { top: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    },
    {
      code: "a { top: 0.000px; }",
      fixed: "a { top: 0; }",

      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a { padding: 0px 1px 2px 3px; }",
      fixed: "a { padding: 0 1px 2px 3px; }",

      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a { padding: 1px 0vmax 2px 3px; }",
      fixed: "a { padding: 1px 0 2px 3px; }",

      message: messages.rejected,
      line: 1,
      column: 19
    },
    {
      code: "a { padding: 1px 2px 0rem 3px; }",
      fixed: "a { padding: 1px 2px 0 3px; }",

      message: messages.rejected,
      line: 1,
      column: 23
    },
    {
      code: "a { padding: 1px 2px 3px 0em; }",
      fixed: "a { padding: 1px 2px 3px 0; }",

      message: messages.rejected,
      line: 1,
      column: 27
    },
    {
      description: "ignore calc, but not inner functions",
      code: "padding: calc(var(--foo, 0in) + 10px) 0px",
      fixed: "padding: calc(var(--foo, 0) + 10px) 0",

      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 27
        },
        {
          message: messages.rejected,
          line: 1,
          column: 40
        }
      ]
    },
    {
      description: "ignore calc. has another zero units",
      code: "a { padding: calc(1in + 0in * 2)) 0in calc(0px) 0px }",
      fixed: "a { padding: calc(1in + 0in * 2)) 0 calc(0px) 0 }",

      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 36
        },
        {
          message: messages.rejected,
          line: 1,
          column: 50
        }
      ]
    },
    {
      code: "@media (min-width: 0px) {}",
      fixed: "@media (min-width: 0) {}",

      description: "simple media feature",
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code: "@media screen and (min-width: 0px) {}",
      fixed: "@media screen and (min-width: 0) {}",

      description: "more complicated media feature",
      message: messages.rejected,
      line: 1,
      column: 32
    },
    {
      code: "a { transform: translate(0px); }",
      fixed: "a { transform: translate(0); }",

      description: "transform function",
      message: messages.rejected,
      line: 1,
      column: 27
    },
    {
      code: "a { margin: 0q; }",
      fixed: "a { margin: 0; }",

      description: "work with q unit",
      message: messages.rejected,
      line: 1,
      column: 14
    },
    {
      code: "a { margin:0px; }",
      fixed: "a { margin:0; }",

      description: "no space after colon",
      message: messages.rejected,
      line: 1,
      column: 13
    },
    {
      code: "a { margin:\n0px; }",
      fixed: "a { margin:\n0; }",

      description: "newline after colon",
      message: messages.rejected,
      line: 2,
      column: 2
    },
    {
      code: "a { margin:\r\n0px; }",
      fixed: "a { margin:\r\n0; }",

      description: "CRLF after colon",
      message: messages.rejected,
      line: 2,
      column: 2
    },
    {
      code: "a { margin:\t0px; }",
      fixed: "a { margin:\t0; }",

      description: "tab after colon",
      message: messages.rejected,
      line: 1,
      column: 14
    },
    {
      code: "a { margin :0px; }",
      fixed: "a { margin :0; }",

      description: "space before colon",
      message: messages.rejected,
      line: 1,
      column: 14
    },
    {
      code: "a { margin : 0px; }",
      fixed: "a { margin : 0; }",

      description: "space before and after colon",
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: "a { --x: 0px; }",
      fixed: "a { --x: 0; }",

      message: messages.rejected,
      line: 1,
      column: 11
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  fix: true,
  syntax: "scss",

  reject: [
    {
      code: "@include border-left-radius($input-top-left-radius: 0px);",
      fixed: "@include border-left-radius($input-top-left-radius: 0);",

      message: messages.rejected,
      line: 1,
      column: 54
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignore: ["custom-properties"] }],
  accept: [
    {
      code: "a { --x: 0px; }",
      description: "custom properties"
    }
  ]
});
