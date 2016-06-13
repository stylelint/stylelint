// import { testRule } from "../../../testUtils"
// import rules from "../../../rules"
// import { ruleName, messages } from ".."

// const rule = rules[ruleName]

// testRule(rule, {
//   ruleName,
//   config: [undefined],
//
//   accept: [ {
//     code: "a { top: 0; }",
//     description: "unitless zero",
//   }, {
//     code: "a { padding: 0 /* 0px */; }",
//     description: "united zero in comment",
//   }, {
//     code: "a { top: 10px; }",
//     description: "zero at end of non-zero value",
//   }, {
//     code: "a { top: 100.00px; }",
//     description: "zero at end of non-zero value after decimal",
//   }, {
//     code: "a { top: 100.010px; }",
//   }, {
//     code: "a { top: 0.10em; }",
//     description: "zero at end of non-zero factional value after decimal",
//   }, {
//     code: "a { top: .1em; }",
//     description: "no leading zero factional value",
//   }, {
//     code: "a { top: 0.01em; }",
//     description: "leading zero factional value",
//   }, {
//     code: "a { padding: 1px 0 2px 3px; }",
//     description: "unitless zero in list",
//   }, {
//     code: "a { padding: 1px 1px 2px 0; }",
//     description: "unitless zero in list",
//   }, {
//     code: "a { color: pink; }",
//     description: "no zero",
//   }, {
//     code: "a { color: #0ac0ac; }",
//     description: "hex color value",
//   }, {
//     code: "a::before { content: \"0px 0em 0cm\"; }",
//     description: "zero with units within a string",
//   }, {
//     code: "a { color: color(rgb(0,0,0) lightness(50%)); }",
//     description: "zero in functions",
//   }, {
//     code: "a { color: color(rgb(0,0,0) lightness(0%)); }",
//     description: "% is ok",
//   }, {
//     code: "a { transition-delay: 0s; }",
//     description: "dimension unit is ok",
//   }, {
//     code: "@media (min-width: 0)",
//     description: "media feature",
//   }, {
//     code: "a { transform: translate(0); }",
//     description: "transform function",
//   }, {
//     code: "a { transition-duration: 0s; }",
//     description: "ignore seconds",
//   }, {
//     code: "a { transition-duration: 0ms; }",
//     description: "ignore milliseconds",
//   }, {
//     code: "a { transition: top 0s; }",
//     description: "ignore seconds",
//   }, {
//     code: "a { transition: top 0ms; }",
//     description: "ignore milliseconds",
//   }, {
//     code: "a { margin: 0%; }",
//     description: "ignore percent unit",
//   }, {
//     code: "@media print and (min-resolution: 0dpi) { }",
//     description: "ignore dpi",
//   }, {
//     code: "@media print and (min-resolution: 0dPi) { }",
//     description: "ignore dpi",
//   }, {
//     code: "@media print and (min-resolution: 0DPI) { }",
//     description: "ignore dpi",
//   }, {
//     code: "@media print and (min-resolution: 0dpcm) { }",
//     description: "ignore dpcm",
//   }, {
//     code: "@media print and (min-resolution: 0dppx) { }",
//     description: "ignore dppx",
//   }, {
//     code: ".a { background: linear-gradient(0deg, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
//     description: "ignore deg",
//   }, {
//     code: ".a { background: linear-gradient(0grad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
//     description: "ignore grad",
//   }, {
//     code: ".a { background: linear-gradient(0turn, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
//     description: "ignore turn",
//   }, {
//     code: ".a { background: linear-gradient(0rad, rgba(7, 29, 73, 0.12) 0%, rgba(7, 29, 73, 0) 80%) #fff; }",
//     description: "ignore rad",
//   } ],
//
//   reject: [ {
//     code: "a { top: 0px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 11,
//   }, {
//     code: "a { tOp: 0px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 11,
//   }, {
//     code: "a { TOP: 0px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 11,
//   }, {
//     code: "a { top: 0pX; }",
//     message: messages.rejected,
//     line: 1,
//     column: 11,
//   }, {
//     code: "a { top: 0PX; }",
//     message: messages.rejected,
//     line: 1,
//     column: 11,
//   }, {
//     code: "a { top: 0.000px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 15,
//   }, {
//     code: "a { padding: 0px 1px 2px 3px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 15,
//   }, {
//     code: "a { padding: 1px 0vmax 2px 3px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 19,
//   }, {
//     code: "a { padding: 1px 2px 0rem 3px; }",
//     message: messages.rejected,
//     line: 1,
//     column: 23,
//   }, {
//     code: "a { padding: 1px 2px 3px 0em; }",
//     message: messages.rejected,
//     line: 1,
//     column: 27,
//   }, {
//     code: "a { padding: calc(1in + 0in * 2)); }",
//     message: messages.rejected,
//     line: 1,
//     column: 26,
//   }, {
//     code: "@media (min-width: 0px) {}",
//     description: "media feature",
//     message: messages.rejected,
//     line: 1,
//     column: 21,
//   }, {
//     code: "a { transform: translate(0px); }",
//     description: "transform function",
//     message: messages.rejected,
//     line: 1,
//     column: 27,
//   }, {
//     code: "a { margin: 0q; }",
//     description: "work with q unit",
//     message: messages.rejected,
//     line: 1,
//     column: 14,
//   } ],
// })

import postcss from "postcss"
import test from "tape"
import stylelint from "../../.."

test("deprecation warning", t => {
  const config = {
    rules: {
      "number-zero-length-no-unit": true,
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { bottom: 0; top: 0px; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "'number-zero-length-no-unit' has been deprecated, and will be removed in '7.0'. Use 'length-zero-no-unit' instead.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Unexpected unit on zero length number (number-zero-length-no-unit)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
