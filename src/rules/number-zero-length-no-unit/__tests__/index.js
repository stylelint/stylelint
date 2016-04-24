import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: "a { top: 0; }",
    description: "unitless zero",
  }, {
    code: "a { padding: 0 /* 0px */; }",
    description: "united zero in comment",
  }, {
    code: "a { top: 10px; }",
    description: "zero at end of non-zero value",
  }, {
    code: "a { top: 100.00px; }",
    description: "zero at end of non-zero value after decimal",
  }, {
    code: "a { top: 100.010px; }",
  }, {
    code: "a { top: 0.10em; }",
    description: "zero at end of non-zero factional value after decimal",
  }, {
    code: "a { top: .1em; }",
    description: "no leading zero factional value",
  }, {
    code: "a { top: 0.01em; }",
    description: "leading zero factional value",
  }, {
    code: "a { padding: 1px 0 2px 3px; }",
    description: "unitless zero in list",
  }, {
    code: "a { padding: 1px 1px 2px 0; }",
    description: "unitless zero in list",
  }, {
    code: "a { color: pink; }",
    description: "no zero",
  }, {
    code: "a { color: #0ac0ac; }",
    description: "hex color value",
  }, {
    code: "a::before { content: \"0px 0em 0cm\"; }",
    description: "zero with units within a string",
  }, {
    code: "a { color: color(rgb(0,0,0) lightness(50%)); }",
    description: "zero in functions",
  }, {
    code: "a { color: color(rgb(0,0,0) lightness(0%)); }",
    description: "% is ok",
  }, {
    code: "a { transition-delay: 0s; }",
    description: "dimension unit is ok",
  }, {
    code: "@media (min-width: 0)",
    description: "media feature",
  }, {
    code: "a { transform: translate(0); }",
    description: "transform function",
  }, {
    code: "a { transition-duration: 0s; }",
    description: "ignore seconds",
  }, {
    code: "a { transition-duration: 0ms; }",
    description: "ignore milliseconds",
  }, {
    code: "a { transition: top 0s; }",
    description: "ignore seconds",
  }, {
    code: "a { transition: top 0ms; }",
    description: "ignore milliseconds",
  }, {
    code: "a { margin: 0%; }",
    description: "ignore percent unit",
  }, {
    code: "@media print and (min-resolution: 0dpi) { }",
    description: "ignore dpi",
  }, {
    code: "@media print and (min-resolution: 0dpcm) { }",
    description: "ignore dpcm",
  }, {
    code: "@media print and (min-resolution: 0dppx) { }",
    description: "ignore dppx",
  } ],

  reject: [ {
    code: "a { top: 0px; }",
    message: messages.rejected,
    line: 1,
    column: 11,
  }, {
    code: "a { top: 0.000px; }",
    message: messages.rejected,
    line: 1,
    column: 15,
  }, {
    code: "a { padding: 0px 1px 2px 3px; }",
    message: messages.rejected,
    line: 1,
    column: 15,
  }, {
    code: "a { padding: 1px 0vmax 2px 3px; }",
    message: messages.rejected,
    line: 1,
    column: 19,
  }, {
    code: "a { padding: 1px 2px 0rem 3px; }",
    message: messages.rejected,
    line: 1,
    column: 23,
  }, {
    code: "a { padding: 1px 2px 3px 0em; }",
    message: messages.rejected,
    line: 1,
    column: 27,
  }, {
    code: "a { padding: calc(1in + 0in * 2)); }",
    message: messages.rejected,
    line: 1,
    column: 26,
  }, {
    code: "@media (min-width: 0px) {}",
    description: "media feature",
    message: messages.rejected,
    line: 1,
    column: 21,
  }, {
    code: "a { transform: translate(0px); }",
    description: "transform function",
    message: messages.rejected,
    line: 1,
    column: 27,
  }, {
    code: "a { margin: 0q; }",
    description: "work with q unit",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})
